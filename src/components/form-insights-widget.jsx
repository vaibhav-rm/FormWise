"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, AlertTriangle, CheckCircle, Clock, MessageSquare } from "lucide-react"

export default function FormInsightsWidget({ forms }) {
  const [selectedInsight, setSelectedInsight] = useState("performance")

  // Generate insights based on form data
  const generateInsights = () => {
    if (!forms || forms.length === 0) return []

    const insights = []

    // High performing forms
    const highPerformers = forms.filter((form) => (form.responseCount || 0) > 10)
    if (highPerformers.length > 0) {
      insights.push({
        type: "success",
        icon: <TrendingUp className="w-4 h-4" />,
        title: "High Performing Forms",
        message: `${highPerformers.length} forms have excellent response rates`,
        action: "View top performers",
        priority: "high",
      })
    }

    // Low conversion forms
    const lowConversion = forms.filter((form) => form.views > 50 && (form.responseCount || 0) / form.views < 0.1)
    if (lowConversion.length > 0) {
      insights.push({
        type: "warning",
        icon: <AlertTriangle className="w-4 h-4" />,
        title: "Low Conversion Alert",
        message: `${lowConversion.length} forms need optimization`,
        action: "Optimize forms",
        priority: "high",
      })
    }

    // Draft forms reminder
    const draftForms = forms.filter((form) => form.status === "draft")
    if (draftForms.length > 0) {
      insights.push({
        type: "info",
        icon: <Clock className="w-4 h-4" />,
        title: "Draft Forms",
        message: `${draftForms.length} forms are ready to publish`,
        action: "Publish forms",
        priority: "medium",
      })
    }

    // Recent activity
    const recentlyActive = forms.filter(
      (form) => form.lastResponseAt && Date.now() - form.lastResponseAt.toDate().getTime() < 24 * 60 * 60 * 1000,
    )
    if (recentlyActive.length > 0) {
      insights.push({
        type: "success",
        icon: <CheckCircle className="w-4 h-4" />,
        title: "Active Forms",
        message: `${recentlyActive.length} forms received responses today`,
        action: "View responses",
        priority: "low",
      })
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const insights = generateInsights()

  const getInsightColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "error":
        return "text-red-600 bg-red-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  const recommendations = [
    {
      title: "Optimize Form Length",
      description: "Forms with 5-7 fields have 23% higher completion rates",
      impact: "High",
      effort: "Low",
    },
    {
      title: "Add Progress Indicators",
      description: "Show users their progress to increase completion rates",
      impact: "Medium",
      effort: "Medium",
    },
    {
      title: "Mobile Optimization",
      description: "60% of responses come from mobile devices",
      impact: "High",
      effort: "High",
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Smart Insights</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedInsight("performance")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedInsight === "performance" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setSelectedInsight("recommendations")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedInsight === "recommendations" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Tips
          </button>
        </div>
      </div>

      {selectedInsight === "performance" ? (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Yet</h3>
              <p className="text-gray-600">Create and publish forms to see performance insights</p>
            </div>
          ) : (
            insights.map((insight, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getInsightColor(insight.type)}`}
                >
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    {insight.action} →
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className="p-4 border border-gray-200 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{rec.title}</h3>
                <div className="flex space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.impact === "High"
                        ? "bg-red-100 text-red-700"
                        : rec.impact === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {rec.impact} Impact
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.effort === "High"
                        ? "bg-red-100 text-red-700"
                        : rec.effort === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {rec.effort} Effort
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{rec.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
