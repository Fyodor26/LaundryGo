import { Package, Truck, Sparkles, Home } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Place Order",
    description: "Select your laundry type, quantity, and preferred pickup time through our app.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Truck,
    title: "We Pick Up",
    description: "Our team collects your laundry right from your hostel or PG room.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Sparkles,
    title: "Washed & Cleaned",
    description: "Your clothes are professionally washed, ironed, and carefully packed.",
    color: "bg-primary-soft text-primary",
  },
  {
    icon: Home,
    title: "Delivered Fresh",
    description: "Clean, fresh clothes delivered back to your doorstep within 48 hours.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fresh clothes in 4 simple steps
          </h2>
          <p className="text-muted-foreground text-lg">
            No more waiting in queues or handwashing. We make laundry 
            as easy as ordering food online.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
              )}
              
              {/* Card */}
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
