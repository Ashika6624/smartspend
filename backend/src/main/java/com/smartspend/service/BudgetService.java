package com.smartspend.service;

import com.smartspend.dto.BudgetRequest;
import com.smartspend.dto.BudgetStatusDTO;
import com.smartspend.dto.BudgetStatusDTO.CategoryBudgetStatus;
import com.smartspend.entity.Budget;
import com.smartspend.entity.TransactionType;
import com.smartspend.entity.User;
import com.smartspend.exception.BadRequestException;
import com.smartspend.exception.ResourceNotFoundException;
import com.smartspend.repository.BudgetRepository;
import com.smartspend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final AuthService authService;

    public BudgetService(BudgetRepository budgetRepository,
                         TransactionRepository transactionRepository,
                         AuthService authService) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.authService = authService;
    }

    public List<Budget> getBudgets(Integer month, Integer year) {
        User user = authService.getCurrentAuthenticatedUser();
        if (month != null && year != null) {
            return budgetRepository.findByUserAndMonthAndYear(user, month, year);
        }
        return budgetRepository.findByUserOrderByYearDescMonthDesc(user);
    }

    @Transactional
    public Budget saveOrUpdateBudget(BudgetRequest request) {
        User user = authService.getCurrentAuthenticatedUser();

        // Check if a budget already exists for this user, category, month, year
        Optional<Budget> existingOpt = budgetRepository.findByUserAndCategoryIgnoreCaseAndMonthAndYear(
                user, request.getCategory().trim(), request.getMonth(), request.getYear()
        );

        Budget budget;
        if (existingOpt.isPresent()) {
            budget = existingOpt.get();
            budget.setBudgetAmount(request.getBudgetAmount());
        } else {
            budget = new Budget();
            budget.setBudgetAmount(request.getBudgetAmount());
            budget.setCategory(request.getCategory().trim());
            budget.setMonth(request.getMonth());
            budget.setYear(request.getYear());
            budget.setUser(user);
        }

        return budgetRepository.save(budget);
    }

    @Transactional
    public void deleteBudget(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to delete this budget");
        }

        budgetRepository.delete(budget);
    }

    public BudgetStatusDTO getBudgetStatus(Integer month, Integer year) {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate now = LocalDate.now();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        int targetYear = (year != null) ? year : now.getYear();

        LocalDate startDate = LocalDate.of(targetYear, targetMonth, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // Get monthly overall expense
        BigDecimal totalSpent = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, startDate, endDate
        );
        if (totalSpent == null) totalSpent = BigDecimal.ZERO;

        // Fetch all budgets for this month & year
        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, targetMonth, targetYear);

        BigDecimal overallBudget = BigDecimal.ZERO;
        List<CategoryBudgetStatus> categoryStatuses = new ArrayList<>();

        // Group actual expenses by category for this month
        List<Object[]> categoryExpensesRaw = transactionRepository.sumExpensesByCategoryAndDateBetween(user, startDate, endDate);
        Map<String, BigDecimal> actualCategoryExpenses = new HashMap<>();
        for (Object[] row : categoryExpensesRaw) {
            String cat = (String) row[0];
            BigDecimal amt = (BigDecimal) row[1];
            actualCategoryExpenses.put(cat.toLowerCase(), amt);
        }

        for (Budget b : budgets) {
            if ("OVERALL".equalsIgnoreCase(b.getCategory()) || "ALL".equalsIgnoreCase(b.getCategory())) {
                overallBudget = b.getBudgetAmount();
            } else {
                BigDecimal spentForCat = actualCategoryExpenses.getOrDefault(b.getCategory().toLowerCase(), BigDecimal.ZERO);
                BigDecimal remainingForCat = b.getBudgetAmount().subtract(spentForCat);
                double pct = 0.0;
                if (b.getBudgetAmount().compareTo(BigDecimal.ZERO) > 0) {
                    pct = spentForCat.divide(b.getBudgetAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
                }
                String catStatus = "NORMAL";
                if (pct >= 100.0) {
                    catStatus = "EXCEEDED";
                } else if (pct >= 80.0) {
                    catStatus = "WARNING";
                }

                categoryStatuses.add(new CategoryBudgetStatus(
                        b.getId(),
                        b.getCategory(),
                        b.getBudgetAmount(),
                        spentForCat,
                        remainingForCat,
                        Math.round(pct * 100.0) / 100.0,
                        catStatus
                ));
            }
        }

        BudgetStatusDTO dto = new BudgetStatusDTO();
        dto.setMonthlyBudget(overallBudget);
        dto.setTotalExpense(totalSpent);
        BigDecimal remainingBudget = overallBudget.subtract(totalSpent);
        dto.setRemainingBudget(remainingBudget);

        double pctUsed = 0.0;
        if (overallBudget.compareTo(BigDecimal.ZERO) > 0) {
            pctUsed = totalSpent.divide(overallBudget, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
        }
        dto.setPercentageUsed(Math.round(pctUsed * 100.0) / 100.0);

        if (overallBudget.compareTo(BigDecimal.ZERO) > 0 && totalSpent.compareTo(overallBudget) > 0) {
            dto.setStatus("EXCEEDED");
            dto.setAlertMessage("Alert! You have exceeded your monthly budget by ₹" + totalSpent.subtract(overallBudget));
        } else if (overallBudget.compareTo(BigDecimal.ZERO) > 0 && pctUsed >= 80.0) {
            dto.setStatus("WARNING");
            dto.setAlertMessage("Warning: You have used " + Math.round(pctUsed) + "% of your monthly budget.");
        } else {
            dto.setStatus("NORMAL");
            dto.setAlertMessage("Your spending is within your budget limit.");
        }

        dto.setCategoryStatuses(categoryStatuses);
        return dto;
    }
}
