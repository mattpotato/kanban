create table "public"."task_list" (
    "id" uuid not null default gen_random_uuid(),
    "title" text,
    "created_at" timestamp with time zone not null default now(),
    "project_id" uuid,
    "position" double precision default '65535'::double precision,
    "creator_id" uuid not null
);


CREATE UNIQUE INDEX task_list_pkey ON public.task_list USING btree (id);

alter table "public"."task_list" add constraint "task_list_pkey" PRIMARY KEY using index "task_list_pkey";

alter table "public"."task_list" add constraint "task_list_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."task_list" validate constraint "task_list_creator_id_fkey";

alter table "public"."task_list" add constraint "task_list_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."task_list" validate constraint "task_list_project_id_fkey";


