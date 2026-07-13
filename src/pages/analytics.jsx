"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { format, subDays, eachDayOfInterval, isToday } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts"
import {
  ArrowUpRight,
  Users,
  FileText,
  Eye,
  CheckCircle,
  Download,
  ChevronDown,
  TrendingUp,
  Clock,
  BarChart3,
  Bell,
} from "lucide-react"
import { useFormsAnalytics, useForms } from "../hooks/use-forms"
import { useAuth } from "../hooks/use-auth"
import { collection, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore"
import { db } from "../lib/firebase"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

// Helper function to generate date ranges
const getDateRange = (days) => {
  const end = new Date()
  const start = subDays(end, days)
  return { start, end }
}

const Analytics = () => {
  const { user } = useAuth()
  const { loading: loadingAnalytics } = useFormsAnalytics()
  const { forms, loading: loadingForms } = useForms()
  const [dateRange, setDateRange] = useState("30")
  const [responseData, setResponseData] = useState([])
  const [viewsData, setViewsData] = useState([])
  const [conversionData, setConversionData] = useState(null)
  const [deviceData, setDeviceData] = useState([])
  const [topForms, setTopForms] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalStats, setTotalStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    activeForms: 0,
    totalViews: 0,
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch analytics data based on date range
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user || loadingForms) return

      setLoading(true)

      try {
        const range = getDateRange(Number.parseInt(dateRange))

        // Calculate basic stats from forms
        const activeForms = forms.filter((form) => form.status === "published").length
        const totalViews = forms.reduce((sum, form) => sum + (form.views || 0), 0)

        setTotalStats({
          totalForms: forms.length,
          activeForms: activeForms,
          totalViews: totalViews,
          totalResponses: 0, // Will be updated below
        })

        if (forms.length === 0) {
          setLoading(false)
          return
        }

        // Get all form IDs for this user
        const formIds = forms.map((form) => form.id)

        // Fetch all responses for user's forms (without date filter first to get total count)
        let allResponses = []

        // Fetch responses in batches due to Firestore 'in' query limit of 10
        const batchSize = 10
        for (let i = 0; i < formIds.length; i += batchSize) {
          const batch = formIds.slice(i, i + batchSize)

          const responsesQuery = query(
            collection(db, "formResponses"),
            where("formId", "in", batch),
            orderBy("submittedAt", "desc"),
          )

          const responsesSnapshot = await getDocs(responsesQuery)
          const batchResponses = responsesSnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              submittedAt: data.submittedAt?.toDate() || new Date(),
            }
          })
          allResponses = [...allResponses, ...batchResponses]
        }


        // Filter responses by date range
        const filteredResponses = allResponses.filter((response) => {
          const responseDate = response.submittedAt
          return responseDate >= range.start && responseDate <= range.end
        })


        // Update total responses count
        setTotalStats((prev) => ({
          ...prev,
          totalResponses: allResponses.length,
        }))

        // Process response data by day
        const days = eachDayOfInterval({ start: range.start, end: range.end })
        const dailyResponses = days.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd")
          const dayResponses = filteredResponses.filter((r) => format(r.submittedAt, "yyyy-MM-dd") === dayStr)

          // Use actual form view data proportionally or fallback to responses * 3
          const totalFormViews = forms.reduce((sum, f) => sum + (f.views || 0), 0)
          const avgViewsPerResponse = totalFormViews > 0 && allResponses.length > 0
            ? totalFormViews / allResponses.length
            : 3
          const responseCount = dayResponses.length
          const viewCount = Math.round(responseCount * avgViewsPerResponse)

          return {
            date: dayStr,
            responses: responseCount,
            views: viewCount,
            formattedDate: format(day, "MMM d"),
          }
        })

        setResponseData(dailyResponses)
        setViewsData(dailyResponses)

        // Process hourly data for today
        const todayResponses = filteredResponses.filter((r) => isToday(r.submittedAt))

        const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
          const hourResponses = todayResponses.filter((r) => r.submittedAt.getHours() === hour)
          return {
            hour: hour < 10 ? `0${hour}:00` : `${hour}:00`,
            responses: hourResponses.length,
          }
        })

        setHourlyData(hourlyStats)

        // Process device data
        const devices = { Desktop: 0, Mobile: 0, Tablet: 0, Unknown: 0 }

        filteredResponses.forEach((response) => {
          const ua = response.userAgent || ""
          let device = "Unknown"

          if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            device = "Mobile"
          } else if (/iPad|Tablet/i.test(ua)) {
            device = "Tablet"
          } else if (ua) {
            device = "Desktop"
          }

          devices[device] = (devices[device] || 0) + 1
        })

        const deviceChartData = Object.entries(devices)
          .filter(([, value]) => value > 0)
          .map(([name, value]) => ({
            name,
            value,
            percentage: filteredResponses.length > 0 ? ((value / filteredResponses.length) * 100).toFixed(1) : 0,
          }))

        setDeviceData(deviceChartData)

        // Calculate conversion rate
        const totalResponsesInRange = filteredResponses.length
        const estimatedViews = dailyResponses.reduce((sum, day) => sum + day.views, 0)

        setConversionData({
          rate: estimatedViews > 0 ? ((totalResponsesInRange / estimatedViews) * 100).toFixed(1) : 0,
          views: estimatedViews,
          responses: totalResponsesInRange,
        })

        // Get top performing forms with actual response counts
        const formPerformance = forms.map((form) => {
          const formResponses = allResponses.filter((r) => r.formId === form.id)
          const formResponsesInRange = filteredResponses.filter((r) => r.formId === form.id)
          const estimatedFormViews = form.views || Math.round(formResponses.length * 3)
          const conversionRate =
            estimatedFormViews > 0 ? ((formResponses.length / estimatedFormViews) * 100).toFixed(1) : 0

          return {
            id: form.id,
            title: form.title,
            responses: formResponses.length,
            responsesInRange: formResponsesInRange.length,
            views: estimatedFormViews,
            conversionRate: Number.parseFloat(conversionRate),
            status: form.status || "draft",
            lastResponse: formResponses.length > 0 ? formResponses[0].submittedAt : null,
          }
        })

        // Sort by total responses count
        formPerformance.sort((a, b) => b.responses - a.responses)
        setTopForms(formPerformance.slice(0, 10))

      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!loadingForms && user) {
      fetchAnalyticsData()
    } else if (!loadingForms) {
      setLoading(false)
    }
  }, [user, forms, dateRange, loadingForms])

  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      summary: {
        totalForms: totalStats.totalForms,
        totalResponses: totalStats.totalResponses,
        activeForms: totalStats.activeForms,
        totalViews: totalStats.totalViews,
        conversionRate: conversionData?.rate || 0,
        dateRange: dateRange,
        exportDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      },
      dailyData: responseData,
      hourlyData: hourlyData,
      topForms: topForms,
      deviceBreakdown: deviceData,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `formwise-analytics-${format(new Date(), "yyyy-MM-dd")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Loading state
  if (loading || loadingAnalytics || loadingForms) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {!isMobile && <Sidebar />}
        <div className="flex-1 pb-16 md:pb-0">
          <div className="p-4 md:p-8">
            <div className="animate-pulse">
              {/* Mobile loading header */}
              {isMobile && (
                <div className="mb-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              )}

              {/* Desktop loading header */}
              {!isMobile && (
                <div className="mb-8">
                  <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-96"></div>
                </div>
              )}

              {/* Stats cards loading */}
              <div
                className={`grid gap-4 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`bg-gray-200 rounded-xl ${isMobile ? "h-24" : "h-32"}`}></div>
                ))}
              </div>

              {/* Charts loading */}
              <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
                <div className={`bg-gray-200 rounded-xl ${isMobile ? "h-48" : "h-80"}`}></div>
                <div className={`bg-gray-200 rounded-xl ${isMobile ? "h-48" : "h-80"}`}></div>
              </div>
            </div>
          </div>
        </div>
        {isMobile && <MobileNavigation activePath="/analytics" />}
      </div>
    )
  }

  // No forms state
  if (forms.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {!isMobile && <Sidebar />}
        <div className="flex-1 pb-16 md:pb-0">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h2 className={`font-bold text-gray-800 mb-2 ${isMobile ? "text-xl" : "text-2xl"}`}>No Analytics Yet</h2>
              <p className={`text-gray-600 mb-6 ${isMobile ? "text-sm" : "text-base"}`}>
                Create your first form to start collecting data and see analytics here.
              </p>
              <Link
                to="/builder/new"
                className={`inline-flex items-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isMobile ? "px-4 py-2 text-sm" : "px-6 py-3"
                }`}
              >
                Create Your First Form
              </Link>
            </div>
          </div>
        </div>
        {isMobile && <MobileNavigation activePath="/analytics" />}
      </div>
    )
  }

  // Colors for charts
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"]

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isMobile && <Sidebar />}
      <div className="flex-1 pb-16 md:pb-0">
        <div className="p-4 md:p-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
                  <p className="text-sm text-gray-600">Track your form performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportAnalytics}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Export Data"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              </div>

              {/* Mobile Date Range Selector */}
              <div className="relative mb-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Track your form performance and user engagement</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                <button
                  onClick={exportAnalytics}
                  className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          )}

          {/* Stats cards - Mobile optimized */}
          <div className={`grid gap-4 mb-6 ${isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}>Total Forms</p>
                  <h3 className={`font-bold text-gray-800 mt-1 ${isMobile ? "text-lg" : "text-2xl"}`}>
                    {totalStats.totalForms}
                  </h3>
                </div>
                <div className={`bg-blue-100 rounded-lg flex-shrink-0 ${isMobile ? "p-1.5" : "p-2"}`}>
                  <FileText className={`text-blue-600 ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                </div>
              </div>
              <div className={`flex items-center ${isMobile ? "mt-2" : "mt-4"}`}>
                <div className={`font-medium text-green-600 flex items-center ${isMobile ? "text-xs" : "text-xs"}`}>
                  <ArrowUpRight className={`mr-1 ${isMobile ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
                  {totalStats.totalForms > 0 ? Math.round((totalStats.activeForms / totalStats.totalForms) * 100) : 0}%
                </div>
                <span className={`text-gray-500 ml-2 ${isMobile ? "text-xs" : "text-xs"}`}>Active</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}>Responses</p>
                  <h3 className={`font-bold text-gray-800 mt-1 ${isMobile ? "text-lg" : "text-2xl"}`}>
                    {totalStats.totalResponses}
                  </h3>
                </div>
                <div className={`bg-green-100 rounded-lg flex-shrink-0 ${isMobile ? "p-1.5" : "p-2"}`}>
                  <CheckCircle className={`text-green-600 ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                </div>
              </div>
              <div className={`flex items-center ${isMobile ? "mt-2" : "mt-4"}`}>
                <div className={`font-medium text-green-600 flex items-center ${isMobile ? "text-xs" : "text-xs"}`}>
                  <TrendingUp className={`mr-1 ${isMobile ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
                  {responseData.slice(-7).reduce((sum, day) => sum + day.responses, 0)}
                </div>
                <span className={`text-gray-500 ml-2 ${isMobile ? "text-xs" : "text-xs"}`}>7 days</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}>Views</p>
                  <h3 className={`font-bold text-gray-800 mt-1 ${isMobile ? "text-lg" : "text-2xl"}`}>
                    {totalStats.totalViews}
                  </h3>
                </div>
                <div className={`bg-amber-100 rounded-lg flex-shrink-0 ${isMobile ? "p-1.5" : "p-2"}`}>
                  <Eye className={`text-amber-600 ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                </div>
              </div>
              <div className={`flex items-center ${isMobile ? "mt-2" : "mt-4"}`}>
                <div className={`font-medium text-green-600 flex items-center ${isMobile ? "text-xs" : "text-xs"}`}>
                  <ArrowUpRight className={`mr-1 ${isMobile ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
                  {viewsData.slice(-7).reduce((sum, day) => sum + day.views, 0)}
                </div>
                <span className={`text-gray-500 ml-2 ${isMobile ? "text-xs" : "text-xs"}`}>7 days</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}>Conversion</p>
                  <h3 className={`font-bold text-gray-800 mt-1 ${isMobile ? "text-lg" : "text-2xl"}`}>
                    {conversionData?.rate || 0}%
                  </h3>
                </div>
                <div className={`bg-purple-100 rounded-lg flex-shrink-0 ${isMobile ? "p-1.5" : "p-2"}`}>
                  <Users className={`text-purple-600 ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                </div>
              </div>
              <div className={`flex items-center ${isMobile ? "mt-2" : "mt-4"}`}>
                <div className={`font-medium text-green-600 flex items-center ${isMobile ? "text-xs" : "text-xs"}`}>
                  <ArrowUpRight className={`mr-1 ${isMobile ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
                  {conversionData?.responses || 0}
                </div>
                <span className={`text-gray-500 ml-2 ${isMobile ? "text-xs" : "text-xs"} truncate`}>
                  from {conversionData?.views || 0}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Charts - Mobile optimized */}
          <div className={`grid gap-4 mb-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
            {/* Responses over time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
            >
              <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? "text-base" : "text-lg"}`}>
                Responses Over Time
              </h3>
              <div className={isMobile ? "h-48" : "h-64"}>
                {responseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={responseData}>
                      <defs>
                        <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="formattedDate"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        interval={isMobile ? "preserveStartEnd" : 0}
                      />
                      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} tickMargin={8} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="responses"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorResponses)"
                        name="Responses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Clock className={`mx-auto mb-2 text-gray-300 ${isMobile ? "w-8 h-8" : "w-12 h-12"}`} />
                      <p className={isMobile ? "text-sm" : "text-base"}>No response data available</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Hourly activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
            >
              <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? "text-base" : "text-lg"}`}>
                Today's Activity
              </h3>
              <div className={isMobile ? "h-48" : "h-64"}>
                {hourlyData.some((d) => d.responses > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="hour"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        interval={isMobile ? 3 : 2}
                      />
                      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} tickMargin={8} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="responses" fill="#10B981" radius={[4, 4, 0, 0]} name="Responses" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Clock className={`mx-auto mb-2 text-gray-300 ${isMobile ? "w-8 h-8" : "w-12 h-12"}`} />
                      <p className={isMobile ? "text-sm" : "text-base"}>No activity today</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Views vs Responses and Device breakdown - Mobile stacked */}
          <div className={`grid gap-4 mb-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6 lg:col-span-2"}`}
            >
              <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? "text-base" : "text-lg"}`}>
                Views vs Responses
              </h3>
              <div className={isMobile ? "h-48" : "h-64"}>
                {viewsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="formattedDate"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        interval={isMobile ? "preserveStartEnd" : 0}
                      />
                      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} tickMargin={8} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ r: isMobile ? 2 : 4 }}
                        name="Views"
                      />
                      <Line
                        type="monotone"
                        dataKey="responses"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: isMobile ? 2 : 4 }}
                        name="Responses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <BarChart3 className={`mx-auto mb-2 text-gray-300 ${isMobile ? "w-8 h-8" : "w-12 h-12"}`} />
                      <p className={isMobile ? "text-sm" : "text-base"}>No data available</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Device breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
            >
              <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? "text-base" : "text-lg"}`}>
                Device Breakdown
              </h3>
              <div className={`flex items-center justify-center ${isMobile ? "h-48" : "h-64"}`}>
                {deviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 25 : 40}
                        outerRadius={isMobile ? 50 : 80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        labelLine={false}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500">
                    <Clock className={`mx-auto mb-2 text-gray-300 ${isMobile ? "w-8 h-8" : "w-12 h-12"}`} />
                    <p className={isMobile ? "text-sm" : "text-base"}>No device data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Top performing forms - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? "p-4" : "p-6"}`}
          >
            <h3 className={`font-semibold text-gray-800 mb-4 ${isMobile ? "text-base" : "text-lg"}`}>
              Top Performing Forms
            </h3>

            {isMobile ? (
              // Mobile card layout
              <div className="space-y-3">
                {topForms.length > 0 ? (
                  topForms.slice(0, 5).map((form) => (
                    <div key={form.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          to={`/form-builder/${form.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm truncate flex-1 mr-2"
                        >
                          {form.title}
                        </Link>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            form.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {form.status || "draft"}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium text-gray-900">{form.responses}</span>
                          <div>Responses</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{form.views}</span>
                          <div>Views</div>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              form.conversionRate > 10
                                ? "bg-green-100 text-green-800"
                                : form.conversionRate > 5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {form.conversionRate}%
                          </span>
                          <div>Conversion</div>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <Link
                          to={`/form-responses/${form.id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          View Responses →
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No form data available</p>
                  </div>
                )}

                {topForms.length > 5 && (
                  <div className="text-center pt-2">
                    <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
                      View all forms →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // Desktop table layout
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-2">Form</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Total Responses</th>
                      <th className="px-4 py-2">Period Responses</th>
                      <th className="px-4 py-2">Views</th>
                      <th className="px-4 py-2">Conversion</th>
                      <th className="px-4 py-2">Last Response</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topForms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link
                            to={`/form-builder/${form.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {form.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              form.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {form.status || "draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{form.responses}</td>
                        <td className="px-4 py-3 text-gray-600">{form.responsesInRange}</td>
                        <td className="px-4 py-3">{form.views}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              form.conversionRate > 10
                                ? "bg-green-100 text-green-800"
                                : form.conversionRate > 5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {form.conversionRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {form.lastResponse ? format(form.lastResponse, "MMM d, yyyy") : "No responses"}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/form-responses/${form.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Responses
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {topForms.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <FileText className="w-12 h-12 text-gray-300 mb-2" />
                            <p>No form data available</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {topForms.length > 0 && (
                  <div className="mt-4 text-right">
                    <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
                      View all forms →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {isMobile && <MobileNavigation activePath="/analytics" />}
    </div>
  )
}

export default Analytics
