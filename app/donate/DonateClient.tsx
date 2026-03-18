"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heart, Shield } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { CreditCard, Banknote, Building2, Phone } from "lucide-react";

export type ManualPaymentDetails = {
  bank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    currency: string;
  };
  mpesa: {
    number: string;
    name: string;
    instructions: string;
  };
};

const defaultManualPayment: ManualPaymentDetails = {
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

function createDonationFormSchema(t: (key: string) => string) {
  return z.object({
    amount: z
      .string()
      .min(1, t("donate.amountRequired"))
      .refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, t("donate.amountPositive"))
      .refine((val) => {
        const num = parseFloat(val);
        return num >= 1;
      }, t("donate.amountMin"))
      .refine((val) => {
        const num = parseFloat(val);
        return num <= 100000;
      }, t("donate.amountMax")),
    frequency: z.enum(["once", "monthly"], {
      required_error: t("donate.frequencyRequired"),
    }),
    name: z
      .string()
      .min(2, t("donate.nameMin"))
      .max(100, t("donate.nameMax"))
      .regex(/^[a-zA-Z\s'-]+$/, t("donate.nameInvalid")),
    email: z
      .string()
      .min(1, t("donate.emailRequired"))
      .email(t("donate.emailInvalid"))
      .max(255, t("donate.emailMax")),
  });
}

type DonationFormValues = z.infer<ReturnType<typeof createDonationFormSchema>>;

type PublicConfig = {
  paypalClientId: string | null;
  paypalApiBase: string;
  flutterwavePublicKey: string | null;
  stripePublishableKey: string | null;
};

export default function DonateClient({
  manualPaymentDetails = defaultManualPayment,
  campaignId,
}: {
  manualPaymentDetails?: ManualPaymentDetails;
  campaignId?: string;
}) {
  const { t } = useTranslation();
  const donationFormSchema = useMemo(() => createDonationFormSchema(t), [t]);
  const [selectedAmount, setSelectedAmount] = useState("50");
  const bankDetails = manualPaymentDetails?.bank ?? defaultManualPayment.bank;
  const mpesaDetails = manualPaymentDetails?.mpesa ?? defaultManualPayment.mpesa;
  const [publicConfig, setPublicConfig] = useState<PublicConfig>(() => ({
    paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? null,
    paypalApiBase: "https://api-m.sandbox.paypal.com",
    flutterwavePublicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? null,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null,
  }));

  useEffect(() => {
    fetch("/api/config/public")
      .then((r) => r.json())
      .then((data: PublicConfig) => {
        setPublicConfig((prev) => ({
          paypalClientId: data.paypalClientId ?? prev.paypalClientId ?? null,
          paypalApiBase: data.paypalApiBase ?? prev.paypalApiBase ?? "https://api-m.sandbox.paypal.com",
          flutterwavePublicKey: data.flutterwavePublicKey ?? prev.flutterwavePublicKey ?? null,
          stripePublishableKey: data.stripePublishableKey ?? prev.stripePublishableKey ?? null,
        }));
      })
      .catch(() => {});
  }, []);

  const paypalClientId = publicConfig.paypalClientId ?? "";
  const flutterwavePublicKey = publicConfig.flutterwavePublicKey ?? "";

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "50",
      frequency: "once",
      name: "",
      email: "",
    },
  });

  const presetAmounts = ["25", "50", "100", "250", "500"];

  const createOrder = useCallback(async () => {
    const values = form.getValues();
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: values.amount,
        frequency: values.frequency,
        donorName: values.name,
        donorEmail: values.email,
        ...(campaignId ? { campaignId } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? t("donate.couldNotStartPayment"));
      throw new Error(data.error ?? "Create order failed");
    }
    return data.orderId;
  }, [form, campaignId, t]);

  const onApprove = useCallback(
    async (data: { orderID: string }) => {
      const values = form.getValues();
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
          donorName: values.name,
          donorEmail: values.email,
          frequency: values.frequency,
          ...(campaignId ? { campaignId } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Payment could not be completed");
        return;
      }
      const params = new URLSearchParams({
        donation_id: json.donationId ?? data.orderID,
        amount: json.amount ?? form.getValues().amount,
      });
      window.location.href = `/donate/success?${params.toString()}`;
    },
    [form, campaignId]
  );

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    form.setValue("amount", amount, { shouldValidate: true });
  };

  const handleAmountChange = (value: string) => {
    setSelectedAmount(value);
    form.setValue("amount", value, { shouldValidate: true });
  };

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-taffy-50 via-mint-50/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-taffy-400 to-mint-400 flex items-center justify-center mb-4 shadow-lg shadow-taffy-400/25">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {t("donate.title").includes(" ") ? (
                <>
                  {t("donate.title").split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="bg-gradient-to-r from-taffy-500 to-mint-500 bg-clip-text text-transparent">
                    {t("donate.title").split(" ").slice(-1)[0]}
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-taffy-500 to-mint-500 bg-clip-text text-transparent">
                  {t("donate.title")}
                </span>
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("donate.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Form {...form}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-0"
              >
                <Card>
                  <CardContent className="p-8 space-y-8">
                    {/* Frequency Selection */}
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">{t("donate.frequency")}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <div>
                                <RadioGroupItem value="once" id="once" className="peer sr-only" />
                                <Label
                                  htmlFor="once"
                                  className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  {t("donate.oneTime")}
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
                                <Label
                                  htmlFor="monthly"
                                  className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  {t("donate.monthly")}
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Amount Selection */}
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">{t("donate.selectAmount")}</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-3">
                                {presetAmounts.map((preset) => (
                                  <Button
                                    key={preset}
                                    type="button"
                                    variant={selectedAmount === preset ? "default" : "outline"}
                                    onClick={() => handleAmountSelect(preset)}
                                    className="h-12"
                                  >
                                    ${preset}
                                  </Button>
                                ))}
                              </div>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => handleAmountChange(e.target.value)}
                                  className="pl-7 h-12 text-lg"
                                  placeholder={t("donate.customAmount")}
                                  min="1"
                                  max="100000"
                                  step="0.01"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Personal Information */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">{t("donate.yourInfo")}</Label>
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("donate.fullName")}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={t("contact.placeholderName")} className="mt-1" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("donate.emailAddress")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder={t("contact.placeholderEmail")}
                                  className="mt-1"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="pt-4">
                      <Label className="text-lg font-semibold mb-4 block">{t("donate.selectPaymentMethod")}</Label>
                      <Tabs defaultValue="online" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="online" className="flex gap-2 text-xs md:text-sm px-1 md:px-3">
                            <CreditCard className="w-4 h-4 hidden md:block" /> {t("donate.cardPayPal")}
                          </TabsTrigger>
                          <TabsTrigger value="manual" className="flex gap-2 text-xs md:text-sm px-1 md:px-3">
                            <Banknote className="w-4 h-4 hidden md:block" /> {t("donate.manual")}
                          </TabsTrigger>
                        </TabsList>

                        {/* CARD (Flutterwave) + PAYPAL - merged */}
                        <TabsContent value="online" className="space-y-6">
                          <div className="space-y-4">
                            {/* Flutterwave (Card & Mobile Money) */}
                            {flutterwavePublicKey && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                  {t("donate.cardMobile")}
                                </p>
                                <FlutterWaveButton
                                  className="w-full h-12 bg-gradient-to-r from-mint-500 to-taffy-500 hover:from-mint-600 hover:to-taffy-600 text-white font-bold rounded-md shadow-md transition-all flex items-center justify-center gap-2"
                                  text={t("donate.donateAmount", { amount: form.getValues("amount") || selectedAmount })}
                                  callback={(response) => {
                                    console.log(response);
                                    closePaymentModal();
                                    if (response.status === "successful") {
                                      window.location.href = "/donate/success?payment=flutterwave&ref=" + response.tx_ref;
                                    } else {
                                      toast.error(t("donate.paymentNotCompleted"));
                                    }
                                  }}
                                  onClose={() => { }}
                                  // @ts-ignore
                                  {...{
                                    public_key: flutterwavePublicKey,
                                    tx_ref: Date.now().toString(),
                                    amount: Number(form.getValues("amount") || selectedAmount),
                                    currency: "USD",
                                    payment_options: "card,mobilemoney,ussd",
                                    customer: {
                                      email: form.getValues("email") || "donor@chosenarrows.org",
                                      phone_number: "",
                                      name: form.getValues("name") || "Anonymous",
                                    },
                                    customizations: {
                                      title: "Chosen Arrows Donation",
                                      description: "Donation Support",
                                      logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://chosen-arrows-foundation-six.vercel.app"}/logo.png`,
                                    },
                                  }}
                                />
                              </div>
                            )}

                            {/* Divider */}
                            {(flutterwavePublicKey && paypalClientId) && (
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                  <span className="bg-card px-2 text-muted-foreground">{t("donate.or")}</span>
                                </div>
                              </div>
                            )}

                            {/* PayPal */}
                            {paypalClientId ? (
                              <div className="space-y-3 min-h-[100px]">
                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                  PayPal
                                </p>
                                <PayPalScriptProvider
                                  options={{
                                    clientId: paypalClientId,
                                    currency: "USD",
                                    intent: "capture",
                                  }}
                                >
                                  <PayPalButtons
                                    style={{ layout: "vertical", label: "donate", height: 48 }}
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    onError={(err) => {
                                      const msg = err && typeof err === "object" && "message" in err
                                        ? String((err as { message: unknown }).message)
                                        : "PayPal error. Please try again.";
                                      toast.error(msg);
                                    }}
                                  />
                                </PayPalScriptProvider>
                              </div>
                            ) : (
                              <p className="text-sm text-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200">
                                {t("donate.paypalNotConfigured")}
                              </p>
                            )}
                          </div>
                        </TabsContent>

                        {/* MANUAL TRANSFERS */}
                        <TabsContent value="manual" className="space-y-6 animate-in slide-in-from-bottom-2">
                          {/* Bank Transfer */}
                          <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-border">
                            <div className="flex items-center gap-2 font-semibold text-primary">
                              <Building2 className="w-5 h-5" />
                              <h3>{t("donate.bankTransfer")}</h3>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                              <span className="text-muted-foreground">{t("donate.bank")}:</span>
                              <span className="font-medium">{bankDetails.bankName}</span>

                              <span className="text-muted-foreground">{t("donate.accName")}:</span>
                              <span className="font-medium">{bankDetails.accountName}</span>

                              <span className="text-muted-foreground">{t("donate.accNo")}:</span>
                              <span className="font-medium font-mono">{bankDetails.accountNumber}</span>

                              <span className="text-muted-foreground">{t("donate.swift")}:</span>
                              <span className="font-medium">{bankDetails.swiftCode}</span>
                            </div>
                          </div>

                          {/* M-Pesa Manual */}
                          <div className="space-y-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                              <Phone className="w-5 h-5" />
                              <h3>{t("donate.mpesaManual")}</h3>
                            </div>
                            <div className="text-sm space-y-2">
                              <p className="font-medium">{mpesaDetails.instructions}</p>
                              <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-muted-foreground">{t("donate.number")}:</span>
                                <span className="font-medium font-mono text-lg">{mpesaDetails.number}</span>

                                <span className="text-muted-foreground">{t("donate.details")}:</span>
                                <span className="font-medium">{mpesaDetails.name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground text-center">
                            * {t("donate.manualTransferNote")}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>{t("donate.secure")}</span>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>

            {/* Impact Message */}
            <Card className="mt-6 bg-gradient-to-br from-mint-50 to-taffy-50/50 border-mint-200/50">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium">
                  ${selectedAmount} {form.watch("frequency") === "monthly" ? t("donate.monthly") : ""} {t("donate.impactMessage")}
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-center justify-center gap-2"><span className="text-mint-500">✓</span> {t("donate.impact1")}</li>
                  <li className="flex items-center justify-center gap-2"><span className="text-taffy-500">✓</span> {t("donate.impact2")}</li>
                  <li className="flex items-center justify-center gap-2"><span className="text-mint-500">✓</span> {t("donate.impact3")}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
