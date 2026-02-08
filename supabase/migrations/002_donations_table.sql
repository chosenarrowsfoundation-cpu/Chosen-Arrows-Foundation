-- Donations table (PayPal-first; supports future Stripe via payment_provider)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_provider VARCHAR(20) NOT NULL DEFAULT 'paypal',
  paypal_order_id VARCHAR(255) UNIQUE,
  paypal_capture_id VARCHAR(255),
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  frequency VARCHAR(20) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  campaign_id UUID REFERENCES campaigns(id),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_paypal_order ON donations(paypal_order_id);
CREATE INDEX idx_donations_stripe_session ON donations(stripe_session_id);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view donations"
  ON donations FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Service role can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
