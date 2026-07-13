"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet"
import { useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  ArrowRight,
  Check,
  Star,
  Play,
  BarChart3,
  Palette,
  Users,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react"

// Debounce function
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 20)
    }, 100)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 ${isScrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-transparent"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FormWise
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Features", "Pricing", "Templates", "About"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-purple-600 font-medium" onClick={() => navigate("/auth")}>
              Sign In
            </button>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
            >
              Get Started
            </motion.button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-4">
              {["Features", "Pricing", "Templates", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-700 hover:text-purple-600 font-medium"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t space-y-2">
                <button className="block w-full text-left text-gray-700 font-medium" onClick={() => navigate("/auth")}>
                  Sign In
                </button>
                <button
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// Hero Section
const HeroSection = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  const formPreviews = [
    {
      title: "Customer Feedback Survey",
      responses: "1,247",
      completion: "94%",
      fields: [
        { type: "rating", label: "Overall satisfaction", value: 4 },
        { type: "text", label: "What did you like most?", placeholder: "Great customer service and fast delivery..." },
        { type: "select", label: "How did you hear about us?", value: "Social Media" },
      ],
    },
    {
      title: "Event Registration Form",
      responses: "856",
      completion: "87%",
      fields: [
        { type: "text", label: "Full Name", placeholder: "John Smith" },
        { type: "email", label: "Email Address", placeholder: "john@example.com" },
        { type: "checkbox", label: "Dietary Restrictions", options: ["Vegetarian", "Vegan", "Gluten-free"] },
      ],
    },
    {
      title: "Product Feedback",
      responses: "2,103",
      completion: "91%",
      fields: [
        { type: "rating", label: "Product Quality", value: 5 },
        { type: "rating", label: "Value for Money", value: 4 },
        { type: "textarea", label: "Additional Comments", placeholder: "The product exceeded my expectations..." },
      ],
    },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 pt-24">
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-r from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 10 + i * 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ left: `${20 + i * 15}%`, top: `${10 + i * 10}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Beautiful Forms
            <br />
            <span className="text-gray-900">Made Simple</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create stunning, interactive forms that your users will love. Go beyond Google Forms with advanced logic,
            beautiful themes, and powerful analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
            >
              Start Building for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-all flex items-center border border-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </motion.button>
          </div>

          <motion.div
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            No credit card required • Free forever plan • Setup in 2 minutes
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Dashboard Preview */}
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl mx-auto border border-gray-200 overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium">FormWise Dashboard</span>
                </div>
                <div className="text-gray-400 text-sm">formwise.app</div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 bg-gray-50">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Responses</p>
                      <p className="text-2xl font-bold text-gray-900">4,206</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">91%</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Forms</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Form Preview Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="flex space-x-0">
                    {formPreviews.map((form, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === index
                            ? "border-purple-600 text-purple-600 bg-purple-50"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {form.title}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{formPreviews[activeTab].title}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{formPreviews[activeTab].responses} responses</span>
                          <span>•</span>
                          <span>{formPreviews[activeTab].completion} completion rate</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Live</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formPreviews[activeTab].fields.map((field, fieldIndex) => (
                        <motion.div
                          key={fieldIndex}
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: fieldIndex * 0.1 }}
                        >
                          <label className="block text-sm font-medium text-gray-700">{field.label}</label>

                          {field.type === "rating" && (
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-6 h-6 ${
                                    star <= field.value ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          {field.type === "text" && (
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-600">
                              {field.placeholder}
                            </div>
                          )}

                          {field.type === "email" && (
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-600">
                              {field.placeholder}
                            </div>
                          )}

                          {field.type === "textarea" && (
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 h-20 text-gray-600">
                              {field.placeholder}
                            </div>
                          )}

                          {field.type === "select" && (
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-600">
                              {field.value}
                            </div>
                          )}

                          {field.type === "checkbox" && (
                            <div className="space-y-2">
                              {field.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <div
                                    className={`w-4 h-4 rounded border-2 ${optionIndex === 0 ? "bg-purple-600 border-purple-600" : "border-gray-300"}`}
                                  >
                                    {optionIndex === 0 && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className="text-sm text-gray-700">{option}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <motion.button
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Response
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Beautiful Themes",
      description: "Choose from dozens of stunning themes or create your own with custom colors, fonts, and layouts.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get deep insights with real-time charts, response tracking, and exportable reports.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work together with your team using role-based permissions and real-time editing.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Logic",
      description: "Create dynamic forms with conditional logic, branching, and personalized experiences.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with encryption, GDPR compliance, and advanced access controls.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Integrations",
      description: "Connect with 1000+ apps including Slack, Notion, Google Sheets, and Zapier.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Everything you need to create amazing forms
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple contact forms to complex surveys, FormWise has all the tools you need to collect, analyze, and
            act on your data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true)
  const navigate = useNavigate()

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: ["5 Forms", "100 Responses/month", "Basic Themes", "Email Support", "Basic Analytics"],
      popular: false,
    },
    {
      name: "Pro",
      price: { monthly: 15, annual: 10 },
      description: "For growing businesses",
      features: [
        "Unlimited Forms",
        "5,000 Responses/month",
        "Custom Branding",
        "Advanced Logic",
        "Webhooks & API",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Business",
      price: { monthly: 35, annual: 25 },
      description: "For teams and enterprises",
      features: [
        "Everything in Pro",
        "Unlimited Responses",
        "Team Collaboration",
        "Advanced Analytics",
        "White-label Options",
        "Phone Support",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that's right for you. Upgrade or downgrade at any time.
          </p>

          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"}`}>Monthly</span>
            <motion.button
              className="relative w-14 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-1"
              onClick={() => setIsAnnual(!isAnnual)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`ml-3 ${isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
              Annual<span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Save 33%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-2xl p-8 relative ${plan.popular ? "ring-2 ring-purple-600 shadow-2xl scale-105" : "shadow-lg"}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-5xl font-bold">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                {isAnnual && plan.price.annual < plan.price.monthly && (
                  <p className="text-sm text-green-600 font-medium">
                    Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${plan.popular ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/auth")}
              >
                {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "FormWise transformed how we collect customer feedback. The analytics are incredible and the forms look amazing!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content:
        "We switched from Google Forms and never looked back. The conditional logic feature saved us hours of work.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager",
      company: "GlobalInc",
      content: "The team collaboration features are fantastic. We can all work on forms together seamlessly.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Loved by teams worldwide
          </h2>
          <p className="text-xl text-gray-600">See what our customers have to say about FormWise</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gcradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      question: "How is FormWise different from Google Forms?",
      answer:
        "FormWise offers advanced features like conditional logic, custom branding, detailed analytics, team collaboration, and beautiful themes that Google Forms doesn't provide. Plus, we're built specifically for businesses that need more control and customization.",
    },
    {
      question: "Can I import my existing Google Forms?",
      answer:
        "Yes! We provide an easy import tool that lets you migrate your existing Google Forms to FormWise in just a few clicks, preserving all your questions and settings.",
    },
    {
      question: "Is there a free plan available?",
      answer:
        "Our free plan includes 5 forms and 100 responses per month, which is perfect for getting started. You can upgrade anytime as your needs grow.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We take security seriously. All data is encrypted in transit and at rest, we're GDPR compliant, and we follow industry best practices for data protection. Your data is never shared with third parties.",
    },
    {
      question: "Can I customize the look of my forms?",
      answer:
        "Yes! FormWise offers extensive customization options including custom themes, colors, fonts, logos, and even custom CSS for advanced users. Make your forms match your brand perfectly.",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">Everything you need to know about FormWise</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8 + i * 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ left: `${10 + i * 30}%`, top: `${20 + i * 20}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to create amazing forms?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who've already made the switch to FormWise. Start building beautiful forms today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </div>

          <p className="text-white/80 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">FormWise</span>
            </div>
            <p className="text-gray-400 mb-4">Create beautiful, intelligent forms that your users will love.</p>
            <div className="flex space-x-4">{/* Social media icons would go here */}</div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 FormWise. All rights reserved.</p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen">
       <Helmet>
        <title>FormWise – Build Beautiful Forms Easily</title>
        <meta
          name="description"
          content="FormWise lets you build beautiful, smart forms with logic, analytics, and themes. Better than Google Forms."
        />
        <meta
          name="keywords"
          content="form builder, online forms, google forms alternative, survey builder, interactive forms"
        />
        <meta name="author" content="FormWise Team" />
        <meta property="og:title" content="FormWise – Smart Form Builder" />
        <meta
          property="og:description"
          content="Create beautiful forms with logic, analytics, and themes. Try FormWise free today."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://formwise.pages.dev/" />
        <meta property="og:image" content="/formwise-preview.png" />
        <link rel="canonical" href="https://formwise.pages.dev/" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FormWise",
              "description": "Smart, beautiful online form builder for surveys and more.",
              "applicationCategory": "BusinessApplication",
              "url": "https://formwise.pages.dev/",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </script>
      </Helmet>

      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
