create policy "Enable insert for authenticated users only"
on "public"."task"
as permissive
for insert
to authenticated
with check ((auth.uid() = creator_id));


create policy "Enable read access for authenticated user's own task"
on "public"."task"
as permissive
for select
to public
using ((auth.uid() = creator_id));



