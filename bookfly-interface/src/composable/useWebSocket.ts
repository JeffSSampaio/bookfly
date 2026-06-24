import { onUnmounted } from 'vue'
import { Client } from '@stomp/stompjs'

export function useWebSocket(topic: string, onUpdate: () => void) {
  const client = new Client({
    brokerURL: 'ws://localhost:8080/ws',  
    onConnect: () => {
      client.subscribe(`/topic/${topic}`, () => {
        onUpdate()
      })
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame)
    },
  })

  client.activate()
  onUnmounted(() => client.deactivate())
}