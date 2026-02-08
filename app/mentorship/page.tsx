import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Clock, Target } from "lucide-react";
import MentorshipForm from "./MentorshipForm";

export const metadata: Metadata = {
  title: "Become a Mentor | Chosen Arrows Foundation",
  description: "Shape a child's destiny through guidance, wisdom, and unconditional support. Join our mentor program and make a lasting impact on a child's life.",
  keywords: ["mentor", "mentorship", "volunteer", "guide", "support children", "mentor program"],
  openGraph: {
    title: "Become a Mentor | Chosen Arrows Foundation",
    description: "Shape a child's destiny through guidance, wisdom, and unconditional support",
    type: "website",
  },
};

const benefits = [
  {
    icon: Heart,
    title: "Make a Lasting Impact",
    description: "Guide a child toward their divine purpose through consistent, caring mentorship"
  },
  {
    icon: Users,
    title: "Build Meaningful Relationships",
    description: "Develop deep connections that transform both mentor and mentee"
  },
  {
    icon: Target,
    title: "Share Your Skills",
    description: "Use your unique experiences and talents to inspire the next generation"
  },
  {
    icon: Clock,
    title: "Flexible Commitment",
    description: "Choose a mentorship schedule that works with your lifestyle"
  }
];

export default function MentorshipPage() {
  return (
    <main className="pt-24 pb-20">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Become a <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mentor</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Shape a child&apos;s destiny through guidance, wisdom, and unconditional support
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Application Form */}
            <div className="max-w-2xl mx-auto mb-16">
              <MentorshipForm />
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6 space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
  );
}
