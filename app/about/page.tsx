import type { Metadata } from "next";
import Image from "next/image";
import { Target, Sparkles, ShieldCheck, FileSearch, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CTASection from "@/components/CTASection";
import { getJourneyGallery } from "@/app/actions/journey/get-journey-gallery";

export const metadata: Metadata = {
  title: "About Us | Chosen Arrows Foundation",
  description: "Learn about Chosen Arrows Foundation's mission to provide holistic care, education, and mentorship to vulnerable children, empowering them to discover and fulfill their God-given purpose.",
  keywords: ["about", "mission", "vision", "story", "children", "education", "mentorship"],
  openGraph: {
    title: "About Us | Chosen Arrows Foundation",
    description: "Learn about our mission to guide children toward their divine destiny",
    type: "website",
  },
};

export default async function AboutPage() {
  const galleryImages = await getJourneyGallery();
  return (
    <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-taffy-50 via-mint-50/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                About <span className="bg-gradient-to-r from-taffy-500 to-mint-500 bg-clip-text text-transparent">Chosen Arrows</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Just like arrows in the hands of a skilled archer, we aim to guide the children God 
                entrusts to us toward the direction of their ordained destinies.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="border-taffy-200/50 hover:shadow-lg hover:shadow-taffy-100/50 transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-taffy-400 to-taffy-500 flex items-center justify-center shadow-lg shadow-taffy-400/25">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To provide holistic care, education, and mentorship to vulnerable children, 
                    empowering them to discover and fulfill their God-given purpose with integrity, 
                    responsibility, and excellence.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-mint-200/50 hover:shadow-lg hover:shadow-mint-100/50 transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-mint-400 to-mint-500 flex items-center justify-center shadow-lg shadow-mint-400/25">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    A world where every child, regardless of circumstance, has the opportunity to 
                    grow into their fullest potential as leaders, changemakers, and beacons of hope 
                    in their communities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-gradient-to-b from-mint-50/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Our <span className="text-mint-500">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded on the biblical principle that children are like arrows in the hands of a warrior 
                  (Psalm 127:4), Chosen Arrows Foundation began with a simple yet profound vision: to direct 
                  vulnerable children toward their divine destiny.
                </p>
                <p>
                  What started as a small community initiative has grown into a comprehensive support system 
                  that provides education, healthcare, mentorship, and spiritual guidance to children who need 
                  it most. We believe that every child has been chosen for a purpose, and our role is to help 
                  them discover and fulfill that calling.
                </p>
                <p>
                  Today, we serve hundreds of children across multiple communities, partnering with local 
                  churches, schools, and families to create lasting impact. Our approach is holistic, 
                  addressing not just physical needs but also emotional, educational, and spiritual development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency & Accountability */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Transparency in <span className="text-mint-500">Every Step</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We believe in complete transparency. Every donation is tracked, every milestone is documented, and every success story is shared. You do not just give — you witness the transformation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-taffy-200/50 hover:shadow-lg hover:shadow-taffy-100/50 transition-shadow duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-taffy-100 to-taffy-200 flex items-center justify-center">
                      <BarChart3 className="w-7 h-7 text-taffy-600" />
                    </div>
                    <h3 className="text-xl font-bold">Real-time Tracking</h3>
                    <p className="text-muted-foreground">
                      Monitor the progress of projects and individual student achievements as they happen.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-mint-200/50 hover:shadow-lg hover:shadow-mint-100/50 transition-shadow duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-mint-100 to-mint-200 flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7 text-mint-600" />
                    </div>
                    <h3 className="text-xl font-bold">Verified Impact</h3>
                    <p className="text-muted-foreground">
                      Every dollar is accounted for, ensuring maximum impact for the children we serve.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-taffy-200/50 hover:shadow-lg hover:shadow-taffy-100/50 transition-shadow duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-taffy-100 to-taffy-200 flex items-center justify-center">
                      <FileSearch className="w-7 h-7 text-taffy-600" />
                    </div>
                    <h3 className="text-xl font-bold">Accountability</h3>
                    <p className="text-muted-foreground">
                      Regular reports and updates keep our community informed and engaged with our mission.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10">
                Our <span className="text-taffy-500">Journey</span> in Pictures
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[140px] md:auto-rows-[160px] grid-flow-dense">
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative overflow-hidden rounded-lg md:rounded-xl group ${image.span}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-xs md:text-sm font-medium">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 bg-gradient-to-br from-taffy-50/50 via-white to-mint-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">
              Our <span className="text-taffy-500">Impact</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { value: "500+", label: "Children Supported", color: "text-taffy-500" },
                { value: "15", label: "Communities Served", color: "text-mint-500" },
                { value: "100+", label: "Mentors", color: "text-taffy-500" },
                { value: "98%", label: "Success Rate", color: "text-mint-500" }
              ].map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-2">
                    <div className={`text-4xl md:text-5xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
  );
}
