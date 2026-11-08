# React + Vite

## Button styles

Use `btn app-btn-secondary` for secondary actions and add `btn-sm` for compact
controls. Toggle buttons can use `aria-pressed` to show the selected state.
The shared style is defined in `src/styles/buttons.css`.

## Device access

Owners can rename devices and mark them as child devices in Settings → Device
Settings. Child devices and viewer accounts can browse and request rewards but
cannot access settings or the editing screens. Device access cannot grant more
access than the signed-in account. Changes to the current device are observed
from Firestore while the app is open. Reward requests are stored in the
`familyGroups/{family}/children/{child}/rewardRequests` Firestore collection,
so Firestore rules must allow family members to read and create requests and
owners to remove them.

These are client-side interface restrictions, not a security boundary: enforce
permissions in Firestore rules and on the Worker before relying on them to
protect data.

## Admin approval environment

The admin panel is available in the development build. Its approval environment
selector defaults to Development (`http://127.0.0.1:8787`) and can be switched
to the production Worker. The chosen environment is shown on approval pages and
applies to pending lists, approvals, rejections and the template lookup for skill
names. Returning to the panel keeps the selection; opening the panel without an
environment in the URL defaults back to Development.
The existing `/api/templates` lookup used for skill names can also seed or
backfill missing templates in the selected environment.

Development requires a local Worker running on the browser's device, for
example with `npm run worker:dev`; its local KV is separate from production.
The placeholder `env.dev` KV IDs in `wrangler.toml` do not configure a deployed
development environment. Developer tools and template editing are not switched
by the approval selector and continue to use the app's normal API.
Production approvals modify live data. The Worker currently does not authenticate
these endpoints, so the development-only admin UI is not a security boundary.

## Legacy tracker-state migration

The app recognizes the original unencrypted child state when all seven tracker
arrays and a numeric `starBalance` are present. On the first load it encrypts
and checks the complete original record using the family's Firestore key. The
Worker checks that the original has not changed, saves a copy under
`migration-backup:<child-id>:<uuid>` in `TRACKER_DATA`, and writes the encrypted
record. The app reads it back and verifies it before enabling changes.

Deploy the Worker before the frontend. Before migrating, independently back up
the current KV record and retain the Firestore encryption key. Close other app
sessions and use one device during migration: KV is eventually consistent and
the hash check is not an atomic compare-and-swap. Verification may need to wait
for KV caches to update. If loading fails, saving is blocked; retry or restore
from the backup rather than creating replacement data.

The migration backup is **unencrypted** and does not expire. After confirming
the encrypted data is correct and storing a secure backup, remove the plaintext
backup from KV when it is no longer needed. The existing Worker routes do not
authenticate requests; restrict access before relying on them for private data.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
