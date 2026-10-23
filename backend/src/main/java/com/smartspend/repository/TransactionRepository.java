package com.smartspend.repository;

import com.smartspend.entity.Transaction;
import com.smartspend.entity.TransactionType;
import com.smartspend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTransactionDateDescIdDesc(User user);

    List<Transaction> findByUserAndTypeOrderByTransactionDateDescIdDesc(User user, TransactionType type);

    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumAmountByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserAndTypeAndDateBetween(
            @Param("user") User user,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT t.category AS category, COALESCE(SUM(t.amount), 0) AS total FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' GROUP BY t.category")
    List<Object[]> sumExpensesByCategory(@Param("user") User user);

    @Query("SELECT t.category AS category, COALESCE(SUM(t.amount), 0) AS total FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' AND t.transactionDate BETWEEN :startDate AND :endDate GROUP BY t.category")
    List<Object[]> sumExpensesByCategoryAndDateBetween(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY t.transactionDate DESC, t.id DESC")
    List<Transaction> searchByTitle(@Param("user") User user, @Param("query") String query);
}
