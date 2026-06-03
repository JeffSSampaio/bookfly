package com.jefferson.bookfly_api.config;
import com.jefferson.bookfly_api.config.AuditContext;
import java.util.Map;
import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.models.AuditLog;
import com.jefferson.bookfly_api.repository.AuditLogRepository;
import com.jefferson.bookfly_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @AfterReturning(pointcut = "@annotation(auditable)", returning = "result")
    public void registerLog(JoinPoint joinPoint, Auditable auditable, Object result) {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] parameterNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();

        String operador = "SISTEMA";
        StringBuilder extraDetails = new StringBuilder();

        for (int i = 0; i < parameterNames.length; i++) {

            String paramName = parameterNames[i];
            Object paramValue = args[i];

            if (paramValue == null) {
                continue;
            }

            String paramNameLower = paramName.toLowerCase();

            if (paramNameLower.contains("userid")
                    || paramNameLower.contains("adminid")
                    || paramNameLower.contains("operadorid")) {

                operador = userRepository.findById((Long) paramValue)
                        .map(user -> user.getName() + " (ID: " + user.getId() + ")")
                        .orElse("ID: " + paramValue);
            }

            if (!paramNameLower.contains("userid")
                    && !paramNameLower.contains("adminid")
                    && !paramNameLower.contains("operadorid")) {

                extraDetails.append(paramName)
                        .append(": ")
                        .append(paramValue)
                        .append(" | ");
            }
        }

        String details;

        if (!auditable.details().isEmpty()) {

            details = auditable.details();

            for (int i = 0; i < parameterNames.length; i++) {

                String paramName = parameterNames[i];
                Object paramValue = args[i];

                if (paramValue == null) {
                    continue;
                }

                String replacement;

                if (paramName.equalsIgnoreCase("userId")
                        || paramName.equalsIgnoreCase("adminId")
                        || paramName.equalsIgnoreCase("operadorId")) {

                    replacement = userRepository.findById((Long) paramValue)
                            .map(user -> user.getName() + " (ID: " + user.getId() + ")")
                            .orElse(String.valueOf(paramValue));

                } else {
                    replacement = String.valueOf(paramValue);
                }

                details = details.replace(
                        "{" + paramName + "}",
                        replacement
                );
            }

        } else {
            details = extraDetails.toString();
        }

        Map<String, Object> capturedValues = AuditContext.getValues();

        for (Map.Entry<String, Object> entry : capturedValues.entrySet()) {

            details = details.replace(
                    "{" + entry.getKey() + "}",
                    String.valueOf(entry.getValue())
            );
        }

        AuditLog log = new AuditLog();
        String action = auditable.action();

        for (Map.Entry<String, Object> entry : AuditContext.getValues().entrySet()) {

            action = action.replace(
                    "{" + entry.getKey() + "}",
                    String.valueOf(entry.getValue())
            );
        }

        log.setAction(action.toUpperCase());
        log.setOperator(operador.toUpperCase());
        log.setDetails(details.toUpperCase());
        log.setTimestamp(LocalDateTime.now());

        try {
            auditLogRepository.save(log);
        } finally {

            AuditContext.clear();
        }
    }
}