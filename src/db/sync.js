// ElectricSQL sync stub — wire to actual Electric client when CE Rails runs Electric sidecar.
// TODO: replace with real Electric client integration (Deck #955 / CE Rails sidecar)
//
// The @electric-sql/pglite package handles local persistence.
// This module will handle the sync *transport* once the server-side Electric sidecar is live.

export async function startSync() {
  const electricUrl = import.meta.env?.VITE_ELECTRIC_URL

  if (!electricUrl) {
    // Graceful degradation — local-only mode when Electric URL is not configured
    // eslint-disable-next-line no-console
    console.warn(
      '[@bettertogether/community-engine-vue] VITE_ELECTRIC_URL is not set. ' +
      'Running in local-only mode — data will not sync to the server.'
    )
    return
  }

  // TODO: initialise Electric client and subscribe to shapes once CE Rails sidecar is available
  // Example (future):
  //   import { ElectricDatabase } from '@electric-sql/client'
  //   const { db } = await electrify(pgLiteDb, schema, { url: electricUrl })
  //   await db.sync()
}
