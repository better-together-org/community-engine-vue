import { getCevContext } from './context'
import { registerSlotInjection } from './slot-registry'
import { registerExtensionMigration } from './db/client'

export function defineExtension(spec) {
  return {
    ...spec,

    _install() {
      const { app, router } = getCevContext()

      // Register extension DB migrations (must run before getDb() is awaited elsewhere)
      if (spec.migrations?.length) {
        spec.migrations.forEach(({ version, sql }) => registerExtensionMigration(version, sql))
      }

      // Register global components
      if (spec.components) {
        Object.entries(spec.components).forEach(([name, component]) => {
          app.component(name, component)
        })
      }

      // Add platform-level routes
      if (spec.routes?.length) {
        spec.routes.forEach((route) => router.addRoute(route))
      }

      // Add community child routes (as siblings under CommunityHome)
      if (spec.communityRoutes?.length) {
        spec.communityRoutes.forEach((route) => router.addRoute('CommunityHome', route))
      }

      // Register slot injections
      if (spec.slotInjections?.length) {
        spec.slotInjections.forEach((injection) => registerSlotInjection(injection))
      }

      // Run custom setup hook
      if (spec.setup) {
        spec.setup(getCevContext())
      }
    },
  }
}
