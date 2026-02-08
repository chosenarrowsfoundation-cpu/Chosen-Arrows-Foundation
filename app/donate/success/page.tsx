import type { Metadata } from "next";
import Link from "next/link";
import { Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Thank You | Donate | Chosen Arrows Foundation",
  description: "Your donation was received. Thank you for supporting Chosen Arrows Foundation.",
  robots: "noindex",
};

type SearchParams = { donation_id?: string; amount?: string };

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const donationId = (params.donation_id as string) ?? "";
  const amount = (params.amount as string) ?? "";

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-400/25">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Thank You for Your Generosity
            </h1>
            <p className="text-lg text-muted-foreground">
              Your donation has been received. Your support helps guide children toward their divine destiny.
            </p>

            <Card>
              <CardContent className="p-6 text-left space-y-4">
                {amount && (
                  <p className="text-lg font-semibold">
                    Amount: <span className="text-primary">${Number(amount).toFixed(2)}</span>
                  </p>
                )}
                {donationId && (
                  <p className="text-sm text-muted-foreground">
                    Reference: <span className="font-mono">{donationId}</span>
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  A confirmation was sent to your email from PayPal. You can use your reference number for any questions.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/donate" className="inline-flex items-center gap-2">
                  Make Another Donation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/" className="inline-flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
