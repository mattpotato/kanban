create policy "Enable delete for users based on user_id"
on "public"."project"
as permissive
for delete
to public
using ((auth.uid() = creator_id));

