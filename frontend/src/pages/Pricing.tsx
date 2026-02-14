import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/home/PricingSection";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <PricingSection />
        
        {/* FAQ Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Have questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                We're here to help! Reach out to us on WhatsApp for instant support.
              </p>
              <Button variant="soft" size="lg" asChild>
                <a href="https://wa.me/7558290331" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Chat with us
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
