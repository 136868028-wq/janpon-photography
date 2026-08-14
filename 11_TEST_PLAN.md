# Test Plan

## Booking
- Customer can book available slot
- Customer cannot book full slot
- Two customers cannot obtain same slot
- Hold expires correctly
- Expired hold becomes available
- Booking code is unique

## Payment V1
- Slip uploads successfully
- Invalid file rejected
- Admin can verify
- Admin can reject
- Rejected payment does not confirm booking
- Verified payment confirms booking
- Customer cannot fake verified status

## Auth
- Google login works
- Guest booking works
- Customer cannot access admin
- Photographer cannot access owner-only actions
- Admin permissions work

## Calendar
- Morning/evening availability correct
- Blocked dates correct
- Past dates disabled
- Timezone is Asia/Bangkok

## Security
- RLS tests
- Unauthorized API requests
- Rate limiting
- File access control
- Input validation
- XSS/HTML injection checks

## E2E
Test full:
Social/booking link -> service -> date -> slot -> customer -> hold -> payment -> slip -> admin verification -> confirmation
