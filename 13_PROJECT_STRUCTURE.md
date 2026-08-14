# Recommended Project Structure

```text
src/
  app/
    (public)/
      page.tsx
      services/
      portfolio/
      reviews/
      availability/
      book/
      booking/
      payment/
    (admin)/
      admin/
        dashboard/
        bookings/
        calendar/
        customers/
        payments/
        services/
        packages/
        photographers/
        portfolio/
        reviews/
        analytics/
        settings/
    api/
      services/
      availability/
      booking/
      payment/
      customer/
      admin/
      webhooks/
  components/
    ui/
    booking/
    calendar/
    payment/
    portfolio/
    admin/
  lib/
    supabase/
    booking/
    payment/
    auth/
    validation/
    notifications/
    analytics/
  types/
  constants/
  hooks/

supabase/
  migrations/
  seed.sql

tests/
  unit/
  integration/
  e2e/

docs/
  00_MASTER_SPEC.md
  01_PRODUCT_REQUIREMENTS.md
  02_USER_FLOWS.md
  03_DATABASE_SCHEMA.md
  04_STATE_MACHINES.md
  05_PAYMENT_SPEC.md
  06_AUTH_AND_ROLES.md
  07_API_SPEC.md
  08_UI_UX_SPEC.md
  09_ADMIN_DASHBOARD.md
  10_SECURITY_PDPA.md
  11_TEST_PLAN.md
  12_AGENT_CODING_RULES.md
  13_PROJECT_STRUCTURE.md
```

## Note
The exact Next.js route organization may change if the agent chooses an equivalent App Router structure. The business boundaries must remain.
