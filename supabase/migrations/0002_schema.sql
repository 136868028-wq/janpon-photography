-- 0002: Core schema
-- Design decisions (see docs/15_ARCHITECTURE_DECISIONS.md):
--  * Statuses use TEXT + CHECK constraints (not PG enums) so future
--    statuses can be added with a single ALTER, no enum surgery.
--  * bookings.photographer_id is NOT NULL. V1 runs a single default
--    photographer (photographers.is_default). NULL would silently break
--    the partial unique index that prevents double booking.
--  * Double-booking prevention: partial unique index on
--    (photographer_id, booking_date, start_time) for active statuses.
--    Postgres enforces this atomically — the loser of a race gets a
--    23505 error. This is the Source of Truth, never the browser.
--  * booking_holds.booking_id is NOT NULL + UNIQUE: every hold creates
--    a booking row in 'holding' status immediately, so the single
--    partial unique index covers holds too.

create extension if not exists pgcrypto;

-- ============================================================
-- profiles (authorization)
-- ============================================================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'staff', 'photographer')),
  full_name text not null default '',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- customers (CRM)
-- ============================================================
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  line_user_id text,
  avatar_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_phone_idx on public.customers (phone);
create index customers_email_idx on public.customers (lower(email));

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ============================================================
-- services
-- ============================================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  cover_image_url text,
  base_price numeric(12, 2) not null check (base_price >= 0),
  deposit_amount numeric(12, 2) not null check (deposit_amount >= 0),
  default_duration_minutes integer not null check (default_duration_minutes > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ============================================================
-- packages
-- ============================================================
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  deposit_amount numeric(12, 2) check (deposit_amount >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  deliverables jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index packages_service_id_idx on public.packages (service_id);

create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- ============================================================
-- photographers
-- ============================================================
create table public.photographers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null,
  phone text,
  bio text,
  avatar_url text,
  is_active boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger photographers_set_updated_at
  before update on public.photographers
  for each row execute function public.set_updated_at();

-- ============================================================
-- availability_rules
-- weekday is ISO: 1=Mon .. 7=Sun. V1 defines one row per slot.
-- ============================================================
create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid references public.photographers(id) on delete cascade,
  weekday smallint not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null check (end_time > start_time),
  max_bookings integer not null default 1 check (max_bookings >= 1),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index availability_rules_weekday_idx on public.availability_rules (weekday, is_active);

create trigger availability_rules_set_updated_at
  before update on public.availability_rules
  for each row execute function public.set_updated_at();

-- ============================================================
-- blocked_dates
-- start_time/end_time NULL = whole day blocked.
-- ============================================================
create table public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid references public.photographers(id) on delete cascade,
  date date not null,
  start_time time,
  end_time time,
  reason text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index blocked_dates_date_idx on public.blocked_dates (date);

-- ============================================================
-- bookings
-- ============================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  package_id uuid references public.packages(id) on delete set null,
  photographer_id uuid not null references public.photographers(id) on delete restrict,
  booking_date date not null,
  start_time time not null,
  end_time time not null check (end_time > start_time),
  status text not null default 'holding'
    check (status in (
      'draft', 'holding', 'pending_payment', 'pending_verification',
      'confirmed', 'completed', 'expired', 'cancelled', 'rescheduled', 'no_show'
    )),
  source text,
  campaign text,
  medium text,
  customer_note text,
  admin_note text,
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  deposit_amount numeric(12, 2) not null check (deposit_amount >= 0),
  paid_amount numeric(12, 2) not null default 0 check (paid_amount >= 0),
  remaining_amount numeric(12, 2) not null default 0 check (remaining_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

-- THE double-booking guard. Only one active booking per
-- (photographer, date, start_time). Inserting a second one fails
-- with error 23505 — no app-level lock needed.
create unique index bookings_active_slot_uniq
  on public.bookings (photographer_id, booking_date, start_time)
  where status in ('holding', 'pending_payment', 'pending_verification', 'confirmed');

create index bookings_date_status_idx on public.bookings (booking_date, status);
create index bookings_customer_id_idx on public.bookings (customer_id);
create index bookings_status_idx on public.bookings (status);
create index bookings_source_idx on public.bookings (source);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ============================================================
-- booking_holds — temporary slot reservation during payment
-- ============================================================
create table public.booking_holds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  token text not null unique,
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  expires_at timestamptz not null,
  status text not null default 'active'
    check (status in ('active', 'expired', 'released', 'converted')),
  created_at timestamptz not null default now()
);

create index booking_holds_status_expiry_idx on public.booking_holds (status, expires_at);

-- ============================================================
-- payments — deposit payment per booking (V1: one row per booking)
-- ============================================================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete restrict,
  provider text not null default 'manual_slip',
  method text not null default 'promptpay',
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'THB',
  status text not null default 'pending'
    check (status in (
      'pending', 'slip_uploaded', 'verified', 'rejected', 'expired',
      'refunded', 'partially_refunded'
    )),
  transaction_reference text,
  slip_url text,
  paid_at timestamptz,
  verified_at timestamptz,
  verified_by uuid references public.profiles(id) on delete set null,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_status_idx on public.payments (status);
create index payments_booking_id_idx on public.payments (booking_id);

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ============================================================
-- payment_events — idempotent record of provider/webhook events (V2)
-- ============================================================
create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id) on delete set null,
  provider_event_id text unique,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- notifications
-- ============================================================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'line', 'page')),
  type text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  recipient text,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_customer_status_idx on public.notifications (customer_id, status);

