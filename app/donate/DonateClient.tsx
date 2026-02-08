"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const donationFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be a positive number")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 1;
    }, "Minimum donation amount is $1")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 100000;
    }, "Maximum donation amount is $100,000"),
  frequency: z.enum(["once", "monthly"], {
    required_error: "Please select a donation frequency",
  }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

type PublicConfig = {
  paypalClientId: string | null;
  paypalApiBase: string;
  flutterwavePublicKey: string | null;
  stripePublishableKey: string | null;
};

export default function DonateClient({
  manualPaymentDetails = defaultManualPayment,
}: {
  manualPaymentDetails?: ManualPaymentDetails;
}) {
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
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Could not start payment");
      throw new Error(data.error ?? "Create order failed");
    }
    return data.orderId;
  }, [form]);

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
    [form]
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
              Make a <span className="bg-gradient-to-r from-taffy-500 to-mint-500 bg-clip-text text-transparent">Difference</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Your generosity changes lives. Every donation helps guide a child toward their divine destiny.
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
                          <FormLabel className="text-lg font-semibold">Donation Frequency</FormLabel>
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
                                  One-time
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
                                <Label
                                  htmlFor="monthly"
                                  className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  Monthly
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
                          <FormLabel className="text-lg font-semibold">Select Amount</FormLabel>
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
                                  placeholder="Custom amount"
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
                      <Label className="text-lg font-semibold">Your Information</Label>
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="John Doe" className="mt-1" />
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
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="john@example.com"
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
                      <Label className="text-lg font-semibold mb-4 block">Select Payment Method</Label>
                      <Tabs defaultValue="card" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                          <TabsTrigger value="card" className="flex gap-2 text-xs md:text-sm px-1 md:px-3">
                            <CreditCard className="w-4 h-4 hidden md:block" /> Card/Mobile
                          </TabsTrigger>
                          <TabsTrigger value="paypal" className="flex gap-2 text-xs md:text-sm px-1 md:px-3">
                            <span className="text-[#003087] font-bold">Pay</span><span className="text-[#009cde] font-bold">Pal</span>
                          </TabsTrigger>
                          <TabsTrigger value="manual" className="flex gap-2 text-xs md:text-sm px-1 md:px-3">
                            <Banknote className="w-4 h-4 hidden md:block" /> Manual
                          </TabsTrigger>
                        </TabsList>

                        {/* FLUTTERWAVE (Card & Mobile Money) */}
                        <TabsContent value="card" className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg border border-muted text-sm text-muted-foreground mb-4">
                            <p>Securely pay with <strong>Credit/Debit Card</strong> or <strong>Mobile Money (M-Pesa)</strong>.</p>
                          </div>

                          {flutterwavePublicKey ? (
                            <div className="flex justify-center">
                              <FlutterWaveButton
                                className="w-full h-12 bg-gradient-to-r from-mint-500 to-taffy-500 hover:from-mint-600 hover:to-taffy-600 text-white font-bold rounded-md shadow-md transition-all flex items-center justify-center gap-2"
                                text={`Donate $${form.getValues("amount") || selectedAmount}`}
                                callback={(response) => {
                                  console.log(response);
                                  closePaymentModal();
                                  if (response.status === "successful") {
                                    window.location.href = "/donate/success?payment=flutterwave&ref=" + response.tx_ref;
                                  } else {
                                    toast.error("Payment not completed.");
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
                                    logo: "https://chosenarrows.com/logo.png",
                                  },
                                }}
                              />
                            </div>
                          ) : (
                            <p className="text-destructive text-center text-sm bg-destructive/10 p-2 rounded">
                              Flutterwave Public Key missing. Set NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY.
                            </p>
                          )}
                        </TabsContent>

                        {/* PAYPAL */}
                        <TabsContent value="paypal" className="space-y-4">
                          {paypalClientId ? (
                            <div className="space-y-3 min-h-[150px]">
                              <p className="text-sm font-medium text-center text-muted-foreground mb-2">
                                Pay securely with PayPal account
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
                              PayPal is not configured.
                            </p>
                          )}
                        </TabsContent>

                        {/* MANUAL TRANSFERS */}
                        <TabsContent value="manual" className="space-y-6 animate-in slide-in-from-bottom-2">
                          {/* Bank Transfer */}
                          <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-border">
                            <div className="flex items-center gap-2 font-semibold text-primary">
                              <Building2 className="w-5 h-5" />
                              <h3>Bank Transfer</h3>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                              <span className="text-muted-foreground">Bank:</span>
                              <span className="font-medium">{bankDetails.bankName}</span>

                              <span className="text-muted-foreground">Acc Name:</span>
                              <span className="font-medium">{bankDetails.accountName}</span>

                              <span className="text-muted-foreground">Acc No:</span>
                              <span className="font-medium font-mono">{bankDetails.accountNumber}</span>

                              <span className="text-muted-foreground">SWIFT:</span>
                              <span className="font-medium">{bankDetails.swiftCode}</span>
                            </div>
                          </div>

                          {/* M-Pesa Manual */}
                          <div className="space-y-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                              <Phone className="w-5 h-5" />
                              <h3>M-Pesa (Manual)</h3>
                            </div>
                            <div className="text-sm space-y-2">
                              <p className="font-medium">{mpesaDetails.instructions}</p>
                              <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-muted-foreground">Number:</span>
                                <span className="font-medium font-mono text-lg">{mpesaDetails.number}</span>

                                <span className="text-muted-foreground">Details:</span>
                                <span className="font-medium">{mpesaDetails.name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground text-center">
                            * For manual transfers, please email proof of payment to finance@chosenarrows.org
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Secure & encrypted payment processing</span>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>

            {/* Impact Message */}
            <Card className="mt-6 bg-gradient-to-br from-mint-50 to-taffy-50/50 border-mint-200/50">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium">
                  ${selectedAmount} {form.watch("frequency") === "monthly" ? "monthly" : ""} can provide:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-center justify-center gap-2"><span className="text-mint-500">✓</span> School supplies for 2 children</li>
                  <li className="flex items-center justify-center gap-2"><span className="text-taffy-500">✓</span> Weekly meals for 5 children</li>
                  <li className="flex items-center justify-center gap-2"><span className="text-mint-500">✓</span> Medical checkup for 1 child</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
