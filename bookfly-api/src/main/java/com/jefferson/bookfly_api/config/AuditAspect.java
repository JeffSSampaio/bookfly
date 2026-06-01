package com.jefferson.bookfly_api.config;


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

        String operador = "SISTEMA/DESCONHECIDO";
        StringBuilder extraDetails = new StringBuilder();


        for (int i = 0; i < parameterNames.length; i++) {
            String paramName = parameterNames[i].toLowerCase();
            Object paramValue = args[i];

            if (paramValue == null) continue;


            if (paramName.contains("userid") || paramName.contains("adminid") || paramName.contains("operadorid")) {
                operador = userRepository.findById((Long) paramValue)
                        .map(u -> u.getName() + " (ID: " + u.getId() + ")")
                        .orElse("ID: " + paramValue);
            }


            if (!paramName.contains("userid") && !paramName.contains("adminid")) {
                extraDetails.append(parameterNames[i]).append(": ").append(paramValue).append(" | ");
            }
        }


        AuditLog log = new AuditLog();
        log.setAction(auditable.action().toUpperCase());
        log.setOperator(operador);


        String finalDetails = auditable.details().isEmpty() ? extraDetails.toString() : auditable.details();
        log.setDetails(finalDetails);

        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }
}