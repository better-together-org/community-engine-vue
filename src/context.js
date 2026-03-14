let _context = null

export function setCevContext(ctx) {
  _context = ctx
}

export function getCevContext() {
  if (!_context) {
    throw new Error(
      '[@bettertogether/community-engine-vue] Plugin not installed. ' +
      'Call app.use(CommunityEngineVue) before accessing the plugin context.'
    )
  }
  return {
    ..._context,
    get router() { return _context.app?.config?.globalProperties?.$router },
  }
}
