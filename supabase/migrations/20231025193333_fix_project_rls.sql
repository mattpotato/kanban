create policy "Enable insert for authenticated users only"
on "public"."project"
as permissive
for insert
to authenticated
with check ((auth.uid() = creator_id));



