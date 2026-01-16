import { Check, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Pay Per Use",
    description: "Perfect for occasional laundry",
    price: "₹49",
    unit: "/kg",
    features: [
      "Wash & fold included",
      "48-hour delivery",
      "Free pickup",
      "Quality cleaning",
    ],
    popular: false,
    icon: null,
  },
  {
    name: "Weekly Plan",
    description: "Best value for regular use",
    price: "₹299",
    unit: "/week",
    features: [
      "Up to 5 kg/week",
      "Priority 24-hour delivery",
      "Free pickup & delivery",
      "Iron included",
      "WhatsApp updates",
    ],
    popular: true,
    icon: Crown,
  },
  {
    name: "Monthly Saver",
    description: "For the laundry heavy student",
    price: "₹999",
    unit: "/month",
    features: [
      "Up to 20 kg/month",
      "Same-day delivery option",
      "Premium detergents",
      "Dedicated support",
      "Rollover unused kg",
    ],
    popular: false,
    icon: Zap,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose your laundry plan
          </h2>
          <p className="text-muted-foreground text-lg">
            Affordable pricing designed for student budgets. 
            No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-foreground text-white shadow-soft-xl scale-105"
                  : "bg-white border border-border shadow-soft hover:shadow-soft-lg"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  Most Popular
                </div>
              )}

              {/* Plan Icon */}
              {plan.icon && (
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${
                  plan.popular ? "bg-white/10" : "bg-primary-soft"
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? "text-white" : "text-primary"}`} />
                </div>
              )}

              {/* Plan Info */}
              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-white" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={plan.popular ? "text-white/70" : "text-muted-foreground"}>
                  {plan.unit}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? "bg-primary" : "bg-primary-soft"
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-white" : "text-primary"}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? "text-white/90" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/order">
                <Button
                  className="w-full"
                  variant={plan.popular ? "secondary" : "default"}
                  size="lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
