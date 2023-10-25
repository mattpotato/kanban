create policy "Enable update for projects on email"
on "public"."project"
as permissive
for update
to public
using ((auth.uid() = creator_id))
with check ((auth.uid() = creator_id));



