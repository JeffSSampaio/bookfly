package com.jefferson.bookfly_api.config;


import ch.qos.logback.core.model.ComponentModel;
import com.jefferson.bookfly_api.dto.global.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex, HttpServletRequest request) {

        StackTraceElement origin = ex.getStackTrace()[0];
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage() + " | Origin: " +
                        origin.getClassName() + ":" + origin.getLineNumber(),
                request.getRequestURI()
        );


        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}