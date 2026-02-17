# Resend Email Setup

Resend is used to send **mentor application notification emails** (when someone submits a mentor application, your team gets an email).

## Where to put the API key

Use **one** of these (dashboard overrides env if both are set):

### Option 1: Environment variable (recommended for local/dev)

1. Open **`.env.local`** in the project root.
2. Find the Resend section and set:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxx   # paste your key here
   ```
3. Get a key at [resend.com/api-keys](https://resend.com/api-keys) → Create API Key (use **Sending access**).

### Option 2: Admin dashboard (good for production)

1. Log in to the admin: **Admin → Settings → API & Integrations**.
2. Open the **Email** tab.
3. Paste your key in **Resend API Key** (stored securely, server-only).
4. Set **Mentor Notification Email** to the address that should receive application alerts (e.g. `chosenarrowsfoundation@gmail.com`).

## Optional env vars in `.env.local`

| Variable | Purpose |
|----------|--------|
| `RESEND_API_KEY` | **Required** to send. Paste your key here. |
| `MENTOR_NOTIFICATION_EMAIL` | Who receives mentor application notifications (default: `chosenarrowsfoundation@gmail.com`). |
| `RESEND_FROM_DOMAIN` | Sender address domain (default: `onboarding@resend.dev` for testing). |
| `RESEND_FROM_NAME` | Sender display name (e.g. `Chosen Arrows Foundation`). |

## Verify

After setting the key, submit a test mentor application from the mentorship form. If configured correctly, the notification email is sent to `MENTOR_NOTIFICATION_EMAIL` (or the value set in the dashboard). If the key is missing, the app still saves the application but logs a warning and skips sending.
