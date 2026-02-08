import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Chosen Arrows Foundation",
    description: "Terms and conditions for using the Chosen Arrows Foundation website and services.",
};

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Terms of Service</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                    <p className="lead">
                        Welcome to Chosen Arrows Foundation. By accessing or using our website, you agree to be bound by these Terms of Service.
                    </p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By using our website, you agree to comply with and be bound by these terms. If you do not agree to these terms, please do not use our site.
                    </p>

                    <h2>2. Use of Content</h2>
                    <p>
                        All content on this website, including text, images, logos, and videos, is the property of Chosen Arrows Foundation or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                    </p>

                    <h2>3. Donations</h2>
                    <p>
                        All donations made to Chosen Arrows Foundation are final and non-refundable, except in cases of technical error or as required by law. We ensure that your contributions are used effectively to support our mission.
                    </p>

                    <h2>4. User Conduct</h2>
                    <p>
                        You agree to use our website only for lawful purposes. You must not use our site to transmit any malicious code, spam, or offensive content.
                    </p>

                    <h2>5. Third-Party Links</h2>
                    <p>
                        Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these external sites.
                    </p>

                    <h2>6. Limitation of Liability</h2>
                    <p>
                        Chosen Arrows Foundation shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use our website.
                    </p>

                    <h2>7. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of the jurisdiction in which Chosen Arrows Foundation is registered, without regard to its conflict of law principles.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at [email protected].
                    </p>

                    <p className="mt-8 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
