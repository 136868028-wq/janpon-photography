# Product Requirements Document (PRD)

## 1. Goals
- Let customers check availability and book quickly on mobile.
- Prevent double bookings.
- Collect a fixed 500 THB deposit.
- Give staff a clear operational dashboard.
- Track customers, payments, services and marketing sources.
- Keep the first version inexpensive while preserving an upgrade path.

## 2. Customer features
### Public
- Home
- Services
- Service detail
- Packages/pricing
- Portfolio
- Reviews
- FAQ
- Contact
- Availability
- Booking

### Booking
1. Select service
2. Select date
3. Select time slot
4. Enter customer information or authenticate
5. Review booking
6. Hold slot temporarily
7. Display payment instructions/QR
8. Upload payment slip
9. Show pending verification
10. Show confirmed booking after admin verification

### Customer portal
- Search/view booking
- Booking status
- Payment status
- Appointment details
- Upload replacement slip if rejected
- Request reschedule/cancellation

## 3. Admin features
- Dashboard
- Booking list
- Calendar
- Booking detail
- Customer CRM
- Payment verification
- Services
- Packages
- Availability
- Blocked dates
- Photographers
- Portfolio CMS
- Reviews
- Notifications
- Analytics
- Settings
- Audit log

## 4. Dashboard KPIs
- Today's bookings
- Monthly bookings
- Confirmed bookings
- Pending payment verification
- Completed bookings
- Cancellations
- Deposit collected
- Outstanding balance
- Revenue
- Average booking value
- Conversion rate
- Booking source
- Popular services

## 5. Marketing tracking
Booking links may contain:
- source
- campaign
- medium
Example: /book?source=facebook&campaign=august

Do not make QR scanning mandatory for online posts.

## 6. Non-functional requirements
- Responsive/mobile-first
- Accessible controls and sufficient contrast
- Fast page load
- Server-side validation
- RLS
- Rate limiting
- Error logging
- Auditability
- SEO for public pages
- Thai locale and Asia/Bangkok timezone
