-- Allow users to update their own jobs
create policy if not exists "Users can update their own jobs"
on public.jobs
for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

-- Allow superadmins to update any job
create policy if not exists "Superadmins can update any job"
on public.jobs
for update
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'superadmin'
))
with check (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid() and profiles.role = 'superadmin'
));