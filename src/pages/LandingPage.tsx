import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { TruckIcon, MapPinIcon, UsersIcon, WrenchIcon, DollarSignIcon, BarChart3Icon, CheckCircleIcon, ChevronRightIcon, ShieldCheckIcon, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Fleet Manager, Delhi Logistics',
    content: 'TransitOps transformed our operations. We reduced costs by 25% in the first 3 months!',
    avatar: 'RK'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Operations Head, Mumbai Trans',
    content: 'Best fleet management software we have ever used. Intuitive, powerful, and beautiful.',
    avatar: 'PS'
  },
  {
    id: 3,
    name: 'Amit Singh',
    role: 'Safety Officer, Pune Carriers',
    content: 'Safety score tracking has significantly improved our driver safety ratings. Amazing tool!',
    avatar: 'AS'
  }
]

const stats = [
  { number: '1000+', label: 'Active Users' },
  { number: '50K+', label: 'Vehicles Managed' },
  { number: '200K+', label: 'Trips Completed' },
  { number: '99.9%', label: 'Uptime' }
]

const features = [
  { icon: TruckIcon, title: 'Vehicle Registry', desc: 'Track all your vehicles with detailed information, maintenance history, and current status' },
  { icon: UsersIcon, title: 'Driver Management', desc: 'Manage drivers, licenses, certifications, and performance with safety score tracking' },
  { icon: MapPinIcon, title: 'Trip Dispatch', desc: 'Create, dispatch, and monitor trips with real-time status updates and driver assignments' },
  { icon: WrenchIcon, title: 'Maintenance Tracking', desc: 'Stay on top of vehicle maintenance schedules, service records, and repair costs' },
  { icon: DollarSignIcon, title: 'Expense Management', desc: 'Track fuel costs, expenses, and generate detailed financial reports in seconds' },
  { icon: BarChart3Icon, title: 'Analytics & Reports', desc: 'Get actionable insights with beautiful charts, KPIs, and customizable reports' }
]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TransitOps</span>
          </motion.div>
          <motion.div 
            className="hidden md:flex items-center gap-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Features</a>
            <a href="#benefits" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Benefits</a>
            <a href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
            <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Login</Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              <ShieldCheckIcon className="h-4 w-4" />
              Trusted by 1000+ Fleet Managers
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Streamline Your
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Fleet Operations</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              The modern ERP platform for transport and fleet management. Manage vehicles, drivers, trips, and expenses all in one place with beautiful, intuitive UI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-2xl transition-all"
                  >
                    Start Free Trial
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 shadow-lg">
                  Login to Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                    initial={{ x: -20 * i, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  >
                    U{i}
                  </motion.div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 font-medium">4.9/5 from 500+ reviews</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2.5rem] blur-3xl animate-pulse" />
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop" 
                alt="Fleet Management Dashboard" 
                className="w-full h-auto object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Everything You Need in One Platform
          </motion.h2>
          <motion.p 
            className="text-slate-600 text-lg max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Powerful features designed to simplify your daily operations and boost your bottom line
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="p-8 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xl transition-all duration-300"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl w-fit mb-6">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">What Our Customers Say</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Don't just take our word for it - hear from fleet managers who use TransitOps every day</p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <motion.div
                key={currentTestimonial}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-10 rounded-3xl border border-slate-200 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-6 w-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8">"{testimonials[currentTestimonial].content}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-slate-600">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </motion.div>
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={prevTestimonial}
                  className="rounded-full bg-white border border-slate-200 shadow-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${index === currentTestimonial ? 'bg-gradient-to-r from-blue-600 to-indigo-600 w-8' : 'bg-slate-300'}`}
                    />
                  ))}
                </div>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={nextTestimonial}
                  className="rounded-full bg-white border border-slate-200 shadow-lg"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Fleet Operations?</h2>
          <p className="text-xl opacity-95 mb-10 max-w-3xl mx-auto leading-relaxed">Join thousands of fleet managers who trust TransitOps to run their operations efficiently. Start your free trial today!</p>
          <Link to="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-blue-700 hover:bg-slate-100 text-lg px-10 py-6 rounded-2xl shadow-2xl"
              >
                Start Your Free Trial
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <TruckIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TransitOps</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">The modern ERP for transport and fleet management. Built for the future, designed for you.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">© 2026 TransitOps. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {/* Social icons placeholder */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
