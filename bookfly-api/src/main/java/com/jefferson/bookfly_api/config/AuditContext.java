package com.jefferson.bookfly_api.config;

import java.util.HashMap;
import java.util.Map;

public class AuditContext {

    private static final ThreadLocal<Map<String, Object>> VALUES =
            ThreadLocal.withInitial(HashMap::new);

    public static void capture(String key, Object value) {
        VALUES.get().put(key, value);
    }

    public static Map<String, Object> getValues() {
        return VALUES.get();
    }

    public static void clear() {
        VALUES.remove();
    }
}