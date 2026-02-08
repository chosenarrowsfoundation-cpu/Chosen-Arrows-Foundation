import type { Metadata } from "next";
import { FileText, Download, ExternalLink, Activity } from "lucide-react";

export const metadata: Metadata = {
    title: "Transparency Repository | Chosen Arrows Foundation",
    description: "Access our financial reports, impact assessments, and governance documents. We believe in complete transparency.",
};

export default function TransparencyRepoPage() {
    const reports = [
        {
            title: "2024 Annual Impact Report",
            date: "January 2025",
            type: "Impact",
            size: "2.4 MB",
            url: "#"
        },
        {
            title: "2024 Financial Statements",
            date: "January 2025",
            type: "Financial",
            size: "1.8 MB",
            url: "#"
        },
        {
            title: "Q4 2024 Project Update",
            date: "December 2024",
            type: "Project",
            size: "1.2 MB",
            url: "#"
        },
        {
            title: "Foundation Bylaws",
            date: "Updated 2024",
            type: "Governance",
            size: "0.5 MB",
            url: "#"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Transparency Repository</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        Trust is the foundation of our work. We are committed to complete transparency in our operations, financials, and impact. Here you can access our public records and reports.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">Real-time Impact</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            View our live dashboard showing current donation allocations and project statuses across our active regions.
                        </p>
                        <button className="inline-flex items-center text-primary font-medium hover:underline">
                            View Live Dashboard <ExternalLink size={16} className="ml-2" />
                        </button>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">Public Ledger</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            As part of our commitment to openness, we maintain a public ledger of all major project expenditures and anonymous donation records.
                        </p>
                        <button className="inline-flex items-center text-primary font-medium hover:underline">
                            Access Public Ledger <ExternalLink size={16} className="ml-2" />
                        </button>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Documents & Reports</h2>
                <div className="space-y-4">
                    {reports.map((report, index) => (
                        <div
                            key={index}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-start gap-4 mb-4 md:mb-0">
                                <div className="p-2 bg-muted rounded text-muted-foreground">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{report.title}</h4>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span>{report.date}</span>
                                        <span className="w-1 h-1 bg-border rounded-full"></span>
                                        <span>{report.type}</span>
                                        <span className="w-1 h-1 bg-border rounded-full"></span>
                                        <span>{report.size}</span>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={report.url}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
                            >
                                <Download size={16} className="mr-2" />
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
