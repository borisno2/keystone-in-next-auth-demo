# Keystone in NextJS with Supabase and Supabase Auth

A POC showing ^

# Information and Requirements

This repo using `pnpm` to get start install pnpm (https://pnpm.io/installation) and run `pnpm install` then `pnpm dev` to start. Once started go to http://localhost:3000, Keystone Admin UI is available at http://localhost:3000/admin. Use seed data or supabase to setup different users with there correct supabase `id`.

You will need to set your `DATABASE_URL` environment variable to you supabase postgres DB URL and the following will need to be set for Supabase: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
