import type { Metadata } from "next";
import MentorshipPageClient from "./MentorshipPageClient";

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

export default function MentorshipPage() {
  return <MentorshipPageClient />;
}
