create table "public"."task" (
    "id" uuid not null default gen_random_uuid(),
    "title" text default 'Untitled Task'::text,
    "position" double precision default '65535'::double precision,
    "created_at" timestamp with time zone not null default now(),
    "list_id" uuid,
    "project_id" uuid,
    "creator_id" uuid
);


alter table "public"."task" enable row level security;

CREATE UNIQUE INDEX task_pkey ON public.task USING btree (id);

alter table "public"."task" add constraint "task_pkey" PRIMARY KEY using index "task_pkey";

alter table "public"."task" add constraint "task_list_id_fkey" FOREIGN KEY (list_id) REFERENCES task_list(id) not valid;

alter table "public"."task" validate constraint "task_list_id_fkey";

alter table "public"."task" add constraint "task_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."task" validate constraint "task_project_id_fkey";


