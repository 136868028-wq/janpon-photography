# Authentication and Authorization

## Customer
V1:
- Google OAuth through Supabase
- Guest booking allowed
- Customer phone is required for booking
- Email optional for guest booking
- LINE user ID optional customer contact field

V2:
- LINE Login
- LINE notifications / Messaging API if required

## Recommendation
Do not force authentication before customers can view availability.
Authenticate/collect details near the booking confirmation step.

## Admin
- Google OAuth
- Role-based authorization
- Owner, Admin, Staff, Photographer

## Security
- Server-side role checks
- Supabase Row Level Security
- No client-only admin protection
- No service-role key in browser
- Validate all user input