-- ============================================================
-- portfolio_items
-- ============================================================
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('wedding', 'graduation', 'portfolio', 'event')),
  description text not null default '',
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger portfolio_items_set_updated_at
  before update on public.portfolio_items
  for each row execute function public.set_updated_at();

-- ============================================================
-- reviews
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index reviews_published_idx on public.reviews (is_published, created_at desc);

-- ============================================================
-- leads
-- ============================================================
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  source text not null default 'direct',
  campaign text,
  medium text,
  service_id uuid references public.services(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'lost')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- tracking_events — marketing funnel (visit -> ... -> confirmed)
-- ============================================================
create table public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event_name text not null check (event_name in (
    'visit', 'service_view', 'calendar_view', 'booking_started',
    'payment_started', 'slip_uploaded', 'confirmed'
  )),
  source text,
  campaign text,
  medium text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index tracking_events_session_idx on public.tracking_events (session_id);
create index tracking_events_created_idx on public.tracking_events (created_at);

-- ============================================================
-- payment_settings — merchant QR config. Single row (id = 1).
-- ============================================================
create table public.payment_settings (
  id smallint primary key default 1 check (id = 1),
  payment_method text not null default 'promptpay',
  bank_name text,
  account_name text not null default '',
  promptpay_id text,
  qr_image_url text,
  default_deposit_amount numeric(12, 2) not null default 500 check (default_deposit_amount >= 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- audit_logs — append-only from the app layer (service role only)
-- ============================================================
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);
create index audit_logs_created_idx on public.audit_logs (created_at desc);
create index audit_logs_action_idx on public.audit_logs (action);

-- ============================================================
-- Auth bootstrap trigger
-- ============================================================
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Scheduled hold expiry sweep (Supabase pg_cron). Availability is
-- always computed lazily (see get_availability), this job only keeps
-- booking.status tidy: holding -> expired once the hold has lapsed.
-- ============================================================
do $$
begin
  if to_regnamespace('cron') is not null then
    perform cron.schedule(
      'expire-booking-holds',
      '*/5 * * * *',
      'select public.expire_stale_holds()'
    );
  end if;
exception when others then
  raise notice 'pg_cron unavailable; hold expiry runs lazily';
end;
$$;