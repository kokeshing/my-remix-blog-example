/// <reference types="@remix-run/dev" />
/// <reference types="@cloudflare/workers-types" />
import '@remix-run/cloudflare'

export interface Env {
  DB?: D1Database
  R2?: R2Bucket
  GA_TRACKING_ID?: string
}

declare global {
  // CloudflareでのCacheStorageは標準にないプロパティがあるので追加する
  // https://github.com/cloudflare/worker-typescript-template/issues/8
  interface CacheStorage {
    default: Cache
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env
    ctx: EventContext<Env>
  }
}
