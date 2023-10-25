create policy "Enable insert for users based on user_id"
on "public"."project"
as permissive
for insert
to public
with check ((auth.uid() = creator_id));


create policy "Enable read access for owned porojects"
on "public"."project"
as permissive
for select
to public
using ((auth.uid() = creator_id));



