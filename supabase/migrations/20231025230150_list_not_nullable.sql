alter table "public"."task_list" alter column "position" set not null;

create policy "Enable update for projects based on user id"
on "public"."project"
as permissive
for update
to public
using ((auth.uid() = creator_id))
with check ((auth.uid() = creator_id));



