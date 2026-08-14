-- 0001: Helper functions and trigger functions
-- Order: these must exist before tables that reference them.

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- Booking code: 8 chars, unambiguous alphabet (no 0/O/1/I)
-- ============================================================
create or replace function public.generate_booking_code()
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  i int;
begin
  for attempt in 1..50 loop
    code := '';
    for i in 1..8 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    if not exists (select 1 from public.bookings where booking_code = code) then
      return code;
    end if;
  end loop;
  raise exception 'BOOKING_CODE_EXHAUSTED';
end;
$$;

-- ============================================================
-- Role helpers (used by RLS policies). SECURITY DEFINER so the
-- policies can rely on them without recursion through profiles.
-- ============================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.is_active = true
      and p.role in ('owner', 'admin', 'staff')
  );
$$;

create or replace function public.is_owner_or_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.is_active = true
      and p.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_photographer()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.is_active = true
      and p.role = 'photographer'
  ) or exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and p.is_active = true
      and p.role in ('owner', 'admin', 'staff')
  );
$$;

-- ============================================================
-- Auth user bootstrap: create profile (inactive by default) and
-- link existing customer row by email when a customer logs in.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  display_name text := coalesce(meta->>'full_name', meta->>'name', new.email, '');
begin
  insert into public.profiles (user_id, role, full_name, is_active)
  values (new.id, 'staff', display_name, false)
  on conflict (user_id) do nothing;

  update public.customers c
  set auth_user_id = new.id
  where c.auth_user_id is null
    and c.email is not null
    and lower(c.email) = lower(coalesce(new.email, ''));

  return new;
end;
$$;