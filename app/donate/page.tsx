import type { Metadata } from "next";
import { getSetting } from "@/app/actions/settings/get-settings";
import DonateClient from "./DonateClient";

export const metadata: Metadata = {
  title: "Donate | Chosen Arrows Foundation",
  description: "Your generosity changes lives. Every donation helps guide a child toward their divine destiny. Make a difference today with a secure, tax-deductible contribution.",
  keywords: ["donate", "donation", "charity", "give", "support children", "tax deductible"],
  openGraph: {
    title: "Donate | Chosen Arrows Foundation",
    description: "Your generosity changes lives. Every donation helps guide a child toward their divine destiny",
    type: "website",
  },
};

const defaultManualPayment = {
  bank: {
    bankName: "[BANK NAME]",
    accountName: "Chosen Arrows Foundation",
    accountNumber: "[ACCOUNT NUMBER]",
    swiftCode: "[SWIFT CODE]",
    currency: "USD / KES",
  },
  mpesa: {
    number: "[PHONE/PAYBILL NUMBER]",
    name: "Chosen Arrows Foundation",
    instructions: "Go to M-Pesa > Lipa na M-Pesa > Paybill/Buy Goods",
  },
};

export default async function DonatePage() {
  const manualPayment = (await getSetting("manual_payment_details")) as typeof defaultManualPayment | null;
  const manualPaymentDetails = manualPayment?.bank && manualPayment?.mpesa ? manualPayment : defaultManualPayment;
  return <DonateClient manualPaymentDetails={manualPaymentDetails} />;
}
