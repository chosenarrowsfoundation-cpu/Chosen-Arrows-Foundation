import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Chosen Arrows Foundation",
    description: "Learn how Chosen Arrows Foundation collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Privacy Policy</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                    <p className="lead">
                        At Chosen Arrows Foundation, we value your trust and are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>
                        We may collect personal information such as your name, email address, phone number, and payment details when you:
                    </p>
                    <ul>
                        <li>Donate to our cause</li>
                        <li>Sign up for our newsletter</li>
                        <li>Volunteer or partner with us</li>
                        <li>Contact us for inquiries</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        The information we collect is used to:
                    </p>
                    <ul>
                        <li>Process donations and issue receipts</li>
                        <li>Send updates about our projects and impact</li>
                        <li>Respond to your inquiries</li>
                        <li>Improve our website and user experience</li>
                    </ul>

                    <h2>3. Data Protection</h2>
                    <p>
                        We implement robust security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We do not sell or trade your personal information to third parties.
                    </p>

                    <h2>4. Cookies</h2>
                    <p>
                        Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some site functionality.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or request the deletion of your personal information. Please contact us at [email protected] for any privacy-related concerns.
                    </p>

                    <h2>6. Updates to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.
                    </p>

                    <p className="mt-8 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
