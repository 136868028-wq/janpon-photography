# Payment Specification

## Version 1 — Low-cost/manual verification

### Method
- Merchant PromptPay/Thai QR or approved bank QR
- Fixed deposit: 500 THB
- Store QR image in payment_settings
- Do not generate a new QR for every booking
- Do not connect website to personal banking credentials
- Customer pays using mobile banking
- Customer uploads proof of payment
- Admin verifies manually

### Customer UX
Show:
- Amount: 500 THB
- QR image
- Account/merchant name
- Payment instructions
- Save QR option
- Upload slip
- Booking code

Never show "Payment successful" until verification.

### Database
payment.status:
pending -> slip_uploaded -> verified/rejected

booking.status:
pending_verification -> confirmed

### Version 2
If automated confirmation becomes necessary:
- Integrate a supported payment gateway/PromptPay provider
- Create server-side payment intent/session
- Use fixed production webhook endpoint
- Verify webhook signature
- Make event processing idempotent
- Record provider event ID
- Update payment and booking transactionally

Example production endpoint:
https://example.com/api/webhooks/payment

The endpoint is stable as long as domain and route are stable. Local tunnel URLs are for development only.

## Security
- Never trust client-side payment success
- Never expose secret keys
- Verify webhook signatures
- Store payment events
- Make webhook processing idempotent
