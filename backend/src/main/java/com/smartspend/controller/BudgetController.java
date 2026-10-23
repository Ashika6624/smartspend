package com.smartspend.controller;

import com.smartspend.dto.BudgetRequest;
import com.smartspend.dto.BudgetStatusDTO;
import com.smartspend.entity.Budget;
import com.smartspend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        List<Budget> budgets = budgetService.getBudgets(month, year);
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<Budget> saveOrUpdateBudget(@Valid @RequestBody BudgetRequest request) {
        Budget budget = budgetService.saveOrUpdateBudget(request);
        return new ResponseEntity<>(budget, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(Map.of("message", "Budget deleted successfully"));
    }

    @GetMapping("/status")
    public ResponseEntity<BudgetStatusDTO> getBudgetStatus(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        BudgetStatusDTO status = budgetService.getBudgetStatus(month, year);
        return ResponseEntity.ok(status);
    }
}
