package com.smartspend.service;

import com.smartspend.dto.TransactionRequest;
import com.smartspend.entity.Transaction;
import com.smartspend.entity.TransactionType;
import com.smartspend.entity.User;
import com.smartspend.exception.BadRequestException;
import com.smartspend.exception.ResourceNotFoundException;
import com.smartspend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AuthService authService;

    public TransactionService(TransactionRepository transactionRepository, AuthService authService) {
        this.transactionRepository = transactionRepository;
        this.authService = authService;
    }

    public List<Transaction> getAllTransactions(TransactionType type, String category, LocalDate startDate, LocalDate endDate, String search) {
        User user = authService.getCurrentAuthenticatedUser();
        List<Transaction> list = transactionRepository.findByUserOrderByTransactionDateDescIdDesc(user);

        return list.stream()
                .filter(t -> type == null || t.getType() == type)
                .filter(t -> category == null || category.trim().isEmpty() || t.getCategory().equalsIgnoreCase(category.trim()))
                .filter(t -> startDate == null || !t.getTransactionDate().isBefore(startDate))
                .filter(t -> endDate == null || !t.getTransactionDate().isAfter(endDate))
                .filter(t -> search == null || search.trim().isEmpty() ||
                        t.getTitle().toLowerCase().contains(search.trim().toLowerCase()) ||
                        (t.getNotes() != null && t.getNotes().toLowerCase().contains(search.trim().toLowerCase())))
                .sorted(Comparator.comparing(Transaction::getTransactionDate).reversed().thenComparing(Transaction::getId).reversed())
                .collect(Collectors.toList());
    }

    public Transaction getTransactionById(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to view this transaction");
        }

        return transaction;
    }

    @Transactional
    public Transaction createTransaction(TransactionRequest request) {
        User user = authService.getCurrentAuthenticatedUser();

        Transaction transaction = new Transaction();
        transaction.setTitle(request.getTitle().trim());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory().trim());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNotes(request.getNotes() != null ? request.getNotes().trim() : "");
        transaction.setUser(user);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction updateTransaction(Long id, TransactionRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to modify this transaction");
        }

        transaction.setTitle(request.getTitle().trim());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory().trim());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNotes(request.getNotes() != null ? request.getNotes().trim() : "");

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }

    public String exportTransactionsCsv() {
        User user = authService.getCurrentAuthenticatedUser();
        List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDescIdDesc(user);

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        // CSV Header
        pw.println("ID,Title,Type,Category,Amount,Date,Notes");

        for (Transaction t : transactions) {
            String safeNotes = t.getNotes() != null ? t.getNotes().replace("\"", "\"\"") : "";
            pw.printf("%d,\"%s\",%s,\"%s\",%.2f,%s,\"%s\"%n",
                    t.getId(),
                    t.getTitle().replace("\"", "\"\""),
                    t.getType(),
                    t.getCategory().replace("\"", "\"\""),
                    t.getAmount(),
                    t.getTransactionDate(),
                    safeNotes
            );
        }

        pw.flush();
        return sw.toString();
    }
}
