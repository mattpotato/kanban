alter table "public"."task" drop constraint "task_list_id_fkey";

alter table "public"."task" add constraint "task_list_id_fkey" FOREIGN KEY (list_id) REFERENCES task_list(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."task" validate constraint "task_list_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."task"
as permissive
for delete
to public
using ((auth.uid() = creator_id));


create policy "Enable update task based on user id"
on "public"."task"
as permissive
for update
to public
using ((auth.uid() = creator_id))
with check ((auth.uid() = creator_id));



