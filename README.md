## Kanban Board
Organize your projects and tasks. Made with TypeScript, React, Next.js, PostgreSQL, Supabase.

See it live on https://canban-pi.vercel.app/

(Work in progress)

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Copy `.env.local.example` to a new file `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

3. Setup supabase and run supabase migrations (Docker is required):

     ```
     npx supabase init
     npx supabase start
     npx supabase login
     npx supabase link --project-ref <project-id>
     npx supabase db reset
     npx supabase db push
     ```

4. You can now run the Next.js local development server:

   ```bash
   yarn dev
   ```

   The app should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
