# Keystone in NextJS with Next Auth

A POC showing ^

# Information and Requirements

This repo using `pnpm` to get start install pnpm (https://pnpm.io/installation) and run `pnpm install` then `pnpm dev` to start. Once started go to http://localhost:3000, Keystone Admin UI is available at http://localhost:3000/admin however you will need to signin with a user with the role of 'ADMIN' as middleware will stop any other user accessing `/admin`. Use seed data to setup different users with there correct `subjectId`.

This demo repository uses Yoga GraphQL, please refer to their documentation here: https://the-guild.dev/graphql/yoga-server/docs/

This is currently setup to use Auth0 - See https://next-auth.js.org/ for setting up different provider

For a video demonstration of how to deploy this app on Vercel, please check out My YouTube video: https://www.youtube.com/watch?v=Wq6eQVyW8ug

