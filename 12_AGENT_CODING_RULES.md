# AI Agent Coding Rules

## Before coding
1. Read all project markdown files.
2. Do not invent requirements that conflict with this specification.
3. If a requirement is ambiguous, preserve the existing architecture and document the assumption.
4. Implement database/state logic before polishing UI.

## Architecture
- TypeScript strict mode
- Feature-based modular structure
- Reusable UI components
- Server-side business rules
- Keep payment provider isolated behind a service interface
- Keep booking engine independent from payment provider

## Database
- Use migrations
- Never modify production schema manually without migration
- Add indexes and constraints intentionally
- RLS is mandatory for sensitive tables

## Booking
- Never trust availability calculated only in the browser
- Re-check availability server-side
- Use atomic/transaction-safe reservation logic
- Prevent race conditions

## Payment
- V1 is manual slip verification
- V2 gateway/webhook must be isolated
- Never confirm from client button alone

## UI
- Mobile-first
- Loading states
- Empty states
- Error states
- Success states
- Skeletons where useful
- Accessible labels
- Thai text for customer-facing UI

## Code quality
- Avoid duplicated business logic
- Use constants/enums for states
- No magic numbers such as 500 scattered across code
- Use environment variables for secrets
- Add tests for critical flows
- Keep components small and composable

## Git
- Small logical commits
- Clear commit messages
- Do not commit secrets or .env files

## Definition of Done
A feature is not complete until:
- UI works
- server validation exists
- authorization exists
- database constraints are considered
- error/loading/empty states exist
- tests cover critical behavior
- docs are updated
