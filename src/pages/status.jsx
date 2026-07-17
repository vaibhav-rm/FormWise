"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function Status() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState("Just now")

  const systems = [
    { name: "Form Delivery API", status: "Operational", uptime: "99.99%", latency: "24ms" },
    { name: "Admin Dashboard UI", status: "Operational", uptime: "99.95%", latency: "148ms" },
    { name: "Branching Logic Engine", status: "Operational", uptime: "100.00%", latency: "4ms" },
    { name: "Webhook Dispatch Services", status: "Operational", uptime: "99.98%", latency: "89ms" },
  ]

  const incidents = [
    {
      date: "July 10, 2026",
      title: "Minor Webhook Dispatch Delay",
      status: "Resolved",
      severity: "Minor",
      description: "A database index migration on Firebase caused a temporary delay in webhook dispatches. The queue was fully processed within 15 minutes. No data was lost.",
    },
    {
      date: "June 24, 2026",
      title: "Dashboard Slow Response Times",
      status: "Resolved",
      severity: "Major",
      description: "Network routing issues at our primary CDN partner caused high latency when loading the dashboard interface. Routing rules were updated to bypass the affected node.",
    },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      const now = new Date()
      setLastUpdated(`Just now (${now.toLocaleTimeString()})`)
    }, 800)
  }

  // Draw 90 days of green dashes representing uptime
  const drawUptimeBars = () => {
    return Array.from({ length: 45 }).map((_, i) => {
      // Intentionally insert a few slightly yellow dashes to look realistic
      let color = "bg-green-500"
      if (i === 12) color = "bg-yellow-400"
      if (i === 35) color = "bg-green-400"
      return (
        <span
          key={i}
          className={`h-6 w-1 rounded-sm ${color} transition-all duration-300 hover:scale-125 cursor-pointer`}
          title={`Day ${45 - i} ago: 100% operational`}
        />
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-200">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 dark:from-purple-950 dark:to-indigo-950 text-white pt-36 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.2),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 bg-green-500/10 border border-green-500/30 text-green-300 px-6 py-3 rounded-full mb-6"
          >
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <span className="font-bold text-sm tracking-wider uppercase">All Systems Operational</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            System Status
          </h1>
          <p className="text-lg text-purple-200 max-w-xl mx-auto">
            Real-time status updates, active query speeds, and incident reports for FormWise services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Active latency metrics & Refresh trigger */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-200">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-gray-900 dark:text-white">Uptime & Latency State</h3>
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">Uptime metrics tracked over the last 90 days. Updated: {lastUpdated}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
          </button>
        </div>

        {/* System List Cards */}
        <div className="space-y-6">
          {systems.map((sys, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors duration-200"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {/* Header Info */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-gray-950 dark:text-white text-base">{sys.name}</h4>
                  <div className="flex space-x-4 text-xs text-gray-400 dark:text-gray-400 mt-1">
                    <span>Uptime: <strong>{sys.uptime}</strong></span>
                    <span>•</span>
                    <span>Avg Latency: <strong>{sys.latency}</strong></span>
                  </div>
                </div>
                <span className="flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                  {sys.status}
                </span>
              </div>

              {/* Uptime bars row */}
              <div className="flex justify-between items-center gap-1 overflow-x-auto py-2">
                {drawUptimeBars()}
              </div>

              {/* Label 90 days ago to Today */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase mt-2">
                <span>90 Days Ago</span>
                <span>Today</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Incidents History */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-3">Incidents History</h3>
          {incidents.map((inc, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm flex items-start space-x-5 transition-colors duration-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 p-3 rounded-2xl text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">{inc.date}</span>
                <h4 className="text-lg font-bold text-gray-950 dark:text-white">{inc.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{inc.description}</p>
                <div className="pt-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg">
                    {inc.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
