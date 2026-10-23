package com.smartspend.service;

import com.smartspend.dto.BudgetStatusDTO;
import com.smartspend.dto.DashboardSummary;
import com.smartspend.dto.DashboardSummary.CategorySpending;
import com.smartspend.dto.DashboardSummary.MonthlyComparison;
import com.smartspend.entity.Transaction;
import com.smartspend.entity.TransactionType;
import com.smartspend.entity.User;
import com.smartspend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final AuthService authService;
    private final BudgetService budgetService;

    public DashboardService(TransactionRepository transactionRepository,
                            AuthService authService,
                            BudgetService budgetService) {
        this.transactionRepository = transactionRepository;
        this.authService = authService;
        this.budgetService = budgetService;
    }

    public DashboardSummary getDashboardSummary() {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate now = LocalDate.now();

        // 1. Overall Totals
        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;
        BigDecimal availableBalance = totalIncome.subtract(totalExpenses);

        // 2. Current Month Totals
        LocalDate startOfMonth = LocalDate.of(now.getYear(), now.getMonthValue(), 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        BigDecimal currentMonthIncome = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.INCOME, startOfMonth, endOfMonth
        );
        BigDecimal currentMonthExpenses = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, startOfMonth, endOfMonth
        );
        if (currentMonthIncome == null) currentMonthIncome = BigDecimal.ZERO;
        if (currentMonthExpenses == null) currentMonthExpenses = BigDecimal.ZERO;
        BigDecimal currentMonthBalance = currentMonthIncome.subtract(currentMonthExpenses);

        // 3. Category Breakdown (Expenses)
        List<Object[]> rawCategoryData = transactionRepository.sumExpensesByCategory(user);
        List<CategorySpending> categoryBreakdown = new ArrayList<>();
        for (Object[] row : rawCategoryData) {
            String category = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            double pct = 0.0;
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                pct = amount.divide(totalExpenses, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
            }
            categoryBreakdown.add(new CategorySpending(category, amount, Math.round(pct * 10.0) / 10.0));
        }

        // 4. Monthly Comparisons (Past 6 months)
        List<MonthlyComparison> monthlyComparisons = new ArrayList<>();
        DateTimeFormatter monthYearFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            LocalDate mStart = LocalDate.of(monthDate.getYear(), monthDate.getMonthValue(), 1);
            LocalDate mEnd = mStart.withDayOfMonth(mStart.lengthOfMonth());

            BigDecimal mInc = transactionRepository.sumAmountByUserAndTypeAndDateBetween(user, TransactionType.INCOME, mStart, mEnd);
            BigDecimal mExp = transactionRepository.sumAmountByUserAndTypeAndDateBetween(user, TransactionType.EXPENSE, mStart, mEnd);

            monthlyComparisons.add(new MonthlyComparison(
                    mStart.format(monthYearFormatter),
                    mInc != null ? mInc : BigDecimal.ZERO,
                    mExp != null ? mExp : BigDecimal.ZERO
            ));
        }

        // 5. Recent Transactions (last 6 transactions)
        List<Transaction> allTransactions = transactionRepository.findByUserOrderByTransactionDateDescIdDesc(user);
        List<Transaction> recentTransactions = allTransactions.stream().limit(6).toList();

        // 6. Current Budget Status
        BudgetStatusDTO budgetStatus = budgetService.getBudgetStatus(now.getMonthValue(), now.getYear());

        DashboardSummary summary = new DashboardSummary();
        summary.setTotalIncome(totalIncome);
        summary.setTotalExpenses(totalExpenses);
        summary.setAvailableBalance(availableBalance);
        summary.setCurrentMonthIncome(currentMonthIncome);
        summary.setCurrentMonthExpenses(currentMonthExpenses);
        summary.setCurrentMonthBalance(currentMonthBalance);
        summary.setCategoryBreakdown(categoryBreakdown);
        summary.setMonthlyComparisons(monthlyComparisons);
        summary.setRecentTransactions(recentTransactions);
        summary.setBudgetStatus(budgetStatus);

        return summary;
    }
}
