"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Book,
  MessageCircle,
  Video,
  FileText,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Mail,
  Clock,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

export default function Help() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMobile, setIsMobile] = useState(false)
  const [expandedArticle, setExpandedArticle] = useState(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = [
    { id: "all", name: "All Topics", icon: <Book className="w-4 h-4" /> },
    { id: "getting-started", name: "Getting Started", icon: <Book className="w-4 h-4" /> },
    { id: "form-builder", name: "Form Builder", icon: <FileText className="w-4 h-4" /> },
    { id: "analytics", name: "Analytics", icon: <FileText className="w-4 h-4" /> },
    { id: "integrations", name: "Integrations", icon: <FileText className="w-4 h-4" /> },
    { id: "billing", name: "Billing", icon: <FileText className="w-4 h-4" /> },
  ]

  const helpArticles = [
    {
      id: 1,
      title: "Getting Started with FormWise",
      description: "Learn the basics of creating your first form",
      category: "getting-started",
      readTime: "5 min read",
      popular: true,
      content: "FormWise makes it easy to create powerful forms. Start by clicking \"Create New Form\" on your dashboard. Give your form a title and description, then drag and drop fields from the left panel onto the canvas. Once satisfied, click Publish to make it live and share the link with your audience.",
    },
    {
      id: 2,
      title: "Building Your First Form",
      description: "Step-by-step guide to creating forms",
      category: "form-builder",
      readTime: "8 min read",
      popular: true,
      content: "Use the Form Builder to add text inputs, dropdowns, checkboxes, ratings, and more. Each field can be configured with a label, placeholder, and validation rules (required, min/max length). Drag fields to reorder them. Use the Design tab to customize colors and fonts. The Settings tab lets you configure thank-you messages and redirect URLs.",
    },
    {
      id: 3,
      title: "Understanding Form Analytics",
      description: "How to interpret your form performance data",
      category: "analytics",
      readTime: "6 min read",
      popular: false,
      content: "The Analytics page shows total views, responses, and conversion rate for each form. The conversion rate is calculated as (responses / views) × 100. Use the date range filter to compare performance over time. Click on any form to see individual response data and field-level breakdowns.",
    },
    {
      id: 4,
      title: "Setting Up Integrations",
      description: "Connect FormWise with your favorite tools",
      category: "integrations",
      readTime: "10 min read",
      popular: true,
      content: "FormWise supports webhooks and native integrations with popular tools. Navigate to the Integrations page to connect Slack, Zapier, Google Sheets, and more. For webhooks, go to the Webhooks page and add your endpoint URL. Every form submission will POST the response data as JSON to your configured URL.",
    },
    {
      id: 5,
      title: "Managing Your Subscription",
      description: "Billing, plans, and payment information",
      category: "billing",
      readTime: "4 min read",
      popular: false,
      content: "Visit the Billing page to view your current plan, usage stats, and invoices. You can upgrade or downgrade at any time — changes take effect immediately. Payment is processed securely via Stripe. To update your payment method, click \"Update Payment Method\" in the Payment Method card.",
    },
  ]

  const quickActions = [
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: <Video className="w-6 h-6" />,
      action: () => window.open("https://youtube.com", "_blank"),
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: <MessageCircle className="w-6 h-6" />,
      action: () => {},
    },
    {
      title: "Contact Support",
      description: "Send us an email",
      icon: <Mail className="w-6 h-6" />,
      action: () => navigate("/support"),
    },
  ]

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            {isMobile && (
              <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg mr-4">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Help Center</h1>
              <p className="text-gray-600 mt-1">Find answers and get support</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
                whileHover={{ y: -2 }}
                onClick={action.action}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg text-purple-600">{action.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category.icon}
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {selectedCategory === "all"
                      ? "All Articles"
                      : categories.find((c) => c.id === selectedCategory)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredArticles.length === 0 ? (
                    <div className="p-8 text-center">
                      <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                      <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
                    </div>
                  ) : (
                    filteredArticles.map((article) => (
                      <motion.div
                        key={article.id}
                        className="border-b border-gray-200 last:border-b-0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{article.title}</h4>
                                {article.popular && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-2">{article.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {article.readTime}
                                </span>
                                <span className="capitalize">{article.category.replace("-", " ")}</span>
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                expandedArticle === article.id ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                        </div>
                        {expandedArticle === article.id && (
                          <div className="px-6 pb-6 bg-purple-50 border-t border-purple-100">
                            <p className="text-gray-700 leading-relaxed pt-4">{article.content}</p>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
                <p className="text-purple-100">Our support team is here to help you succeed.</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate("/support")}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => window.open("tel:+1234567890")}
                  className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Call Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation activePath="/help" />}
    </div>
  )
}
