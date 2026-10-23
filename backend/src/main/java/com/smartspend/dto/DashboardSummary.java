package com.smartspend.dto;

import com.smartspend.entity.Transaction;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardSummary {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal availableBalance;

    private BigDecimal currentMonthIncome;
    private BigDecimal currentMonthExpenses;
    private BigDecimal currentMonthBalance;

    private List<CategorySpending> categoryBreakdown;
    private List<MonthlyComparison> monthlyComparisons;
    private List<Transaction> recentTransactions;

    private BudgetStatusDTO budgetStatus;

    public static class CategorySpending {
        private String category;
        private BigDecimal amount;
        private double percentage;

        public CategorySpending() {
        }

        public CategorySpending(String category, BigDecimal amount, double percentage) {
            this.category = category;
            this.amount = amount;
            this.percentage = percentage;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }
    }

    public static class MonthlyComparison {
        private String month;
        private BigDecimal income;
        private BigDecimal expense;

        public MonthlyComparison() {
        }

        public MonthlyComparison(String month, BigDecimal income, BigDecimal expense) {
            this.month = month;
            this.income = income;
            this.expense = expense;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public BigDecimal getIncome() {
            return income;
        }

        public void setIncome(BigDecimal income) {
            this.income = income;
        }

        public BigDecimal getExpense() {
            return expense;
        }

        public void setExpense(BigDecimal expense) {
            this.expense = expense;
        }
    }

    public DashboardSummary() {
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getAvailableBalance() {
        return availableBalance;
    }

    public void setAvailableBalance(BigDecimal availableBalance) {
        this.availableBalance = availableBalance;
    }

    public BigDecimal getCurrentMonthIncome() {
        return currentMonthIncome;
    }

    public void setCurrentMonthIncome(BigDecimal currentMonthIncome) {
        this.currentMonthIncome = currentMonthIncome;
    }

    public BigDecimal getCurrentMonthExpenses() {
        return currentMonthExpenses;
    }

    public void setCurrentMonthExpenses(BigDecimal currentMonthExpenses) {
        this.currentMonthExpenses = currentMonthExpenses;
    }

    public BigDecimal getCurrentMonthBalance() {
        return currentMonthBalance;
    }

    public void setCurrentMonthBalance(BigDecimal currentMonthBalance) {
        this.currentMonthBalance = currentMonthBalance;
    }

    public List<CategorySpending> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategorySpending> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<MonthlyComparison> getMonthlyComparisons() {
        return monthlyComparisons;
    }

    public void setMonthlyComparisons(List<MonthlyComparison> monthlyComparisons) {
        this.monthlyComparisons = monthlyComparisons;
    }

    public List<Transaction> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<Transaction> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public BudgetStatusDTO getBudgetStatus() {
        return budgetStatus;
    }

    public void setBudgetStatus(BudgetStatusDTO budgetStatus) {
        this.budgetStatus = budgetStatus;
    }
}
