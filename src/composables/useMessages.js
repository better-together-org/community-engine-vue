import { useResource } from './useResource'

export function useMessages(conversationId = null) {
  return useResource('messages', conversationId ? { conversation_id: conversationId } : {})
}
