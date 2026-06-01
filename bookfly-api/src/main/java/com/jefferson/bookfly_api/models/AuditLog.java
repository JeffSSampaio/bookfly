package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String operator;

    @Column(columnDefinition = "TEXT")
    private String details;

    private LocalDateTime timestamp;
}