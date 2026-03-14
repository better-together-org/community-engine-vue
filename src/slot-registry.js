const _registry = {}

export function registerSlotInjection({ target, slot, component, props = {} }) {
  const key = `${target}:${slot}`
  if (!_registry[key]) _registry[key] = []
  _registry[key].push({ component, props })
}

export function getSlotInjections(target, slot) {
  return _registry[`${target}:${slot}`] ?? []
}

export function clearSlotRegistry() {
  Object.keys(_registry).forEach((k) => delete _registry[k])
}
