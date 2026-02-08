import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Donation Cancelled | Chosen Arrows Foundation",
  description: "Your donation was cancelled. You can try again anytime.",
  robots: "noindex",
};

export default function DonateCancelPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              Donation Cancelled
            </h1>
            <p className="text-lg text-muted-foreground">
              No payment was made. If you changed your mind or ran into an issue, you can try again anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/donate" className="inline-flex items-center gap-2">
                  Try Again
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
