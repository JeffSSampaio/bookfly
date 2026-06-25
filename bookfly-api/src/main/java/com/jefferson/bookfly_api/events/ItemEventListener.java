package com.jefferson.bookfly_api.events;

import com.jefferson.bookfly_api.events.ItemEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ItemEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @EventListener
    public void onItemEvent(ItemEvent event) {
        messagingTemplate.convertAndSend("/topic/" + event.topic(), event.action());
    }
}