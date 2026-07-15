"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { CreditCard, Download, Check, ArrowLeft, Star, Menu, X, Shield, QrCode, Cpu, Landmark, Wallet, Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"
import { useUserProfile } from "../hooks/use-user-profile"
import { useAuth } from "../hooks/use-auth"
import { db } from "../lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { createMockPaymentSession } from "../lib/cashfree"

export default function Billing() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [isAnnual, setIsAnnual] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // Real Firestore user profile state
  const { userProfile, loading: profileLoading } = useUserProfile()
  const { user } = useAuth()

  // Cashfree integration states
  const [checkoutSession, setCheckoutSession] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [vpa, setVpa] = useState("")
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" })
  const [selectedBank, setSelectedBank] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const currentPlan = userProfile?.subscription?.plan || "free"
  const invoicesList = userProfile?.invoices || []

  // Dynamic limits definition
  const planLimits = {
    free: { forms: 10, responses: 1000, teamMembers: 1, storage: 0.5 },
    starter: { forms: 99999, responses: 10000, teamMembers: 5, storage: 5 },
    pro: { forms: 99999, responses: 50000, teamMembers: 99999, storage: 50 }
  }

  const currentPlanLimits = planLimits[currentPlan] || planLimits.free

  const usage = {
    forms: { used: 3, limit: currentPlanLimits.forms },
    responses: { used: 450, limit: currentPlanLimits.responses },
    teamMembers: { used: 1, limit: currentPlanLimits.teamMembers },
    storage: { used: 0.1, limit: currentPlanLimits.storage },
  }

  const formatLimit = (value, unit = "") => {
    if (value >= 99999) return "Unlimited"
    return `${value.toLocaleString()}${unit}`
  }

  const getPercentage = (used, limit) => {
    if (limit >= 99999) return 5
    return Math.min(100, Math.round((used / limit) * 100))
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, annual: 0 },
      features: ["10 Forms", "1,000 Responses", "1 Team Member", "500MB Storage"],
      popular: false,
    },
    {
      id: "starter",
      name: "Starter",
      description: "Essential features for growing teams",
      price: { monthly: 10, annual: 8 },
      features: ["Unlimited Forms", "10,000 Responses", "5 Team Members", "5GB Storage"],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced tools for power users",
      price: { monthly: 15, annual: 10 },
      features: ["Unlimited Forms", "50,000 Responses", "Unlimited Team Members", "50GB Storage"],
      popular: true,
    },
  ]

  const handlePlanSelect = async (plan) => {
    if (!user) return

    if (plan.id === "free") {
      // Downgrade directly
      try {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          "subscription.plan": "free",
          "subscription.billingCycle": "monthly",
          "subscription.updatedAt": new Date()
        })
      } catch (error) {
        console.error("Error downgrading plan:", error)
      }
      return
    }

    const price = isAnnual ? plan.price.annual : plan.price.monthly
    const orderAmount = price * (isAnnual ? 12 : 1) * 84 // Convert to INR

    setCheckoutSession({
      planId: plan.id,
      planName: plan.name,
      amount: orderAmount,
      currency: "INR",
      orderId: `order_fw_${Math.floor(100000 + Math.random() * 900000)}`,
      paymentSessionId: `session_cf_${Math.random().toString(36).substr(2, 16)}`
    })
  }

  const handleMockPayment = async () => {
    if (!user || !checkoutSession) return

    setProcessingPayment(true)
    
    // Simulate gateway delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const newInvoice = {
        id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split("T")[0],
        amount: `₹${checkoutSession.amount.toLocaleString()}`,
        status: "Paid"
      }

      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        "subscription.plan": checkoutSession.planId,
        "subscription.status": "active",
        "subscription.billingCycle": isAnnual ? "annual" : "monthly",
        "subscription.updatedAt": new Date(),
        invoices: [newInvoice, ...invoicesList]
      })

      setPaymentSuccess(true)
      setTimeout(() => {
        setPaymentSuccess(false)
        setCheckoutSession(null)
      }, 2500)
    } catch (error) {
      console.error("Error executing payment:", error)
    } finally {
      setProcessingPayment(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
              <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Billing</h1>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Billing & Plans</h1>
                <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
              </div>
            </div>
          )}

          {/* Current Plan Dashboard Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-white mb-6 lg:mb-8 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-bold capitalize">{currentPlan} Plan</h2>
                  {currentPlan !== "free" && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-purple-100 mb-4 mt-1">
                  {currentPlan === "free" 
                    ? "Upgrade to unlock advanced analytics, unlimited fields, and high limits."
                    : currentPlan === "starter" 
                      ? "Essential features for growing teams • Next billing cycle renewal pending."
                      : "Advanced tools for power users • Premium subscription enabled."}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm bg-black/10 p-4 rounded-lg">
                  <div>
                    <p className="text-purple-200">Forms</p>
                    <p className="font-semibold text-base">
                      {usage.forms.used} / {formatLimit(usage.forms.limit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-200">Responses</p>
                    <p className="font-semibold text-base">
                      {usage.responses.used.toLocaleString()} / {formatLimit(usage.responses.limit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-200">Team Members</p>
                    <p className="font-semibold text-base">
                      {usage.teamMembers.used} / {formatLimit(usage.teamMembers.limit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-200">Storage</p>
                    <p className="font-semibold text-base">
                      {usage.storage.used}GB / {formatLimit(usage.storage.limit, "GB")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 lg:space-y-2 sm:space-x-2 lg:space-x-0">
                <button 
                  onClick={() => document.getElementById("available-plans-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white text-purple-600 px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm shadow-sm"
                >
                  Change Plan
                </button>
              </div>
            </div>
          </div>

          <div id="available-plans-section" className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Plans List */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Available Plans</h2>

                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                        !isAnnual ? "bg-white shadow-sm" : ""
                      }`}
                      onClick={() => setIsAnnual(false)}
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                        isAnnual ? "bg-white shadow-sm" : ""
                      }`}
                      onClick={() => setIsAnnual(true)}
                    >
                      Annual
                      <span className="ml-1 bg-green-100 text-green-800 text-xs px-1 py-0.5 rounded">Save 33%</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      className={`border-2 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all ${
                        currentPlan === plan.id
                          ? "border-purple-300 bg-purple-50/50 shadow-sm"
                          : plan.popular
                            ? "border-purple-200 bg-purple-25/30"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                            {plan.popular && (
                              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full w-fit">
                                <Star className="w-3 h-3 inline mr-1" />
                                Popular
                              </span>
                            )}
                            {currentPlan === plan.id && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full w-fit font-medium">
                                Current Plan
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3">{plan.description}</p>

                          <div className="flex flex-col sm:flex-row sm:items-baseline space-y-1 sm:space-y-0 sm:space-x-2 mb-4">
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                              ₹{((isAnnual ? plan.price.annual : plan.price.monthly) * 84).toLocaleString()}
                            </span>
                            <span className="text-gray-600">/month</span>
                            {isAnnual && plan.price.annual < plan.price.monthly && (
                              <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                                Save ₹{((plan.price.monthly - plan.price.annual) * 12 * 84).toLocaleString()}/year
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-700">
                                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="lg:ml-6 mt-4 lg:mt-0">
                          {currentPlan === plan.id ? (
                            <button className="w-full lg:w-auto bg-gray-100 text-gray-400 px-6 py-2.5 rounded-lg font-medium cursor-not-allowed text-sm">
                              Active Plan
                            </button>
                          ) : (
                            <button 
                              onClick={() => handlePlanSelect(plan)}
                              className="w-full lg:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-md transition-all text-sm"
                            >
                              {plan.id === "free" ? "Downgrade" : "Upgrade with Cashfree"}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Usage and Invoices */}
            <div className="space-y-4 sm:space-y-6">
              {/* Payment Info */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Integrator</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Cashfree Gateway</p>
                    <p className="text-xs text-gray-500">Secured with 256-bit encryption</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  Payments are securely processed via Cashfree. You can pay using UPI, cards, net banking, or popular mobile wallets.
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
                </div>

                <div className="space-y-3">
                  {invoicesList.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      No invoices found. Upgrade to generate invoices.
                    </div>
                  ) : (
                    invoicesList.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{invoice.id}</p>
                          <p className="text-xs text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-medium text-gray-900 text-sm">{invoice.amount}</p>
                          <div className="flex items-center space-x-2 justify-end">
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                              {invoice.status}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Real-time Usage Limits card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Responses</span>
                      <span className="font-medium text-gray-900">
                        {usage.responses.used.toLocaleString()} / {formatLimit(usage.responses.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getPercentage(usage.responses.used, usage.responses.limit)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Storage</span>
                      <span className="font-medium text-gray-900">
                        {usage.storage.used}GB / {formatLimit(usage.storage.limit, "GB")}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getPercentage(usage.storage.used, usage.storage.limit)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Team Members</span>
                      <span className="font-medium text-gray-900">
                        {usage.teamMembers.used} / {formatLimit(usage.teamMembers.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getPercentage(usage.teamMembers.used, usage.teamMembers.limit)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation activePath="/billing" />}

      {/* Cashfree Payment Gateway Interactive Modal Overlay */}
      <AnimatePresence>
        {checkoutSession && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row"
            >
              {/* Checkout details sidebar */}
              <div className="bg-[#1e232f] text-white p-6 md:w-5/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1 mb-6">
                    <span className="text-sky-400 font-extrabold text-lg">cashfree</span>
                    <span className="text-white text-xs font-semibold bg-white/10 px-1.5 py-0.5 rounded">payments</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Plan Selected</p>
                      <h4 className="text-lg font-bold text-white mt-0.5">{checkoutSession.planName}</h4>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Order ID</p>
                      <code className="text-xs font-mono text-sky-300 break-all">{checkoutSession.orderId}</code>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-2xl font-extrabold text-white mt-0.5">
                    ₹{checkoutSession.amount.toLocaleString()}.00
                  </p>
                </div>
              </div>

              {/* Gateway interface */}
              <div className="flex-1 p-6 flex flex-col justify-between bg-white min-h-[400px]">
                {paymentSuccess ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-900">Payment Successful</h3>
                    <p className="text-sm text-gray-500 mt-1">Updating your subscription details...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                          <h3 className="font-bold text-gray-900">Choose Payment Method</h3>
                          <button 
                            onClick={() => setCheckoutSession(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Payment Tabs */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                          {[
                            { id: "upi", label: "UPI", icon: <QrCode className="w-4 h-4" /> },
                            { id: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
                            { id: "netbanking", label: "Netbank", icon: <Landmark className="w-4 h-4" /> },
                            { id: "wallet", label: "Wallet", icon: <Wallet className="w-4 h-4" /> }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setPaymentMethod(tab.id)}
                              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                paymentMethod === tab.id
                                  ? "border-purple-600 bg-purple-50/50 text-purple-700 shadow-sm"
                                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {tab.icon}
                              <span className="mt-1">{tab.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-4">
                          {paymentMethod === "upi" && (
                            <div className="space-y-4">
                              <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2 shadow-sm mb-2">
                                  <QrCode className="w-20 h-20 text-gray-900" />
                                </div>
                                <p className="text-[11px] text-gray-400 text-center uppercase tracking-wider">Scan QR code using any UPI app</p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Pay via UPI ID (VPA)</label>
                                <input
                                  type="text"
                                  placeholder="username@upi"
                                  value={vpa}
                                  onChange={(e) => setVpa(e.target.value)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                              </div>
                            </div>
                          )}

                          {paymentMethod === "card" && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Cardholder Name</label>
                                <input
                                  type="text"
                                  placeholder="John Doe"
                                  value={cardDetails.name}
                                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
                                <input
                                  type="text"
                                  placeholder="4111 2222 3333 4444"
                                  value={cardDetails.number}
                                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                                  <input
                                    type="password"
                                    placeholder="•••"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {paymentMethod === "netbanking" && (
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Select Bank</label>
                              <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                              >
                                <option value="">-- Choose a Bank --</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="kotak">Kotak Mahindra Bank</option>
                              </select>
                            </div>
                          )}

                          {paymentMethod === "wallet" && (
                            <div className="grid grid-cols-2 gap-2">
                              {["PhonePe", "Paytm", "Amazon Pay", "Google Pay"].map((wallet) => (
                                <button
                                  key={wallet}
                                  onClick={() => setSelectedWallet(wallet)}
                                  className={`p-3 border rounded-lg text-left text-sm font-semibold transition-all ${
                                    selectedWallet === wallet
                                      ? "border-purple-600 bg-purple-50/50 text-purple-700"
                                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {wallet}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-400">
                          <Shield className="w-3.5 h-3.5 mr-1 text-green-500" />
                          100% Secure Checkout
                        </div>
                        {!paymentSuccess && (
                          <button
                            onClick={handleMockPayment}
                            disabled={processingPayment}
                            className="bg-[#1e232f] hover:bg-[#2c3242] text-white py-2 px-6 rounded-lg text-sm font-bold flex items-center transition-all disabled:opacity-50"
                          >
                            {processingPayment ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Pay Now"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
