package com.jefferson.bookfly_api.config;


import ch.qos.logback.core.model.ComponentModel;
import com.jefferson.bookfly_api.dto.global.ErrorResponse;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.rmi.server.UID;
import java.time.LocalDateTime;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound( NotFoundException ex, HttpServletRequest request) {

        StackTraceElement origin = ex.getStackTrace()[0];

        String originMessage = origin.getClassName()
                + "." + origin.getMethodName()
                + "() line: "
                + origin.getLineNumber();


        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "NOT_FOUND",
                ex.getMessage(),
                request.getMethod(),
                request.getRequestURI(),
                originMessage

        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }
}