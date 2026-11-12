# Posts App

A small posts manager built with **Next.js 16** (App Router, Cache Components) and **Prisma 7** on PostgreSQL.

You can list, create, edit and delete posts, mark posts available or unavailable, and update the availability of many posts at once.

## Tech stack

- [Next.js 16](https://nextjs.org/docs) with the App Router, Server Actions and `"use cache"`
- [React 19](https://react.dev)
- [Prisma 7](https://www.prisma.io/docs) with the `@prisma/adapter-pg` driver adapter
- PostgreSQL (Prisma Postgres)
- [Ant Design 6](https://ant.design) for UI components (tables, forms, modals, buttons)
- [Tailwind CSS 4](https://tailwindcss.com) for page layout and spacing
- TypeScript, ESLint and Prettier

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DATABASE"
```

The server checks this on startup and stops with a clear error if it is missing.

### 3. Set up the database

```bash
npx prisma migrate dev
```

This applies the migrations in `prisma/migrations` and generates the Prisma client into `app/generated/prisma`.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | What it does                               |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the development server               |
| `npm run build`        | Build for production                       |
| `npm start`            | Run the production build                   |
| `npm run lint`         | Check the code with ESLint                 |
| `npm run format`       | Format every file with Prettier            |
| `npm run format:check` | Check formatting without changing anything |

## Project structure

```
app/
  api/posts/            REST API for external clients (POST, PUT, DELETE, bulk PATCH)
  post/                 /post list page, /post/[id] detail page, Server Actions, error boundary
  layout.tsx            Root layout with header and footer
  page.tsx              Home page
components/
  layout/               Header and footer
  posts/                Posts table, post form, create / edit / delete buttons
  navigation/           LinkButton: an antd Button that navigates like Next.js <Link>
  antd.ts               "use client" re-exports of antd pieces used in Server Components
lib/
  data/posts.ts         Data access layer: the only code that queries the Post table
  validations/post.ts   Input checks shared by Server Actions and API routes
  env.ts                Environment variable checks
  http.ts               Helpers for API route handlers
  prisma.ts             Shared Prisma client
types/post.ts           Shared Post types
prisma/                 Schema and migrations
instrumentation.ts      Runs at server start (checks environment variables)
```

## How data flows

- **Reading:** pages call `getPosts()` and `getPost(id)` in `lib/data/posts.ts`. Both are cached with `"use cache"` and tagged (`posts`, `post-{id}`), so the database is only queried when data has changed.
- **Changing data from the UI:** forms call Server Actions in `app/post/actions.ts`. Each action validates the input, writes through the data layer, then expires only the affected cache tags with `updateTag`. The page updates without a manual refresh.
- **Changing data from outside the app:** the API routes in `app/api/posts` use the same validation and data layer, and expire tags with `revalidateTag`.

## API

All request and response bodies are JSON. Invalid input returns `400`, a missing post returns `404`.

| Method   | Route             | Body                                                 | Result                 |
| -------- | ----------------- | ---------------------------------------------------- | ---------------------- |
| `POST`   | `/api/posts`      | `{ "title": "…", "body": "…", "isAvailable": true }` | The created post (201) |
| `PUT`    | `/api/posts/{id}` | `{ "title": "…", "body": "…", "isAvailable": true }` | The updated post       |
| `DELETE` | `/api/posts/{id}` | —                                                    | A confirmation message |
| `PATCH`  | `/api/posts/bulk` | `{ "updates": [{ "id": 1, "isAvailable": true }] }`  | `{ "count": 1 }`       |

`isAvailable` is optional on `POST` (defaults to `false`) and `PUT` (keeps the saved value). The bulk route accepts up to 500 updates, each post at most once.
