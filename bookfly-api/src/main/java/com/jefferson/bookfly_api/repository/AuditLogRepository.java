package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog,Long> {
}
