package com.smartspend.dto;

import java.math.BigDecimal;
import java.util.List;

public class BudgetStatusDTO {

    private BigDecimal monthlyBudget;
    private BigDecimal totalExpense;
    private BigDecimal remainingBudget;
    private double percentageUsed;
    private String status; // "NORMAL", "WARNING", "EXCEEDED"
    private String alertMessage;
    private List<CategoryBudgetStatus> categoryStatuses;

    public static class CategoryBudgetStatus {
        private Long budgetId;
        private String category;
        private BigDecimal budgetAmount;
        private BigDecimal spentAmount;
        private BigDecimal remainingAmount;
        private double percentageUsed;
        private String status; // "NORMAL", "WARNING", "EXCEEDED"

        public CategoryBudgetStatus() {
        }

        public CategoryBudgetStatus(Long budgetId, String category, BigDecimal budgetAmount, BigDecimal spentAmount, BigDecimal remainingAmount, double percentageUsed, String status) {
            this.budgetId = budgetId;
            this.category = category;
            this.budgetAmount = budgetAmount;
            this.spentAmount = spentAmount;
            this.remainingAmount = remainingAmount;
            this.percentageUsed = percentageUsed;
            this.status = status;
        }

        public Long getBudgetId() {
            return budgetId;
        }

        public void setBudgetId(Long budgetId) {
            this.budgetId = budgetId;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public BigDecimal getBudgetAmount() {
            return budgetAmount;
        }

        public void setBudgetAmount(BigDecimal budgetAmount) {
            this.budgetAmount = budgetAmount;
        }

        public BigDecimal getSpentAmount() {
            return spentAmount;
        }

        public void setSpentAmount(BigDecimal spentAmount) {
            this.spentAmount = spentAmount;
        }

        public BigDecimal getRemainingAmount() {
            return remainingAmount;
        }

        public void setRemainingAmount(BigDecimal remainingAmount) {
            this.remainingAmount = remainingAmount;
        }

        public double getPercentageUsed() {
            return percentageUsed;
        }

        public void setPercentageUsed(double percentageUsed) {
            this.percentageUsed = percentageUsed;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public BudgetStatusDTO() {
    }

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public double getPercentageUsed() {
        return percentageUsed;
    }

    public void setPercentageUsed(double percentageUsed) {
        this.percentageUsed = percentageUsed;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAlertMessage() {
        return alertMessage;
    }

    public void setAlertMessage(String alertMessage) {
        this.alertMessage = alertMessage;
    }

    public List<CategoryBudgetStatus> getCategoryStatuses() {
        return categoryStatuses;
    }

    public void setCategoryStatuses(List<CategoryBudgetStatus> categoryStatuses) {
        this.categoryStatuses = categoryStatuses;
    }
}
