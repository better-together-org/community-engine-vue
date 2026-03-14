import { useResource } from './useResource'

export function useNotifications(personId = null) {
  return useResource('notifications', personId ? { person_id: personId } : {})
}
