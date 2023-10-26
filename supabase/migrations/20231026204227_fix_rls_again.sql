alter table "public"."task" alter column "position" set not null;

create policy "Enable update for users based on email"
on "public"."task"
as permissive
for update
to public
using ((auth.uid() = creator_id))
with check ((auth.uid() = creator_id));



