# Security and Privacy Checklist

## Authentication
- Supabase Auth
- OAuth redirect allowlist
- Secure cookies/session
- Role-based authorization

## Database
- RLS enabled
- Least-privilege policies
- Index sensitive lookup fields
- Avoid exposing unnecessary customer data

## Payments
- Never store banking passwords
- Never trust client payment status
- Verify payment evidence
- Webhook signature verification in V2
- Idempotent payment event handling

## Files
- Validate file type and size
- Private bucket for payment slips
- Signed URLs for admin/customer access
- Do not make customer payment slips public

## Personal data
Potential data:
- name
- phone
- email
- LINE identifier
- booking information
- payment evidence

Collect only what is necessary.
Provide privacy notice and retention/deletion policy.
Do not expose phone numbers in public pages.

## Audit
Log:
- admin login
- booking status changes
- payment verification/rejection
- refunds
- customer data changes
- availability changes

## Operational
- environment variables
- backups
- error monitoring
- rate limiting
- bot protection where needed
