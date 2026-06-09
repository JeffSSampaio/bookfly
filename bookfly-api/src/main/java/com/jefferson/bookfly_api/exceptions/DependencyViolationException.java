package com.jefferson.bookfly_api.exceptions;

public class DependencyViolationException extends RuntimeException {
    public DependencyViolationException(String message) {
        super(message);
    }
}
