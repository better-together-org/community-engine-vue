# Community Engine Vue

Vue 2 plugin for the [Better Together Community Engine](https://bebettertogether.ca) platform. Provides shared components, Vuex store modules, Vue Router routes, and API clients for Better Together host applications.

> **Note:** This package targets Vue 2. A Vue 3 migration is planned — see [Migration Plan](#vue-3-migration-plan).

## Installation

```bash
yarn add @bettertogether/community-engine-vue
# or
npm install @bettertogether/community-engine-vue
```

## Usage

Register the plugin in your app's entry point:

```js
import Vue from 'vue'
import CommunityEngineVue from '@bettertogether/community-engine-vue'

Vue.use(CommunityEngineVue)
```

### Router integration

Import and spread the provided routes into your own router:

```js
import { BtRoutes } from '@bettertogether/community-engine-vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    ...BtRoutes,
    // your app's own routes
  ],
})
```

### Store integration

Import and merge the provided store modules and plugins:

```js
import { BtStoreModules, BtStorePlugins } from '@bettertogether/community-engine-vue'

export default new Vuex.Store({
  modules: { ...BtStoreModules },
  plugins: [...BtStorePlugins],
})
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VUE_APP_BETTER_TOGETHER_API_URI` | `http://localhost:3000` | Base URL of the Community Engine Rails API |

## Exported API Surface

### Components

| Component | Description |
|---|---|
| `BtHeader` | App header with branding and navigation |
| `BtNavBar` | Navigation bar |
| `BtNavItem` | Individual nav link |
| `BtNavUser` | Authenticated user menu |
| `BtBrandingLogo` | Logo component |
| `BtMainContent` | Main layout wrapper / router-view host |
| `BtUserSignInForm` | Login form |
| `BtUserSignUpForm` | Registration form |
| `BtUserResetPasswordForm` | Password reset request form |
| `BtUserNewPasswordForm` | New password form (token-based) |
| `BtUserResendConfirmationForm` | Resend confirmation email form |
| `BtProfileForm` | User profile editing form |
| `CommunityForm` | Community creation/editing form |

### Vuex Store Modules

All modules are namespaced under `CommunityEngine/`:

| Module | Namespace | Description |
|---|---|---|
| Authentication | `CommunityEngine/Authentication` | Login state, current user |
| Communities | `CommunityEngine/Communities` | Community data |
| Menus | `CommunityEngine/Menus` | Header and nav menu items |
| People | `CommunityEngine/People` | User/person profiles |

### Router Routes (`BtRoutes`)

| Path | Name |
|---|---|
| `/` | Home |
| `/me` | Me (user profile) |
| `/users/sign-in` | Sign In |
| `/users/sign-up` | Sign Up |
| `/users/password/reset` | Reset Password |
| `/users/password/new` | New Password |
| `/users/confirmation/resend` | Resend Confirmation |
| `/users/confirmation` | Account Confirmation |

## Development

```bash
# Install dependencies
yarn install

# Start dev server
yarn serve

# Build for production
yarn build

# Run E2E tests
yarn test:e2e

# Run unit tests
yarn test:unit

# Lint
yarn lint
```

## Vue 3 Migration Plan

Migration to Vue 3 is planned. Key changes will include:

- Vue 2 → Vue 3 (with `@vue/compat` bridge phase)
- Vuex → Pinia
- Vue Router 3 → Vue Router 4
- BootstrapVue 2 → BootstrapVue Next (or Oruga + Bootstrap 5)
- Webpack (Vue CLI) → Vite
- Options API → Composition API (`<script setup>`)
- Auth guards rewritten as reactive Pinia-based `beforeEach` callbacks

## License

LGPL-3.0-or-later
