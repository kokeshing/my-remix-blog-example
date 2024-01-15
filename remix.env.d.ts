/// <reference types="@remix-run/dev" />
/// <reference types="@cloudflare/workers-types" />
import '@remix-run/cloudflare'

export interface Env {
  DB?: D1Database
  R2?: R2Bucket
  GA_TRACKING_ID?: string
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext extends AppLoadContext {
    env: Env
    ctx: EventContext<Env>
  }
}
