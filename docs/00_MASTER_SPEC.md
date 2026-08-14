# Photography Booking Platform — Master Specification

## Purpose
ระบบจองคิวและบริหารงานสำหรับธุรกิจถ่ายภาพ รองรับลูกค้า, Booking, Calendar, Payment, Portfolio, CRM, Admin Dashboard และ Analytics โดยออกแบบให้เริ่มต้นต้นทุนต่ำและสามารถขยายเป็นระบบธุรกิจจริงได้

## Current business rules
- Services: Wedding, Graduation, Portfolio, Event
- Deposit: 500 THB per booking
- Booking has morning/evening slots initially
- Social posts use a booking link, not a QR-to-book
- QR is primarily used for payment and offline media
- Payment V1: PromptPay/merchant QR + customer uploads slip + admin verification
- Payment V2 may use a payment gateway + webhook
- Customer auth: Google Login + Guest Booking initially; LINE Login can be added later
- Database: Supabase PostgreSQL
- Frontend/backend: Next.js + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Hosting target: Cloudflare Workers
- Media: Cloudflare R2 or Supabase Storage depending on implementation constraints

## Non-negotiable principles
1. Never confirm a booking merely because the customer clicked "I paid".
2. Booking slots must be protected against double booking.
3. Use temporary booking holds before payment.
4. Payment status and booking status are separate.
5. Prices and deposit amounts must be database/config driven, not hard-coded.
6. Admin authorization must be enforced server-side.
7. Secrets must never reach the browser.
8. Do not collect unnecessary personal data.
9. All important state changes should be auditable.
10. Mobile-first UX is mandatory.

## Primary user flow
Social post -> booking link -> service -> date -> time slot -> customer details/auth -> booking hold -> payment -> slip upload -> admin verification -> confirmed booking -> notification.

## Future-ready capabilities
- Multiple photographers
- Multiple packages
- Different durations
- Different deposit amounts
- Blocked dates
- Rescheduling
- Refunds
- Coupons
- Customer CRM
- Reviews
- Analytics
- LINE notifications
