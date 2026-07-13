"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Star,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Grid,
  ListIcon,
  Settings,
  Home,
  Layout,
  PlusCircle,
  User,
  HelpCircle,
  LogOut,
  Bell,
  Download,
  Upload,
  Shield,
  CreditCard,
  Zap,
  Globe,
  Mail,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"
import Sidebar from "../components/sidebar"

// Import the analytics hook
import { useForms, useEnhancedAnalytics } from "../hooks/use-forms"
import { useNotifications } from "../hooks/use-notifications"

import { useAuth } from "../hooks/use-auth"

// Replace the mock stats with real data
export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(null)
  const [showMobileActions, setShowMobileActions] = useState(null)
  const [viewMode, setViewMode] = useState("list")
  const [sortBy, setSortBy] = useState("recent")
  const [filterStatus, setFilterStatus] = useState("all")
  const navigate = useNavigate()
  const { forms, loading: formsLoading, deleteForm, duplicateForm, shareForm } = useForms()
  const { analytics, loading: analyticsLoading } = useEnhancedAnalytics()
  const { getRecentActivity, unreadCount } = useNotifications()
  const mobileActionsRef = useRef(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close mobile actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileActionsRef.current && !mobileActionsRef.current.contains(event.target)) {
        setShowMobileActions(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter forms based on search and status
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || form.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Sort forms based on selected option
  const sortedForms = [...filteredForms].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      case "responses":
        return (b.responseCount || 0) - (a.responseCount || 0)
      case "views":
        return (b.views || 0) - (a.views || 0)
      case "alphabetical":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const stats = [
    {
      title: "Total Forms",
      value: analytics?.totalForms?.toString() || "0",
      change: analytics?.formsChange ? `${analytics.formsChange > 0 ? "+" : ""}${analytics.formsChange}%` : "+0%",
      changeType: analytics?.formsChange >= 0 ? "positive" : "negative",
      icon: <FileText className="w-5 h-5 md:w-6 md:h-6" />,
      color: "from-blue-500 to-blue-600",
      subtitle: `${analytics?.formsCreatedLast30Days || 0} created this month`,
    },
    {
      title: "Total Responses",
      value: analytics?.totalResponses?.toLocaleString() || "0",
      change: analytics?.responsesChange
        ? `${analytics.responsesChange > 0 ? "+" : ""}${analytics.responsesChange}%`
        : "+0%",
      changeType: analytics?.responsesChange >= 0 ? "positive" : "negative",
      icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />,
      color: "from-green-500 to-green-600",
      subtitle: `${analytics?.responsesLast30Days || 0} responses this month`,
    },
    {
      title: "Active Forms",
      value: analytics?.activeForms?.toString() || "0",
      change: `${analytics?.activeFormsChange || 0}%`,
      changeType: "neutral",
      icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
      color: "from-purple-500 to-purple-600",
      subtitle: `${analytics?.activeFormsChange || 0}% of total forms`,
    },
    {
      title: "Conversion Rate",
      value: `${analytics?.conversionRate || 0}%`,
      change: analytics?.viewsChange ? `${analytics.viewsChange > 0 ? "+" : ""}${analytics.viewsChange}%` : "+0%",
      changeType: analytics?.viewsChange >= 0 ? "positive" : "negative",
      icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
      color: "from-orange-500 to-orange-600",
      subtitle: `${analytics?.totalViews?.toLocaleString() || 0} total views`,
    },
  ]

  const templates = [
    {
      title: "Contact Form",
      description: "Simple contact form with name, email, and message",
      category: "Basic",
      uses: 1200,
    },
    {
      title: "Event Registration",
      description: "Comprehensive event registration with payment",
      category: "Events",
      uses: 890,
    },
    {
      title: "Customer Survey",
      description: "Detailed customer satisfaction survey",
      category: "Survey",
      uses: 756,
    },
    {
      title: "Job Application",
      description: "Professional job application form",
      category: "HR",
      uses: 634,
    },
  ]

  // Enhanced mobile menu items to match all sidebar sections
  const mobileMenuSections = [
    {
      title: "Main",
      items: [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", path: "/dashboard", active: true },
        { icon: <PlusCircle className="w-5 h-5" />, label: "Create Form", path: "/builder/new" },
        { icon: <FileText className="w-5 h-5" />, label: "My Forms", path: "/forms" },
        { icon: <Layout className="w-5 h-5" />, label: "Templates", path: "/templates" },
      ],
    },
    {
      title: "Analytics & Reports",
      items: [
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", path: "/analytics" },
      ],
    },
    {
      title: "Tools & Integrations",
      items: [
        { icon: <Zap className="w-5 h-5" />, label: "Integrations", path: "/integrations" },
        { icon: <Globe className="w-5 h-5" />, label: "Webhooks", path: "/webhooks" },
        { icon: <Upload className="w-5 h-5" />, label: "Import", path: "/import" },
      ],
    },
    {
      title: "Account & Settings",
      items: [
        { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile" },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/settings" },
        { icon: <CreditCard className="w-5 h-5" />, label: "Billing", path: "/billing" },
        { icon: <Bell className="w-5 h-5" />, label: "Notifications", path: "/notifications" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: <HelpCircle className="w-5 h-5" />, label: "Help Center", path: "/help" },
        { icon: <Mail className="w-5 h-5" />, label: "Contact Support", path: "/support" },
      ],
    },
  ]

  const handleShareForm = async (formId, event) => {
    if (event) {
      event.stopPropagation()
    }

    const shareableLink = `${window.location.origin}/form/${formId}`

    try {
      // Copy the link to the clipboard
      await navigator.clipboard.writeText(shareableLink)

      // Create notification for sharing
      await shareForm(formId)
    } catch (error) {
      console.error("Error copying link: ", error)
      alert("Failed to copy link. Please try again.")
    }
  }

  const handleDeleteForm = async (formId, event) => {
    if (event) {
      event.stopPropagation()
    }

    if (window.confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      try {
        await deleteForm(formId)
        setShowMobileActions(null)
      } catch (error) {
        console.error("Error deleting form:", error)
        alert("Failed to delete form. Please try again.")
      }
    }
  }

  const handleDuplicateForm = async (formId, event) => {
    if (event) {
      event.stopPropagation()
    }

    try {
      const newFormId = await duplicateForm(formId)
      setShowMobileActions(null)
      navigate(`/builder/${newFormId}`)
    } catch (error) {
      console.error("Error duplicating form:", error)
      alert("Failed to duplicate form. Please try again.")
    }
  }

  const handleFormClick = (formId) => {
    navigate(`/form-responses/${formId}`)
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
      case "warning":
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
      case "info":
        return <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
      default:
        return <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
    }
  }

  const getActivityBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100"
      case "warning":
        return "bg-yellow-100"
      case "error":
        return "bg-red-100"
      case "info":
        return "bg-blue-100"
      default:
        return "bg-gray-100"
    }
  }

  const formatTimeAgo = (date) => {
    if (!date) return "Unknown"

    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const renderEnhancedMobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      {/* Main Navigation */}
      <div className="flex justify-around items-center py-2">
        <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center p-2 text-purple-600">
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={() => navigate("/forms")} className="flex flex-col items-center p-2 text-gray-500">
          <FileText className="w-5 h-5" />
          <span className="text-xs mt-1">Forms</span>
        </button>
        <button
          onClick={() => navigate("/builder/new")}
          className="flex flex-col items-center p-2 bg-purple-600 text-white rounded-full -mt-5 shadow-lg"
        >
          <PlusCircle className="w-8 h-8" />
          <span className="text-xs mt-1">Create</span>
        </button>
        <button onClick={() => navigate("/analytics")} className="flex flex-col items-center p-2 text-gray-500">
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs mt-1">Analytics</span>
        </button>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex flex-col items-center p-2 text-gray-500"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs mt-1">More</span>
        </button>
      </div>
    </div>
  )

  if (formsLoading || analyticsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {!isMobile && <Sidebar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="p-3 sm:p-4 lg:p-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/builder/new")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/notifications")}
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Mobile Menu */}
          <AnimatePresence>
            {isMobile && showMobileMenu && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileMenu(false)}
              >
                <motion.div
                  className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Menu Header */}
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <div>
                      <h2 className="font-semibold text-lg">Menu</h2>
                      <p className="text-purple-100 text-sm">All features & tools</p>
                    </div>
                    <button onClick={() => setShowMobileMenu(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Menu Sections */}
                  <div className="p-4">
                    {mobileMenuSections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item, itemIndex) => (
                            <button
                              key={itemIndex}
                              onClick={() => {
                                navigate(item.path)
                                setShowMobileMenu(false)
                              }}
                              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                                item.active
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <div className={item.active ? "text-purple-600" : "text-gray-500"}>{item.icon}</div>
                              <span className="font-medium">{item.label}</span>
                              {item.label === "Notifications" && unreadCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* User Section */}
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.displayName || "User"}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setShowMobileMenu(false)
                        }}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your forms.</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/builder/new")}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Create New Form
                </motion.button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white`}
                  >
                    {stat.icon}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{stat.title}</p>
                {stat.subtitle && <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>}
              </motion.div>
            ))}
          </div>

          {/* Advanced Analytics Section
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <AdvancedAnalyticsWidget analytics={analytics} forms={forms} />
            <FormInsightsWidget forms={forms} analytics={analytics} />
          </div> */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Recent Forms */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Your Forms</h2>
                    <button
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
                      onClick={() => navigate("/forms")}
                    >
                      View All
                    </button>
                  </div>

                  {/* Search and Filter - Desktop */}
                  {!isMobile && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="text"
                          placeholder="Search forms..."
                          className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="recent">Most Recent</option>
                          <option value="responses">Most Responses</option>
                          <option value="views">Most Views</option>
                          <option value="alphabetical">A-Z</option>
                        </select>
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "bg-white text-gray-500"}`}
                          >
                            <Grid className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "bg-white text-gray-500"}`}
                          >
                            <ListIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search and Filter - Mobile */}
                  {isMobile && (
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search forms..."
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          onClick={() => setShowMobileFilters(!showMobileFilters)}
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Filters
                          {showMobileFilters ? (
                            <ChevronUp className="w-4 h-4 ml-2" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-2" />
                          )}
                        </button>
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "bg-white text-gray-500"}`}
                          >
                            <Grid className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "bg-white text-gray-500"}`}
                          >
                            <ListIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Filters Dropdown */}
                      <AnimatePresence>
                        {showMobileFilters && (
                          <motion.div
                            className="bg-gray-50 rounded-lg p-3 space-y-3"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                              <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                              <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              >
                                <option value="recent">Most Recent</option>
                                <option value="responses">Most Responses</option>
                                <option value="views">Most Views</option>
                                <option value="alphabetical">A-Z</option>
                              </select>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-gray-200">
                  {sortedForms.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center">
                      <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        {forms.length === 0
                          ? "Create your first form to get started"
                          : "Try adjusting your search criteria"}
                      </p>
                      <button
                        onClick={() => navigate("/builder/new")}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                      >
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Create Your First Form
                      </button>
                    </div>
                  ) : viewMode === "grid" ? (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                      {sortedForms.slice(0, 10).map((form, index) => (
                        <motion.div
                          key={form.id}
                          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          onClick={() => handleFormClick(form.id)}
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900 truncate pr-2">{form.title}</h3>
                              <div className="relative">
                                <button
                                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMobileActions(showMobileActions === form.id ? null : form.id)
                                  }}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {/* Mobile Actions Dropdown */}
                                {showMobileActions === form.id && (
                                  <div
                                    ref={mobileActionsRef}
                                    className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                  >
                                    <div className="py-1">
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          navigate(`/builder/${form.id}`)
                                        }}
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => handleDuplicateForm(form.id, e)}
                                      >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Duplicate
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => handleShareForm(form.id, e)}
                                      >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={(e) => handleDeleteForm(form.id, e)}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  form.status === "published"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {form.status}
                              </span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {form.fields?.length || 0} fields
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                              <div className="flex items-center">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                {form.responseCount || 0}
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {form.views || 0}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "Unknown"}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // List View
                    sortedForms
                      .slice(0, 10)
                      .map((form, index) => (
                        <motion.div
                          key={form.id}
                          className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onClick={() => handleFormClick(form.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">{form.title}</h3>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    {form.fields?.length || 0} fields
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      form.status === "published"
                                        ? "bg-green-100 text-green-800"
                                        : form.status === "draft"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {form.status}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center">
                                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  {form.responseCount || 0} responses
                                </span>
                                <span className="flex items-center">
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  {form.views || 0} views
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "Unknown"}
                                </span>
                              </div>
                            </div>

                            {/* Desktop Actions */}
                            {!isMobile && (
                              <div className="flex items-center space-x-1 sm:space-x-2 ml-4">
                                <button
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/analytics/${form.id}`)
                                  }}
                                  title="View Analytics"
                                >
                                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/builder/${form.id}`)
                                  }}
                                  title="Edit Form"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  onClick={(e) => handleDuplicateForm(form.id, e)}
                                  title="Duplicate Form"
                                >
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  onClick={(e) => handleShareForm(form.id, e)}
                                  title="Share Form"
                                >
                                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={(e) => handleDeleteForm(form.id, e)}
                                  title="Delete Form"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            )}

                            {/* Mobile Actions */}
                            {isMobile && (
                              <div className="relative">
                                <button
                                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMobileActions(showMobileActions === form.id ? null : form.id)
                                  }}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {showMobileActions === form.id && (
                                  <div
                                    ref={mobileActionsRef}
                                    className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                  >
                                    <div className="py-1">
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          navigate(`/analytics/${form.id}`)
                                          setShowMobileActions(null)
                                        }}
                                      >
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Analytics
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          navigate(`/builder/${form.id}`)
                                        }}
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => handleDuplicateForm(form.id, e)}
                                      >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Duplicate
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => handleShareForm(form.id, e)}
                                      >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={(e) => handleDeleteForm(form.id, e)}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Start Templates */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Start Templates</h2>
                <div className="space-y-3 sm:space-y-4">
                  {templates.map((template, index) => (
                    <motion.div
                      key={index}
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate("/templates")}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{template.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 ml-2">
                          <Star className="w-3 h-3 mr-1" />
                          {template.uses}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">{template.description}</p>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {template.category}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <button
                  className="w-full mt-4 py-2 text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
                  onClick={() => navigate("/templates")}
                >
                  View All Templates
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <button
                    onClick={() => navigate("/notifications")}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {getRecentActivity(5).length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No recent activity</p>
                      <p className="text-xs text-gray-400 mt-1">Activity will appear here as you use FormWise</p>
                    </div>
                  ) : (
                    getRecentActivity(5).map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => activity.actionUrl && navigate(activity.actionUrl)}
                      >
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {activity.formTitle
                              ? `${activity.formTitle} • ${formatTimeAgo(activity.createdAt)}`
                              : formatTimeAgo(activity.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Bottom Navigation */}
        {isMobile && renderEnhancedMobileBottomNav()}
      </div>
    </div>
  )
}
