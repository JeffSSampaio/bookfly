package com.jefferson.bookfly_api.interfaces;

public interface IPdfReportStrategy<T> {
    String getTitle();
    String[] getHeaders();
    String[] getRow(T item);
}
