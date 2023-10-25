create table "public"."project" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "creator_id" uuid,
    "title" text default 'Untitled Project'::text
);


alter table "public"."project" enable row level security;

CREATE UNIQUE INDEX project_pkey ON public.project USING btree (id);

alter table "public"."project" add constraint "project_pkey" PRIMARY KEY using index "project_pkey";

alter table "public"."project" add constraint "project_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project" validate constraint "project_creator_id_fkey";


