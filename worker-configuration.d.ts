// Cloudflare binding types for local type-checking.
//
// The actual bindings are configured in `vite.config.ts` (via
// `.openai/hosting.json`), which wires up a D1 database bound as `DB`.
// `@cloudflare/workers-types` defines `Cloudflare.Env` as an empty
// interface intended to be extended per-project (see its comment: "You
// can use `wrangler types` to generate the `Env` type automatically").
// This project has no wrangler.toml to run that command against, so the
// binding is declared here by hand instead.
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
  }
}

type Env = Cloudflare.Env;
