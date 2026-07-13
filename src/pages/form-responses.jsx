"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  Flag,
  MoreHorizontal,
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  X,
  TrendingUp,
} from "lucide-react"
import { useFormResponses, useForms } from "../hooks/use-forms"
import Sidebar from "../components/sidebar"

const FormResponses = () => {
  const { formId } = useParams()
  const { responses, loading: loadingResponses, deleteResponse } = useFormResponses(formId)
  const { getForm } = useForms()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "submittedAt", direction: "desc" })
  const [selectedResponses, setSelectedResponses] = useState([])
  const [filterConfig, setFilterConfig] = useState({
    status: "all",
    dateRange: "all",
    device: "all",
    flagged: "all",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [starredResponses, setStarredResponses] = useState([])
  const [flaggedResponses, setFlaggedResponses] = useState([])
  const [notesResponses, setNotesResponses] = useState({})
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [viewMode, setViewMode] = useState("table") // table, cards, analytics
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formData = await getForm(formId)
        if (formData) {
          setForm(formData)
        }
      } catch (error) {
        console.error("Error fetching form:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [formId, getForm])

  useEffect(() => {
    // Load starred responses from localStorage
    const savedStarred = localStorage.getItem(`starred-responses-${formId}`)
    if (savedStarred) {
      setStarredResponses(JSON.parse(savedStarred))
    }

    // Load flagged responses from localStorage
    const savedFlagged = localStorage.getItem(`flagged-responses-${formId}`)
    if (savedFlagged) {
      setFlaggedResponses(JSON.parse(savedFlagged))
    }

    // Load notes from localStorage
    const savedNotes = localStorage.getItem(`notes-responses-${formId}`)
    if (savedNotes) {
      setNotesResponses(JSON.parse(savedNotes))
    }
  }, [formId])

  const saveStarredResponses = (newStarred) => {
    localStorage.setItem(`starred-responses-${formId}`, JSON.stringify(newStarred))
    setStarredResponses(newStarred)
  }

  const saveFlaggedResponses = (newFlagged) => {
    localStorage.setItem(`flagged-responses-${formId}`, JSON.stringify(newFlagged))
    setFlaggedResponses(newFlagged)
  }

  const saveNotesResponses = (newNotes) => {
    localStorage.setItem(`notes-responses-${formId}`, JSON.stringify(newNotes))
    setNotesResponses(newNotes)
  }

  const toggleStarResponse = (responseId) => {
    const newStarred = starredResponses.includes(responseId)
      ? starredResponses.filter((id) => id !== responseId)
      : [...starredResponses, responseId]

    saveStarredResponses(newStarred)
  }

  const toggleFlagResponse = (responseId) => {
    const newFlagged = flaggedResponses.includes(responseId)
      ? flaggedResponses.filter((id) => id !== responseId)
      : [...flaggedResponses, responseId]

    saveFlaggedResponses(newFlagged)
  }

  const addNoteToResponse = (responseId, note) => {
    const newNotes = { ...notesResponses, [responseId]: note }
    saveNotesResponses(newNotes)
  }

  const getFieldLabel = (fieldId) => {
    if (!form?.fields) return fieldId
    const field = form.fields.find((f) => f.id === fieldId)
    return field?.label || fieldId
  }

  const getDeviceType = (userAgent) => {
    if (!userAgent) return "Unknown"
    if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return "Mobile"
    } else if (/iPad|Tablet/i.test(userAgent)) {
      return "Tablet"
    } else {
      return "Desktop"
    }
  }

  const getDeviceIcon = (device) => {
    switch (device) {
      case "Mobile":
        return <Smartphone className="w-4 h-4" />
      case "Tablet":
        return <Tablet className="w-4 h-4" />
      case "Desktop":
        return <Monitor className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedResponses.length} responses?`)) {
      try {
        await Promise.all(selectedResponses.map((id) => deleteResponse(id)))
        setSelectedResponses([])
        setShowBulkActions(false)
      } catch (error) {
        console.error("Error deleting responses:", error)
      }
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedResponses(filteredResponses.map((response) => response.id))
    } else {
      setSelectedResponses([])
    }
  }

  const handleSelectResponse = (id) => {
    if (selectedResponses.includes(id)) {
      setSelectedResponses(selectedResponses.filter((responseId) => responseId !== id))
    } else {
      setSelectedResponses([...selectedResponses, id])
    }
  }

  const exportToCSV = () => {
    if (!responses.length) return

    // Get all unique field keys from all responses
    const allFields = new Set()
    responses.forEach((response) => {
      Object.keys(response.responses).forEach((key) => allFields.add(key))
    })

    const fields = Array.from(allFields)

    // Create CSV header with field labels
    let csv =
      ["Response ID", "Submitted At", "Device", "Starred", "Flagged", "Notes", ...fields.map(getFieldLabel)].join(",") +
      "\n"

    // Add data rows
    responses.forEach((response) => {
      const device = getDeviceType(response.userAgent)
      const isStarred = starredResponses.includes(response.id) ? "Yes" : "No"
      const isFlagged = flaggedResponses.includes(response.id) ? "Yes" : "No"
      const notes = notesResponses[response.id] || ""

      const row = [
        response.id,
        response.submittedAt ? format(response.submittedAt, "yyyy-MM-dd HH:mm:ss") : "N/A",
        device,
        isStarred,
        isFlagged,
        `"${notes.replace(/"/g, '""')}"`,
        ...fields.map((field) => {
          const value = response.responses[field] || ""
          return `"${String(value).replace(/"/g, '""')}"`
        }),
      ]
      csv += row.join(",") + "\n"
    })

    // Create and download the CSV file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${form?.title || "form"}-responses.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter and sort responses
  const filteredResponses = responses
    .filter((response) => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const values = Object.values(response.responses)
        const matchesContent = values.some((value) => String(value).toLowerCase().includes(searchLower))
        const matchesId = response.id.toLowerCase().includes(searchLower)
        if (!matchesContent && !matchesId) return false
      }

      // Apply starred filter
      if (filterConfig.status === "starred" && !starredResponses.includes(response.id)) {
        return false
      }

      // Apply flagged filter
      if (filterConfig.flagged === "flagged" && !flaggedResponses.includes(response.id)) {
        return false
      } else if (filterConfig.flagged === "unflagged" && flaggedResponses.includes(response.id)) {
        return false
      }

      // Apply device filter
      if (filterConfig.device !== "all") {
        const device = getDeviceType(response.userAgent)
        if (device.toLowerCase() !== filterConfig.device.toLowerCase()) return false
      }

      return true
    })
    .sort((a, b) => {
      const key = sortConfig.key

      if (key === "submittedAt") {
        const aTime = a.submittedAt ? a.submittedAt.getTime() : 0
        const bTime = b.submittedAt ? b.submittedAt.getTime() : 0
        return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime
      }

      // For response fields
      const aValue = a.responses[key] || ""
      const bValue = b.responses[key] || ""

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredResponses.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedResponses = filteredResponses.slice(startIndex, endIndex)

  // Analytics calculations
  const analytics = {
    total: responses.length,
    today: responses.filter((r) => r.submittedAt && format(r.submittedAt, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")).length,
    starred: starredResponses.length,
    flagged: flaggedResponses.length,
    devices: {
      mobile: responses.filter((r) => getDeviceType(r.userAgent) === "Mobile").length,
      desktop: responses.filter((r) => getDeviceType(r.userAgent) === "Desktop").length,
      tablet: responses.filter((r) => getDeviceType(r.userAgent) === "Tablet").length,
    },
  }

  if (loading || loadingResponses) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Form Not Found</h1>
            <p className="text-gray-600 mb-6">
              The form you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get the most common fields from responses to show as columns
  const fieldFrequency = {}
  responses.forEach((response) => {
    Object.keys(response.responses).forEach((key) => {
      fieldFrequency[key] = (fieldFrequency[key] || 0) + 1
    })
  })

  // Sort fields by frequency and take top 5
  const topFields = Object.entries(fieldFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => key)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 w-full md:w-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="mb-6">
            <Link
              to={`/builder/${formId}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Form
            </Link>
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">{form.title} Responses</h1>
                <p className="text-gray-600 mt-1">
                  {responses.length} {responses.length === 1 ? "response" : "responses"} received
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/form/${formId}`}
                  target="_blank"
                  className="inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Form
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`)
                    alert("Form link copied to clipboard!")
                  }}
                  className="inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </button>
                <button
                  onClick={exportToCSV}
                  disabled={!responses.length}
                  className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-1.5 md:p-2 rounded-lg">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-900">{analytics.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-1.5 md:p-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm font-medium text-gray-500">Today</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-900">{analytics.today}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-1.5 md:p-2 rounded-lg">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm font-medium text-gray-500">Starred</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-900">{analytics.starred}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
              <div className="flex items-center">
                <div className="bg-red-100 p-1.5 md:p-2 rounded-lg">
                  <Flag className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm font-medium text-gray-500">Flagged</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-900">{analytics.flagged}</p>
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center space-x-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode("table")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === "cards"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("analytics")}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === "analytics"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Analytics
              </button>
            </div>

            {selectedResponses.length > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Actions ({selectedResponses.length})
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 md:p-4 border-b border-gray-200">
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search responses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                  </button>

                  {selectedResponses.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete ({selectedResponses.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Filters panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filterConfig.status}
                          onChange={(e) => setFilterConfig({ ...filterConfig, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Responses</option>
                          <option value="starred">Starred Only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Flagged</label>
                        <select
                          value={filterConfig.flagged}
                          onChange={(e) => setFilterConfig({ ...filterConfig, flagged: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All</option>
                          <option value="flagged">Flagged Only</option>
                          <option value="unflagged">Not Flagged</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                        <select
                          value={filterConfig.device}
                          onChange={(e) => setFilterConfig({ ...filterConfig, device: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Devices</option>
                          <option value="desktop">Desktop</option>
                          <option value="mobile">Mobile</option>
                          <option value="tablet">Tablet</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                        <select
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number.parseInt(e.target.value))
                            setCurrentPage(1)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="10">10 per page</option>
                          <option value="25">25 per page</option>
                          <option value="50">50 per page</option>
                          <option value="100">100 per page</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bulk Actions Panel */}
            <AnimatePresence>
              {showBulkActions && selectedResponses.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-blue-50 border-b border-blue-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedResponses.length} responses selected
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            selectedResponses.forEach((id) => toggleStarResponse(id))
                            setSelectedResponses([])
                          }}
                          className="inline-flex items-center px-3 py-1 bg-white border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Star All
                        </button>
                        <button
                          onClick={() => {
                            selectedResponses.forEach((id) => toggleFlagResponse(id))
                            setSelectedResponses([])
                          }}
                          className="inline-flex items-center px-3 py-1 bg-white border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50"
                        >
                          <Flag className="w-4 h-4 mr-1" />
                          Flag All
                        </button>
                        <button
                          onClick={handleDeleteSelected}
                          className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete All
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedResponses([])
                        setShowBulkActions(false)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Table View - Mobile Optimized */}
            {viewMode === "table" && (
              <>
                {responses.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No responses yet</h3>
                    <p className="text-gray-500 mb-4">Share your form to start collecting responses</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`)
                        alert("Form link copied to clipboard!")
                      }}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Form Link
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="w-8 px-2 md:px-4 py-3 text-left">
                              <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                  selectedResponses.length === paginatedResponses.length &&
                                  paginatedResponses.length > 0
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </th>
                            <th className="w-8 px-1 md:px-2 py-3 text-left"></th>
                            <th className="w-8 px-1 md:px-2 py-3 text-left"></th>
                            <th
                              className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer min-w-[120px]"
                              onClick={() => handleSort("submittedAt")}
                            >
                              <div className="flex items-center">
                                Submitted
                                {sortConfig.key === "submittedAt" &&
                                  (sortConfig.direction === "asc" ? (
                                    <ChevronUp className="w-4 h-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                  ))}
                              </div>
                            </th>

                            <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                              Device
                            </th>

                            {/* Dynamic columns based on form fields */}
                            {topFields.map((field) => (
                              <th
                                key={field}
                                className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer min-w-[150px]"
                                onClick={() => handleSort(field)}
                              >
                                <div className="flex items-center">
                                  <span className="truncate">{getFieldLabel(field)}</span>
                                  {sortConfig.key === field &&
                                    (sortConfig.direction === "asc" ? (
                                      <ChevronUp className="w-4 h-4 ml-1 flex-shrink-0" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 ml-1 flex-shrink-0" />
                                    ))}
                                </div>
                              </th>
                            ))}

                            <th className="px-2 md:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paginatedResponses.map((response) => (
                            <tr
                              key={response.id}
                              className={`hover:bg-gray-50 ${selectedResponses.includes(response.id) ? "bg-blue-50" : ""}`}
                            >
                              <td className="px-2 md:px-4 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedResponses.includes(response.id)}
                                  onChange={() => handleSelectResponse(response.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-1 md:px-2 py-4">
                                <button
                                  onClick={() => toggleStarResponse(response.id)}
                                  className="text-gray-400 hover:text-yellow-500"
                                >
                                  {starredResponses.includes(response.id) ? (
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  ) : (
                                    <StarOff className="w-5 h-5" />
                                  )}
                                </button>
                              </td>
                              <td className="px-1 md:px-2 py-4">
                                <button
                                  onClick={() => toggleFlagResponse(response.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  {flaggedResponses.includes(response.id) ? (
                                    <Flag className="w-5 h-5 fill-red-400 text-red-400" />
                                  ) : (
                                    <Flag className="w-5 h-5" />
                                  )}
                                </button>
                              </td>
                              <td className="px-2 md:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  <div>{format(response.submittedAt, "MMM d, yyyy")}</div>
                                  <div className="text-xs text-gray-400">{format(response.submittedAt, "h:mm a")}</div>
                                </div>
                              </td>
                              <td className="px-2 md:px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  {getDeviceIcon(getDeviceType(response.userAgent))}
                                  <span className="ml-2">{getDeviceType(response.userAgent)}</span>
                                </div>
                              </td>

                              {/* Dynamic data cells */}
                              {topFields.map((field) => (
                                <td key={field} className="px-2 md:px-4 py-4 text-sm text-gray-900 max-w-xs">
                                  <div className="truncate" title={response.responses[field] || "-"}>
                                    {response.responses[field] || "-"}
                                  </div>
                                </td>
                              ))}

                              <td className="px-2 md:px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setSelectedResponse(response)
                                      setShowResponseModal(true)
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const note = prompt(
                                        "Add a note to this response:",
                                        notesResponses[response.id] || "",
                                      )
                                      if (note !== null) {
                                        addNoteToResponse(response.id, note)
                                      }
                                    }}
                                    className="text-green-600 hover:text-green-900"
                                    title="Add Note"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm("Are you sure you want to delete this response?")) {
                                        deleteResponse(response.id)
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Card View - Mobile Optimized */}
            {viewMode === "cards" && (
              <div className="p-3 md:p-6">
                {responses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No responses yet</h3>
                    <p className="text-gray-500 mb-4">Share your form to start collecting responses</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {paginatedResponses.map((response) => (
                      <motion.div
                        key={response.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleStarResponse(response.id)}
                              className="text-gray-400 hover:text-yellow-500"
                            >
                              {starredResponses.includes(response.id) ? (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => toggleFlagResponse(response.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              {flaggedResponses.includes(response.id) ? (
                                <Flag className="w-4 h-4 fill-red-400 text-red-400" />
                              ) : (
                                <Flag className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            {getDeviceIcon(getDeviceType(response.userAgent))}
                            <span className="ml-1">{getDeviceType(response.userAgent)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {Object.entries(response.responses)
                            .slice(0, 3)
                            .map(([fieldId, value]) => (
                              <div key={fieldId}>
                                <p className="text-xs font-medium text-gray-500">{getFieldLabel(fieldId)}</p>
                                <p className="text-sm text-gray-900 truncate">{value || "-"}</p>
                              </div>
                            ))}
                          {Object.keys(response.responses).length > 3 && (
                            <p className="text-xs text-gray-400">
                              +{Object.keys(response.responses).length - 3} more fields
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{format(response.submittedAt, "MMM d, yyyy h:mm a")}</span>
                          <span className="text-gray-400">#{response.id.slice(-6)}</span>
                        </div>

                        {notesResponses[response.id] && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                            <p className="text-xs text-yellow-800">{notesResponses[response.id]}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <input
                            type="checkbox"
                            checked={selectedResponses.includes(response.id)}
                            onChange={() => handleSelectResponse(response.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedResponse(response)
                                setShowResponseModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const note = prompt("Add a note to this response:", notesResponses[response.id] || "")
                                if (note !== null) {
                                  addNoteToResponse(response.id, note)
                                }
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Add Note"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this response?")) {
                                  deleteResponse(response.id)
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics View */}
            {viewMode === "analytics" && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Device Distribution */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Monitor className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-sm text-gray-700">Desktop</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{analytics.devices.desktop}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${analytics.total > 0 ? (analytics.devices.desktop / analytics.total) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Smartphone className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-sm text-gray-700">Mobile</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{analytics.devices.mobile}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${analytics.total > 0 ? (analytics.devices.mobile / analytics.total) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tablet className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-sm text-gray-700">Tablet</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{analytics.devices.tablet}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${analytics.total > 0 ? (analytics.devices.tablet / analytics.total) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Status */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Response Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-gray-700">Starred</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{analytics.starred}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Flag className="w-4 h-4 text-red-600 mr-2" />
                          <span className="text-sm text-gray-700">Flagged</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{analytics.flagged}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm text-gray-700">With Notes</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(notesResponses).filter((id) => notesResponses[id]).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Field Completion */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Field Completion</h3>
                    <div className="space-y-3">
                      {topFields.slice(0, 5).map((fieldId) => {
                        const completionRate =
                          responses.length > 0
                            ? (responses.filter((r) => r.responses[fieldId] && r.responses[fieldId] !== "").length /
                                responses.length) *
                              100
                            : 0

                        return (
                          <div key={fieldId} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700 truncate">{getFieldLabel(fieldId)}</span>
                              <span className="text-sm font-medium text-gray-900">{completionRate.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {responses.length > 0 && viewMode !== "analytics" && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(endIndex, filteredResponses.length)}</span> of{" "}
                      <span className="font-medium">{filteredResponses.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Response Detail Modal */}
        <AnimatePresence>
          {showResponseModal && selectedResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowResponseModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Response Details</h3>
                  <button onClick={() => setShowResponseModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Submitted: {format(selectedResponse.submittedAt, "MMMM d, yyyy 'at' h:mm a")}</span>
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(getDeviceType(selectedResponse.userAgent))}
                        <span>{getDeviceType(selectedResponse.userAgent)}</span>
                      </div>
                    </div>

                    {Object.entries(selectedResponse.responses).map(([fieldId, value]) => (
                      <div key={fieldId} className="border-b border-gray-100 pb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">{getFieldLabel(fieldId)}</p>
                        <p className="text-gray-900">{value || "-"}</p>
                      </div>
                    ))}

                    {notesResponses[selectedResponse.id] && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Notes</p>
                        <p className="text-yellow-700">{notesResponses[selectedResponse.id]}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStarResponse(selectedResponse.id)}
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                        starredResponses.includes(selectedResponse.id)
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Star className="w-4 h-4 mr-1" />
                      {starredResponses.includes(selectedResponse.id) ? "Starred" : "Star"}
                    </button>
                    <button
                      onClick={() => toggleFlagResponse(selectedResponse.id)}
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                        flaggedResponses.includes(selectedResponse.id)
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      {flaggedResponses.includes(selectedResponse.id) ? "Flagged" : "Flag"}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const note = prompt("Add a note to this response:", notesResponses[selectedResponse.id] || "")
                        if (note !== null) {
                          addNoteToResponse(selectedResponse.id, note)
                        }
                      }}
                      className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Add Note
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this response?")) {
                          deleteResponse(selectedResponse.id)
                          setShowResponseModal(false)
                        }
                      }}
                      className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FormResponses
