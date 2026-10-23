package com.smartspend.config;

import com.smartspend.entity.Budget;
import com.smartspend.entity.Transaction;
import com.smartspend.entity.TransactionType;
import com.smartspend.entity.User;
import com.smartspend.repository.BudgetRepository;
import com.smartspend.repository.TransactionRepository;
import com.smartspend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           TransactionRepository transactionRepository,
                           BudgetRepository budgetRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String demoEmail = "demo@smartspend.com";
        if (userRepository.findByEmail(demoEmail).isEmpty()) {
            logger.info("Initializing demo data for SmartSpend...");

            // 1. Create Demo User
            User demoUser = new User();
            demoUser.setName("Ashika Poojary");
            demoUser.setEmail(demoEmail);
            demoUser.setPassword(passwordEncoder.encode("password123"));
            demoUser = userRepository.save(demoUser);

            LocalDate now = LocalDate.now();

            // 2. Sample Incomes
            transactionRepository.save(new Transaction(
                    "Monthly Software Engineer Salary",
                    new BigDecimal("65000.00"),
                    TransactionType.INCOME,
                    "Salary",
                    now.withDayOfMonth(1),
                    "Direct bank deposit",
                    demoUser
            ));

            transactionRepository.save(new Transaction(
                    "Freelance Fullstack Project",
                    new BigDecimal("15000.00"),
                    TransactionType.INCOME,
                    "Freelance",
                    now.withDayOfMonth(10),
                    "Client payment for React dashboard",
                    demoUser
            ));

            transactionRepository.save(new Transaction(
                    "Previous Month Salary",
                    new BigDecimal("65000.00"),
                    TransactionType.INCOME,
                    "Salary",
                    now.minusMonths(1).withDayOfMonth(1),
                    "Previous month regular payout",
                    demoUser
            ));

            // 3. Sample Expenses
            transactionRepository.save(new Transaction(
                    "House Rent & Utilities",
                    new BigDecimal("15000.00"),
                    TransactionType.EXPENSE,
                    "Bills",
                    now.withDayOfMonth(2),
                    "Monthly apartment rent",
                    demoUser
            ));

            transactionRepository.save(new Transaction(
                    "Supermarket Groceries & Essentials",
                    new BigDecimal("6500.00"),
                    TransactionType.EXPENSE,
                    "Food",
                    now.withDayOfMonth(5),
                    "Monthly organic pantry restock",
                    demoUser
            ));

            transactionRepository.save(new Transaction(
                    "Fine Dining & Weekend Cafe",
                    new BigDecimal("2800.00"),
                    TransactionType.EXPENSE,
                    "Food",
                    now.withDayOfMonth(12),
                    "Weekend dinner with friends",
                    demoUser
            ));

            transactionRepository.save(new Transaction(
                    "Fuel & Metro Smart Card Recharge",
                    new BigDecimal("3200.00"),
                    TransactionType.EXPENSE,
                    "Travel",
                    now.withDayOfMonth(8),
                    "Daily office commute expenses",
                    demoUser
            ));

            transactionRepository.save(new Transaction(
                    "Cloud Computing Certification & Books",
                    new BigDecimal("3500.00"),
                    TransactionType.EXPENSE,
                    "Education",
                    now.withDayOfMonth(14),
                    "Exam voucher and study materials",
                    demoUser
            ));

            transactionRepository.save(new Transaction(
                    "Cinema & Weekend Entertainment",
                    new BigDecimal("1800.00"),
                    TransactionType.EXPENSE,
                    "Entertainment",
                    now.withDayOfMonth(16),
                    "Movie tickets and snacks",
                    demoUser
            ));

            // Historical expenses for trend chart
            transactionRepository.save(new Transaction(
                    "Previous Month Living Expenses",
                    new BigDecimal("28500.00"),
                    TransactionType.EXPENSE,
                    "Bills",
                    now.minusMonths(1).withDayOfMonth(15),
                    "Previous month total living expenses",
                    demoUser
            ));

            // 4. Sample Budgets
            budgetRepository.save(new Budget(
                    new BigDecimal("45000.00"),
                    "OVERALL",
                    now.getMonthValue(),
                    now.getYear(),
                    demoUser
            ));

            budgetRepository.save(new Budget(
                    new BigDecimal("12000.00"),
                    "Food",
                    now.getMonthValue(),
                    now.getYear(),
                    demoUser
            ));

            budgetRepository.save(new Budget(
                    new BigDecimal("6000.00"),
                    "Travel",
                    now.getMonthValue(),
                    now.getYear(),
                    demoUser
            ));

            budgetRepository.save(new Budget(
                    new BigDecimal("18000.00"),
                    "Bills",
                    now.getMonthValue(),
                    now.getYear(),
                    demoUser
            ));

            logger.info("Demo data created successfully! Email: demo@smartspend.com, Password: password123");
        }
    }
}
