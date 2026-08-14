# API / Server Action Specification

## Public
GET /api/services
GET /api/services/:slug
GET /api/availability?date=YYYY-MM-DD
POST /api/booking/hold
POST /api/booking
GET /api/booking/:code
POST /api/payment/slip
POST /api/customer/lookup

## Admin
GET /api/admin/bookings
GET /api/admin/bookings/:id
PATCH /api/admin/bookings/:id
GET /api/admin/payments/pending
POST /api/admin/payments/:id/verify
POST /api/admin/payments/:id/reject
POST /api/admin/availability/block
DELETE /api/admin/availability/block/:id
GET /api/admin/dashboard
GET /api/admin/customers

## Webhook V2
POST /api/webhooks/payment

## Rules
- Validate with Zod
- Authorization on server
- Rate-limit public endpoints
- Return safe errors
- Do not expose database internals
- Use transactions for booking/hold operations where possible
