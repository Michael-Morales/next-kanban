# NEXT KANBAN

I created this kanban like management app with the goal of simulating a professional work environment.

[Live Demo](https://next-kanban.netlify.app)

## How I worked on this project

- I built the UI based on Figma designs
- I worked with tasks with github projects
- I used feature branches and pull requests

## Why I built the project this way

- I used Tailwindcss to style the app for its simplicity of use and keep the styles in the same file as the component's JSX.
- I used React Query instead of a global state management library like Redux to avoid the client side and server side data to be out of sync. Also because React Query caches the data and avoids unnecessary calls to the API.
- I used Next Auth as an authentication library to make the most out of the features that this library provides out of the box (JWT, CSRF tokens, ...).
- I used Zod along side React Hook Form to validate user inputs on the client and the server.

## Stack

### Front

- Next.js
- React Query
- Next Auth
- Axios
- Tailwindcss
- React Hook Form
- Zod

### Back

- Next.js API routes
- Prisma ORM
- Supabase Postgresql database
- Argon2

### Deployment

- Netlify
