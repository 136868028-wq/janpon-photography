# Database Schema Blueprint

## customers
- id UUID PK
- auth_user_id UUID nullable/unique
- full_name
- phone
- email nullable
- line_user_id nullable
- avatar_url nullable
- notes nullable
- created_at
- updated_at

## services
- id UUID PK
- name
- slug unique
- description
- cover_image_url
- base_price
- deposit_amount
- default_duration_minutes
- is_active
- sort_order
- created_at
- updated_at

## packages
- id UUID PK
- service_id FK
- name
- description
- price
- deposit_amount nullable
- duration_minutes
- deliverables JSONB
- is_active
- created_at
- updated_at

## photographers
- id UUID PK
- user_id nullable
- display_name
- phone nullable
- bio nullable
- avatar_url nullable
- is_active
- created_at
- updated_at

## availability_rules
- id UUID PK
- photographer_id nullable
- weekday
- start_time
- end_time
- max_bookings
- is_active

## blocked_dates
- id UUID PK
- photographer_id nullable
- date
- start_time nullable
- end_time nullable
- reason
- created_by
- created_at

## bookings
- id UUID PK
- booking_code unique
- customer_id FK
- service_id FK
- package_id nullable FK
- photographer_id nullable FK
- booking_date
- start_time
- end_time
- status
- source nullable
- campaign nullable
- customer_note nullable
- admin_note nullable
- subtotal
- deposit_amount
- paid_amount
- remaining_amount
- created_at
- updated_at
- confirmed_at nullable
- completed_at nullable
- cancelled_at nullable

## booking_holds
- id UUID PK
- booking_id FK nullable
- booking_date
- start_time
- end_time
- expires_at
- status
- created_at

## payments
- id UUID PK
- booking_id FK
- provider
- method
- amount
- currency
- status
- transaction_reference nullable
- slip_url nullable
- paid_at nullable
- verified_at nullable
- verified_by nullable
- rejection_reason nullable
- created_at
- updated_at

## payment_events
- id UUID PK
- payment_id nullable
- provider_event_id unique nullable
- event_type
- payload JSONB
- processed_at
- created_at

## notifications
- id UUID PK
- customer_id nullable
- booking_id nullable
- channel
- type
- status
- recipient
- payload JSONB
- sent_at nullable
- created_at

## portfolio_items
- id UUID PK
- title
- slug
- category
- description
- cover_image_url
- gallery JSONB
- is_published
- sort_order
- created_at
- updated_at

## reviews
- id UUID PK
- booking_id nullable
- customer_id nullable
- rating
- comment
- is_published
- created_at

## leads
- id UUID PK
- customer_id nullable
- source
- campaign nullable
- service_id nullable
- status
- notes
- created_at
- updated_at

## tracking_events
- id UUID PK
- session_id
- event_name
- source nullable
- campaign nullable
- metadata JSONB
- created_at

## admins / profiles
Use Supabase auth.users for authentication and a profile/role table for authorization.
Roles:
- owner
- admin
- staff
- photographer

## payment_settings
- id UUID PK
- payment_method
- bank_name nullable
- account_name
- promptpay_id nullable
- qr_image_url nullable
- default_deposit_amount
- is_active
- updated_at

## audit_logs
- id UUID PK
- actor_user_id nullable
- action
- entity_type
- entity_id
- old_data JSONB nullable
- new_data JSONB nullable
- ip_hash nullable
- created_at

## Required indexes/constraints
- unique booking_code
- unique active booking per resource/date/time where applicable
- indexes on booking_date, status, customer_id, payment status
- prevent overlapping active bookings
- RLS on all customer-sensitive tables
