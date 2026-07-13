"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Menu,
  X,
  Search,
  RefreshCw,
  File,
  Database,
  Clock,
  Users,
  BarChart3,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

export default function Import() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [importHistory, setImportHistory] = useState([
    {
      id: "1",
      fileName: "google_forms_export.json",
      source: "Google Forms",
      status: "completed",
      formsImported: 5,
      responsesImported: 247,
      importedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      fileName: "typeform_backup.csv",
      source: "Typeform",
      status: "completed",
      formsImported: 3,
      responsesImported: 156,
      importedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      fileSize: "1.8 MB",
    },
    {
      id: "3",
      fileName: "survey_monkey_data.xlsx",
      source: "SurveyMonkey",
      status: "failed",
      formsImported: 0,
      responsesImported: 0,
      importedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      fileSize: "5.2 MB",
      error: "Invalid file format",
    },
    {
      id: "4",
      fileName: "jotform_export.json",
      source: "JotForm",
      status: "processing",
      formsImported: 2,
      responsesImported: 89,
      importedAt: new Date(Date.now() - 10 * 60 * 1000),
      fileSize: "3.1 MB",
    },
  ])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedImport, setSelectedImport] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const supportedSources = [
    {
      id: "google-forms",
      name: "Google Forms",
      icon: "📝",
      description: "Import forms and responses from Google Forms",
      formats: [".json", ".csv"],
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "typeform",
      name: "Typeform",
      icon: "📋",
      description: "Import Typeform surveys and responses",
      formats: [".json", ".csv"],
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "surveymonkey",
      name: "SurveyMonkey",
      icon: "🐵",
      description: "Import SurveyMonkey surveys and data",
      formats: [".xlsx", ".csv"],
      color: "from-green-500 to-green-600",
    },
    {
      id: "jotform",
      name: "JotForm",
      icon: "📄",
      description: "Import JotForm forms and submissions",
      formats: [".json", ".csv"],
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "microsoft-forms",
      name: "Microsoft Forms",
      icon: "📊",
      description: "Import Microsoft Forms and responses",
      formats: [".xlsx", ".csv"],
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: "custom",
      name: "Custom CSV",
      icon: "📈",
      description: "Import custom CSV files with field mapping",
      formats: [".csv"],
      color: "from-gray-500 to-gray-600",
    },
  ]

  const filteredImports = importHistory.filter((importItem) => {
    const matchesSearch =
      importItem.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      importItem.source.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || importItem.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // Add to import history
          const newImport = {
            id: Date.now().toString(),
            fileName: file.name,
            source: "Unknown",
            status: "processing",
            formsImported: 0,
            responsesImported: 0,
            importedAt: new Date(),
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          }
          setImportHistory([newImport, ...importHistory])
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDeleteImport = (importId) => {
    if (window.confirm("Are you sure you want to delete this import?")) {
      setImportHistory(importHistory.filter((item) => item.id !== importId))
    }
  }

  const handleRetryImport = (importId) => {
    setImportHistory(importHistory.map((item) => (item.id === importId ? { ...item, status: "processing" } : item)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case "failed":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 lg:p-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
              <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Import</h1>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Import Forms</h1>
                <p className="text-gray-600 mt-1">Import forms and responses from other platforms</p>
              </div>

              <div className="flex items-center space-x-4">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Template
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import File
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Imports</p>
                  <p className="text-2xl font-bold text-gray-900">{importHistory.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Forms Imported</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {importHistory.reduce((sum, item) => sum + item.formsImported, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Responses Imported</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {importHistory.reduce((sum, item) => sum + item.responsesImported, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {importHistory.length > 0
                      ? Math.round(
                          (importHistory.filter((item) => item.status === "completed").length / importHistory.length) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive ? "border-purple-400 bg-purple-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".json,.csv,.xlsx"
                onChange={handleFileSelect}
              />

              {isUploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading...</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to upload</h3>
                    <p className="text-gray-600 mb-4">
                      Support for JSON, CSV, and Excel files from popular form platforms
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Supported Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Supported Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportedSources.map((source) => (
                <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${source.color} rounded-lg flex items-center justify-center text-white text-lg`}
                    >
                      {source.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{source.name}</h3>
                      <div className="flex space-x-1">
                        {source.formats.map((format) => (
                          <span key={format} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{source.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Import History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Import History</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search imports..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredImports.map((importItem) => (
                <motion.div
                  key={importItem.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <File className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">{importItem.fileName}</h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(importItem.status)}`}
                        >
                          {getStatusIcon(importItem.status)}
                          <span className="ml-1 capitalize">{importItem.status}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Database className="w-4 h-4 mr-1" />
                          {importItem.source}
                        </span>
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {importItem.formsImported} forms
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {importItem.responsesImported} responses
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeAgo(importItem.importedAt)}
                        </span>
                        <span>{importItem.fileSize}</span>
                      </div>

                      {importItem.error && (
                        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          {importItem.error}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {importItem.status === "completed" && (
                        <button
                          onClick={() => {
                            setSelectedImport(importItem)
                            setShowPreviewModal(true)
                          }}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {importItem.status === "failed" && (
                        <button
                          onClick={() => handleRetryImport(importItem.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Retry"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImport(importItem.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredImports.length === 0 && (
                <div className="text-center py-12">
                  <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No imports found</h3>
                  <p className="text-gray-600 mb-6">
                    {importHistory.length === 0
                      ? "Start by importing your first form"
                      : "Try adjusting your search criteria"}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <Upload className="w-4 h-4 mr-2 inline" />
                    Import Forms
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedImport && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Import Preview</h2>
                    <p className="text-sm text-gray-600">{selectedImport.fileName}</p>
                  </div>
                  <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Import Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium">{selectedImport.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Forms:</span>
                        <span className="font-medium">{selectedImport.formsImported}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Responses:</span>
                        <span className="font-medium">{selectedImport.responsesImported}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="font-medium">{selectedImport.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Import Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium ${selectedImport.status === "completed" ? "text-green-600" : "text-red-600"}`}
                        >
                          {selectedImport.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Imported:</span>
                        <span className="font-medium">{selectedImport.importedAt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Imported Forms</h3>
                  <div className="space-y-3">
                    {/* Mock imported forms */}
                    {Array.from({ length: selectedImport.formsImported }, (_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">Form {i + 1}</h4>
                            <p className="text-sm text-gray-600">{Math.floor(Math.random() * 100) + 10} responses</p>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">View Form</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && <MobileNavigation activePath="/import" />}
    </div>
  )
}
