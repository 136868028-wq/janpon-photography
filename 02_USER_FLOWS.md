# User Flows

## Customer booking
Social post
-> /book
-> Choose service
-> Calendar
-> Choose date
-> Choose slot
-> Customer details/auth
-> Review
-> Create temporary hold
-> Payment instructions
-> Upload slip
-> Pending verification
-> Admin verifies
-> Confirmed

## Calendar states
- Available morning + evening
- Available morning only
- Available evening only
- Full
- Closed
- Past/unavailable

Never communicate availability through color alone.

## Booking hold
When customer commits to a slot:
- Create a hold with expiration timestamp.
- Default hold duration: 10 minutes.
- A held slot must not be bookable by another customer.
- Expired holds are released.
- Successful verification converts booking to confirmed.
- Failed/expired payment releases the slot according to business rules.

## Admin payment flow
Pending verification
-> Open slip
-> Verify amount/reference/details
-> Approve OR reject
-> Write audit log
-> Update payment status
-> Update booking status
-> Notify customer

## Cancellation
Customer/admin requests cancellation
-> Check policy
-> Calculate refund if applicable
-> Update booking/payment
-> Release slot
-> Audit log
