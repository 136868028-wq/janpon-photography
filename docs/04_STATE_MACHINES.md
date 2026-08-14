# Booking and Payment State Machines

## Booking status
draft
-> holding
-> pending_payment
-> pending_verification
-> confirmed
-> completed

Alternative exits:
holding -> expired
pending_payment -> expired
pending_verification -> cancelled
confirmed -> cancelled
confirmed -> rescheduled
confirmed -> completed
confirmed -> no_show

## Payment status
pending
-> slip_uploaded
-> verified

Alternative:
slip_uploaded -> rejected
pending -> expired
verified -> refunded / partially_refunded

## Rules
- Payment success does not automatically mean booking confirmation in manual-payment V1.
- Admin verification changes payment to verified and booking to confirmed.
- A rejected slip must allow customer re-upload if the booking hold/policy still permits it.
- Every transition must be validated server-side.
- Every admin transition must create an audit log.
