import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { TruckIcon, MapPinIcon, UsersIcon, WrenchIcon, DollarSignIcon, BarChart3Icon, CheckCircleIcon, ChevronRightIcon, ShieldCheckIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TruckIcon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">TransitOps</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <ShieldCheckIcon className="h-4 w-4" />
              Trusted by 1000+ Fleet Managers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Streamline Your
              <span className="text-primary"> Fleet Operations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              The modern ERP platform for transport and fleet management. Manage vehicles, drivers, trips, and expenses all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Login to Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    U{i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">4.9/5 from 500+ reviews</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
            <div className="relative bg-card rounded-2xl border shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop" 
                alt="Fleet Management Dashboard" 
                className="w-full h-auto object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Platform</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Powerful features designed to simplify your daily operations and boost your bottom line</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: TruckIcon, title: "Vehicle Registry", desc: "Track all your vehicles with detailed information, maintenance history, and current status" },
            { icon: UsersIcon, title: "Driver Management", desc: "Manage drivers, licenses, certifications, and performance with safety score tracking" },
            { icon: MapPinIcon, title: "Trip Dispatch", desc: "Create, dispatch, and monitor trips with real-time status updates and driver assignments" },
            { icon: WrenchIcon, title: "Maintenance Tracking", desc: "Stay on top of vehicle maintenance schedules, service records, and repair costs" },
            { icon: DollarSignIcon, title: "Expense Management", desc: "Track fuel costs, expenses, and generate detailed financial reports in seconds" },
            { icon: BarChart3Icon, title: "Analytics & Reports", desc: "Get actionable insights with beautiful charts, KPIs, and customizable reports" },
          ].map((feature, index) => (
            <div key={index} className="p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose TransitOps?</h2>
              <div className="space-y-6">
                {[
                  "Reduce operational costs by up to 30%",
                  "Improve fleet utilization efficiency",
                  "Ensure compliance and safety standards",
                  "Real-time visibility into all operations",
                  "Easy to use with minimal training required",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "1000+", label: "Active Users" },
                { number: "50K+", label: "Vehicles Managed" },
                { number: "200K+", label: "Trips Completed" },
                { number: "99.9%", label: "Uptime" },
              ].map((stat, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Choose the plan that fits your needs. No hidden fees, cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Starter", price: "$49", features: ["Up to 10 vehicles", "Basic reporting", "Email support", "Driver management"] },
            { name: "Professional", price: "$149", features: ["Up to 50 vehicles", "Advanced analytics", "Priority support", "Trip dispatch", "Maintenance tracking"], popular: true },
            { name: "Enterprise", price: "$399", features: ["Unlimited vehicles", "Custom integrations", "24/7 support", "Dedicated account manager", "API access"] },
          ].map((plan, index) => (
            <div key={index} className={`p-6 rounded-xl border ${plan.popular ? 'border-primary bg-primary/5 shadow-xl scale-105' : 'bg-card'}`}>
              {plan.popular && (
                <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? 'default' : 'secondary'}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-16 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Fleet Operations?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Join thousands of fleet managers who trust TransitOps to run their operations efficiently.</p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-primary">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold">TransitOps</span>
              </div>
              <p className="text-muted-foreground text-sm">The modern ERP for transport and fleet management.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 TransitOps. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {/* Social icons placeholder */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
