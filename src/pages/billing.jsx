"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { CreditCard, Download, Check, ArrowLeft, Star, Menu, X } from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

export default function Billing() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [isAnnual, setIsAnnual] = useState(true)
  const [currentPlan] = useState("pro")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const usage = {
    forms: { used: 5, limit: 10 },
    responses: { used: 2500, limit: 10000 },
    teamMembers: { used: 2, limit: 5 },
    storage: { used: 1.5, limit: 5 },
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, annual: 0 },
      features: ["10 Forms", "1,000 Responses", "Unlimited Team Members", "500MB Storage"],
      popular: false,
    },
    {
      id: "starter",
      name: "Starter",
      description: "Essential features for growing teams",
      price: { monthly: 10, annual: 8 },
      features: ["Unlimited Forms", "10,000 Responses", "Unlimited Team Members", "5GB Storage"],
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

  const invoices = [
    { id: "INV-2023-12-001", date: "2023-12-15", amount: "$15.00", status: "Paid" },
    { id: "INV-2023-11-001", date: "2023-11-15", amount: "$15.00", status: "Paid" },
    { id: "INV-2023-10-001", date: "2023-10-15", amount: "$15.00", status: "Paid" },
  ]

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

        {/* Current Plan */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-white mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Pro Plan</h2>
              <p className="text-purple-100 mb-4">$15/month • Next billing: January 15, 2024</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                <div>
                  <p className="text-purple-200">Forms</p>
                  <p className="font-semibold">
                    {usage.forms.used} / {usage.forms.limit}
                  </p>
                </div>
                <div>
                  <p className="text-purple-200">Responses</p>
                  <p className="font-semibold">
                    {usage.responses.used.toLocaleString()} / {usage.responses.limit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-purple-200">Team Members</p>
                  <p className="font-semibold">
                    {usage.teamMembers.used} / {usage.teamMembers.limit}
                  </p>
                </div>
                <div>
                  <p className="text-purple-200">Storage</p>
                  <p className="font-semibold">
                    {usage.storage.used}GB / {usage.storage.limit}GB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <button className="bg-white text-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base">
                Manage Plan
              </button>
              <button className="bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors text-sm sm:text-base">
                Download Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Plans */}
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
                        ? "border-purple-300 bg-purple-50"
                        : plan.popular
                          ? "border-purple-200 bg-purple-25"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
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
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full w-fit">
                              Current Plan
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">{plan.description}</p>

                        <div className="flex flex-col sm:flex-row sm:items-baseline space-y-1 sm:space-y-0 sm:space-x-2 mb-4">
                          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                            ${isAnnual ? plan.price.annual : plan.price.monthly}
                          </span>
                          <span className="text-gray-600">/month</span>
                          {isAnnual && plan.price.annual < plan.price.monthly && (
                            <span className="text-sm text-green-600 font-medium">
                              Save ${(plan.price.monthly - plan.price.annual) * 12}/year
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

                      <div className="lg:ml-6">
                        {currentPlan === plan.id ? (
                          <button className="w-full lg:w-auto bg-gray-100 text-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium cursor-not-allowed text-sm sm:text-base">
                            Current Plan
                          </button>
                        ) : (
                          <button className="w-full lg:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base">
                            {plan.id === "free" ? "Downgrade" : "Upgrade"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
                </div>
              </div>

              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
                Update Payment Method
              </button>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">View All</button>
              </div>

              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{invoice.id}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-medium text-gray-900 text-sm">{invoice.amount}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {invoice.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Responses</span>
                    <span>
                      {usage.responses.used.toLocaleString()} / {usage.responses.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(usage.responses.used / usage.responses.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Storage</span>
                    <span>
                      {usage.storage.used}GB / {usage.storage.limit}GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(usage.storage.used / usage.storage.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Team Members</span>
                    <span>
                      {usage.teamMembers.used} / {usage.teamMembers.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(usage.teamMembers.used / usage.teamMembers.limit) * 100}%` }}
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
    </div>
  )
}
