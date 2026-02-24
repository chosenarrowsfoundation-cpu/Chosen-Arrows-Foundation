# Payment methods setup

The donate page supports three ways to pay:

1. **PayPal** — PayPal Checkout (recommended to start)
2. **Card / Mobile** — Flutterwave (card + M-Pesa)
3. **Manual** — Bank transfer & M-Pesa (no API keys)

You can configure keys in **two places** (dashboard overrides env):

- **Admin → Settings → API & Integrations** (Payments tab) — recommended
- **`.env.local`** — same keys; used if not set in dashboard

---

## 1. Start with PayPal

Used for the **“PayPal”** tab. Donors pay with their PayPal account or card via PayPal.

### Get your PayPal keys (Sandbox for testing)

1. Go to **[PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)** and sign in with your PayPal account.
2. Open **Apps & Credentials** (or **My Apps & Credentials**).
3. Under **Sandbox** (for testing) or **Live** (for real payments), click **Create App** or use an existing app.
4. Name it (e.g. “Chosen Arrows Donations”) and create it.
5. Open the app and copy:
   - **Client ID** (starts with `AX...` or similar).
   - **Secret** — click **Show** to reveal, then copy.

**Sandbox vs Live**

- **Sandbox**: use `https://api-m.sandbox.paypal.com` as API Base. Use [PayPal Sandbox accounts](https://developer.paypal.com/dashboard/accounts) to test (no real money).
- **Live**: switch to **Live** in the dashboard, use your live app’s Client ID and Secret, and set API Base to `https://api-m.paypal.com`.

### Add keys in the dashboard (recommended)

1. In your app, go to **Admin → Settings** (log in as admin if needed).
2. Open the **API & Integrations** card → **Payments** tab.
3. Fill in:
   - **PayPal Client ID** — paste the Client ID from step 5 above.
   - **PayPal Client Secret** — paste the Secret (stored securely; never sent to the browser).
   - **PayPal API Base** — leave as `https://api-m.sandbox.paypal.com` for sandbox, or set to `https://api-m.paypal.com` for live.
4. Click **Save** (or the form’s save button).
5. Open the public **Donate** page, choose an amount and fill name/email, then open the **PayPal** tab. You should see the PayPal button; complete a test payment with a sandbox buyer account.

### Or add keys in `.env.local`

If you prefer env vars (e.g. for local dev):

1. In the project root, create or edit **`.env.local`** (it’s gitignored).
2. Add:
   ```bash
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
   PAYPAL_CLIENT_SECRET=your_client_secret_here
   PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
   ```
3. Restart the dev server (`npm run dev`). Values in the **dashboard override** these when both are set.

### Verify

- **Donate page** → **PayPal** tab shows the PayPal button (no “PayPal is not configured” message).
- Click the button → redirects to PayPal login/approve → after approval, you’re sent back and the donation is recorded.
- In **Admin** you can confirm the donation appears (donations list or relevant report).

If you see “PayPal is not configured”, the app didn’t get both Client ID and Client Secret (check dashboard save or env and restart).

---

## 2. Card / Mobile (Flutterwave)

Used for the **“Card/Mobile”** tab (credit/debit card and M-Pesa).

1. Sign up at [Flutterwave](https://flutterwave.com/) and get your API keys.
2. In **Admin → Settings → API & Integrations → Payments**, set:
   - **Flutterwave Public Key** — e.g. `FLWPUBK_TEST-...` (test) or `FLWPUBK-...` (live).
3. Or in `.env.local`:
   ```bash
   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxx-X
   ```
4. Restart the dev server if you use env. The donate page will show the Card/Mobile tab when this key is present.

---

## 3. Manual (Bank & M-Pesa)

No API keys. You only set the text shown to donors.

1. Go to **Admin → Settings** and open the **“Manual Payment”** tab (in the **Site Settings** card).
2. Fill in:
   - **Bank transfer**: Bank name, account name, account number, SWIFT, currency.
   - **M-Pesa (Manual)**: Paybill/phone number, account name, short instructions.
3. Click **Save All Settings**. These details appear on the donate page under the **“Manual”** tab.

---

## 4. Stripe (optional)

Stripe keys can be stored in **API & Integrations** (Stripe Publishable Key, Secret Key, Webhook Secret), but the current donate page **does not** use Stripe for checkout. The **Card/Mobile** tab uses **Flutterwave**. To accept card payments via Stripe you’d need to add a Stripe Checkout (or Payment Element) flow; see `agent.md` in the repo for a planned Stripe implementation.

---

## Quick check

- **PayPal tab** → **PayPal Client ID** + **PayPal Client Secret** (and optional **PayPal API Base**).
- **Card/Mobile tab** → **Flutterwave Public Key**.
- **Manual tab** → **Settings → Manual Payment** (bank + M-Pesa text).
- After changing keys in the dashboard, **Save**; no restart needed. After changing `.env.local`, restart the dev server.
