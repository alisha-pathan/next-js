// lib/env.ts
// Reads and checks the environment variables the server needs.
// Fails immediately with a clear message instead of at the first database query.

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to your .env file (see README.md).`
    );
  }

  return value;
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
};
