// instrumentation.ts
// Runs once when the Next.js server starts, before it handles any request.
// Loads lib/env so a missing environment variable stops the server with a clear error.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./lib/env");
  }
}
