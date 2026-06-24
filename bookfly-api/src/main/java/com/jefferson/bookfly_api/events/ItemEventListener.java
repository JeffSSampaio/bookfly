package com.jefferson.bookfly_api.events;

import com.jefferson.bookfly_api.events.ItemEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ItemEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void onItemEvent(ItemEvent event) {
        messagingTemplate.convertAndSend("/topic/" + event.topic(), event.action());
    }
}