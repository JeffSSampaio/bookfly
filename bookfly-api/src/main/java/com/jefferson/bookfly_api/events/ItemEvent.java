package com.jefferson.bookfly_api.events;

import com.jefferson.bookfly_api.enums.ItemEventAction;

public record ItemEvent(
        String topic,
        ItemEventAction action
) {
}
