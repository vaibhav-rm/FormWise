"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Clock, Target, Download, RefreshCw } from "lucide-react"

export default function AdvancedAnalyticsWidget({ analytics, forms }) {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("responses")

  const metrics = [
    {
      id: "responses",
      label: "Responses",
      value: analytics?.responsesLast30Days || 0,
      change: analytics?.responsesChange || 0,
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: `${analytics?.conversionRate || 0}%`,
      change: analytics?.viewsChange || 0,
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: "engagement",
      label: "Avg. Time",
      value: analytics?.avgResponseTime || "0 min",
      change: 5.2,
      icon: <Clock className="w-4 h-4" />,
    },
  ]

  const topForms = [...(forms || [])].sort((a, b) => (b.responseCount || 0) - (a.responseCount || 0)).slice(0, 5)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Performance Analytics</h2>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMetric === metric.id ? "border-purple-200 bg-purple-50" : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedMetric(metric.id)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-purple-600">{metric.icon}</div>
              <span className={`text-xs font-medium ${metric.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {metric.change >= 0 ? "+" : ""}
                {metric.change}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Top Performing Forms */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Forms</h3>
        <div className="space-y-3">
          {topForms.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No forms available</p>
          ) : (
            topForms.map((form, index) => (
              <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{form.title}</h4>
                    <p className="text-sm text-gray-500">{form.responseCount || 0} responses</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {form.views > 0 ? Math.round(((form.responseCount || 0) / form.views) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">conversion</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
        <button className="text-sm text-gray-600 hover:text-gray-700">View Detailed Analytics →</button>
      </div>
    </div>
  )
}
