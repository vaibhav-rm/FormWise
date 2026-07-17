"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet"
import { useNavigate } from "react-router-dom"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"
import {
  Menu,
  X,
  ArrowRight,
  Check,
  Star,
  Play,
  BarChart3,
  Palette,
  Users,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp,
  Send,
  Plus,
  Trash2,
  Settings,
} from "lucide-react"

// Debounce function
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Hero Section
const HeroSection = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  // Interactive style state
  const [formTheme, setFormTheme] = useState("modern") // modern, brutalist, glass
  const [formColor, setFormColor] = useState("purple") // purple, mint, teal, dark
  const [formFont, setFormFont] = useState("Inter") // Inter, Space Grotesk, Playfair Display
  const [formRadius, setFormRadius] = useState("rounded-xl") // rounded-none, rounded-xl, rounded-3xl
  const [formShadow, setFormShadow] = useState("shadow-lg") // shadow-none, shadow-lg, shadow-brutal

  // Interactive forms state
  const [interactiveForms, setInteractiveForms] = useState([
    {
      title: "Customer Feedback Survey",
      responses: "1,247",
      completion: "94%",
      fields: [
        { id: "f1", type: "rating", label: "Overall satisfaction", value: 4 },
        { id: "f2", type: "text", label: "What did you like most?", placeholder: "Great customer service and fast delivery..." },
        { id: "f3", type: "select", label: "How did you hear about us?", value: "Social Media", options: ["Social Media", "Search Engine", "Friend Referral", "Advertisement"] },
      ],
    },
    {
      title: "Event Registration Form",
      responses: "856",
      completion: "87%",
      fields: [
        { id: "f4", type: "text", label: "Full Name", placeholder: "John Smith" },
        { id: "f5", type: "email", label: "Email Address", placeholder: "john@example.com" },
        { id: "f6", type: "checkbox", label: "Dietary Restrictions", options: ["Vegetarian", "Vegan", "Gluten-free"], selected: [] },
      ],
    },
    {
      title: "Product Feedback",
      responses: "2,103",
      completion: "91%",
      fields: [
        { id: "f7", type: "rating", label: "Product Quality", value: 5 },
        { id: "f8", type: "rating", label: "Value for Money", value: 4 },
        { id: "f9", type: "textarea", label: "Additional Comments", placeholder: "The product exceeded my expectations..." },
      ],
    },
  ])

  // Field editing state
  const [editingId, setEditingId] = useState(null) // ID of label or title being edited
  const [editingText, setEditingText] = useState("")

  // Form input responses
  const [formResponses, setFormResponses] = useState({})
  
  // Submit state
  const [submittedForms, setSubmittedForms] = useState({ 0: false, 1: false, 2: false })

  // Reset form inputs
  const resetForm = (tabIndex) => {
    setFormResponses({})
    setSubmittedForms(prev => ({ ...prev, [tabIndex]: false }))
  }

  // Handle label click/double click to edit
  const startEditing = (id, currentText) => {
    setEditingId(id)
    setEditingText(currentText)
  }

  const saveEditing = (type, fieldId = null) => {
    if (!editingText.trim()) {
      setEditingId(null)
      return
    }

    setInteractiveForms(prev => {
      return prev.map((form, index) => {
        if (index === activeTab) {
          if (type === "title") {
            return { ...form, title: editingText }
          } else if (type === "label" && fieldId) {
            return {
              ...form,
              fields: form.fields.map(field => 
                field.id === fieldId ? { ...field, label: editingText } : field
              )
            }
          }
        }
        return form
      })
    })
    setEditingId(null)
  }

  // Add custom field to current form
  const addNewField = (type) => {
    const newFieldMap = {
      text: { type: "text", label: "New Short Text", placeholder: "Type your answer here..." },
      email: { type: "email", label: "New Email", placeholder: "name@example.com" },
      rating: { type: "rating", label: "Rate us", value: 5 },
      checkbox: { type: "checkbox", label: "Select options", options: ["Option 1", "Option 2"], selected: [] }
    }

    const fieldData = newFieldMap[type]
    if (!fieldData) return

    const newField = {
      id: `custom_${Date.now()}`,
      ...fieldData
    }

    setInteractiveForms(prev => {
      return prev.map((form, index) => {
        if (index === activeTab) {
          return {
            ...form,
            fields: [...form.fields, newField]
          }
        }
        return form
      })
    })
  }

  // Delete field from current form
  const deleteField = (fieldId, e) => {
    e.stopPropagation()
    setInteractiveForms(prev => {
      return prev.map((form, index) => {
        if (index === activeTab) {
          return {
            ...form,
            fields: form.fields.filter(field => field.id !== fieldId)
          }
        }
        return form
      })
    })
  }

  const handleInputChange = (fieldId, val) => {
    setFormResponses(prev => ({ ...prev, [fieldId]: val }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmittedForms(prev => ({ ...prev, [activeTab]: true }))
  }

  // Formatting class lookups based on customization state
  const fontStyle = {
    fontFamily: formFont === "Space Grotesk" ? "'Space Grotesk', sans-serif" : 
                formFont === "Playfair Display" ? "'Playfair Display', serif" : 
                "'Outfit', 'Inter', sans-serif"
  }

  const getThemeClasses = () => {
    const shadowClass = formTheme === "brutalist" ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" : formShadow
    
    // Theme border + shadow styles
    let themeBorder = "border border-gray-200"
    if (formTheme === "brutalist") {
      themeBorder = "border-4 border-black"
    } else if (formTheme === "glass") {
      themeBorder = "border border-white/50"
    }

    // Theme background
    let themeBg = "bg-white text-gray-900"
    if (formTheme === "glass") {
      themeBg = "bg-white/40 backdrop-blur-xl text-gray-900"
    }

    // Apply color palettes
    if (formColor === "dark") {
      themeBg = formTheme === "glass" ? "bg-gray-900/60 backdrop-blur-xl text-white" : "bg-gray-900 text-white"
      themeBorder = formTheme === "brutalist" ? "border-4 border-white" : "border-gray-800"
    }

    return `${themeBg} ${themeBorder} ${shadowClass} ${formRadius}`
  }

  const getInputClasses = () => {
    let base = "w-full p-3 transition-all outline-none text-gray-900 dark:text-gray-900"
    let border = "border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
    let bg = "bg-gray-50/50"

    if (formTheme === "brutalist") {
      border = "border-2 border-black focus:bg-yellow-50"
      bg = "bg-white"
    } else if (formTheme === "glass") {
      border = "border border-white/40 focus:border-white/80 focus:bg-white/30"
      bg = "bg-white/20"
    }

    if (formColor === "dark") {
      bg = "bg-gray-800"
      base = "w-full p-3 transition-all outline-none text-white dark:text-white"
      border = formTheme === "brutalist" ? "border-2 border-white focus:bg-gray-700" : "border-gray-700 focus:border-yellow-400"
    }

    return `${base} ${border} ${bg} ${formRadius}`
  }

  const getButtonClasses = () => {
    let base = "px-6 py-3 font-semibold transition-all flex items-center justify-center cursor-pointer"
    
    let colorScheme = "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
    if (formColor === "mint") {
      colorScheme = "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
    } else if (formColor === "teal") {
      colorScheme = "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
    } else if (formColor === "dark") {
      colorScheme = "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900"
    }

    let border = ""
    if (formTheme === "brutalist") {
      border = "border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      if (formColor === "dark") {
        border = "border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      }
    }

    return `${base} ${colorScheme} ${border} ${formRadius}`
  }

  const activeForm = interactiveForms[activeTab]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/45 pt-24 pb-12 transition-colors duration-200">
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-r from-purple-200/30 to-blue-200/30 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 10 + i * 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ left: `${20 + i * 15}%`, top: `${10 + i * 10}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Beautiful Forms
            <br />
            <span className="text-gray-900 dark:text-white">Made Simple</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create stunning, interactive forms that your users will love. Go beyond Google Forms with advanced logic,
            beautiful themes, and powerful analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
            >
              Start Building for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <a
              href="#features"
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center border border-gray-200 dark:border-slate-700"
            >
              Explore Features
            </a>
          </div>

          <motion.div
            className="text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            No credit card required • Free forever plan • Setup in 2 minutes
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Dashboard Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-6xl mx-auto border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium flex items-center space-x-2 text-sm sm:text-base">
                    <span>FormBuilder Sandbox</span>
                    <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-0.5 rounded font-mono border border-purple-500/20">PLAYGROUND</span>
                  </span>
                </div>
                <div className="text-gray-400 text-sm hidden sm:block">sandbox.formwise.app</div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-slate-900/60 text-left transition-colors duration-200">
              {/* Form Preview Tabs */}
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 mb-6 flex-wrap gap-2">
                <div className="flex space-x-1 overflow-x-auto">
                  {interactiveForms.map((form, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTab(index)
                        setFormResponses({})
                      }}
                      className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === index
                          ? "border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-950/20"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      {form.title}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2 bg-purple-100/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full border border-purple-200/50 dark:border-purple-900/30">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                  </span>
                  <span>Try editing fields and styling live!</span>
                </div>
              </div>

              {/* Two Column Playground */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Style Customizer Sidebar (1/3 width) */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-5 shadow-sm transition-colors duration-200">
                  <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-slate-700">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">Form Customizer</h3>
                  </div>

                  {/* Theme Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Layout Theme
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "modern", label: "Modern" },
                        { id: "brutalist", label: "Brutalist" },
                        { id: "glass", label: "Glassy" }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setFormTheme(t.id)}
                          className={`py-1.5 px-2 text-xs font-medium border rounded-lg transition-all cursor-pointer ${
                            formTheme === t.id 
                              ? "bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-700 dark:text-purple-400" 
                              : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Preset Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Color Palette
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "purple", label: "Soft Indigo" },
                        { id: "mint", label: "Emerald Mint" },
                        { id: "teal", label: "Ocean Teal" },
                        { id: "dark", label: "Midnight Neon" }
                      ].map(c => (
                        <button
                          key={c.id}
                          onClick={() => setFormColor(c.id)}
                          className={`py-1.5 px-2 text-xs font-medium border rounded-lg transition-all cursor-pointer ${
                            formColor === c.id 
                              ? "bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-700 dark:text-purple-400 font-semibold" 
                              : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Typography Font
                    </label>
                    <select
                      value={formFont}
                      onChange={(e) => setFormFont(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200"
                    >
                      <option value="Inter">Outfit (Sleek Sans)</option>
                      <option value="Space Grotesk">Space Grotesk (Modern Tech)</option>
                      <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                    </select>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Corner Roundness
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "rounded-none", label: "Sharp" },
                        { id: "rounded-xl", label: "Rounded" },
                        { id: "rounded-3xl", label: "Soft" }
                      ].map(r => (
                        <button
                          key={r.id}
                          onClick={() => setFormRadius(r.id)}
                          className={`py-1 px-2 text-xs font-medium border rounded-lg transition-all cursor-pointer ${
                            formRadius === r.id 
                              ? "bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-700 dark:text-purple-400" 
                              : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Field Section */}
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Sandbox: Add Field to Form
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => addNewField("text")}
                        className="py-1.5 px-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 hover:border-purple-300 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Short Text</span>
                      </button>
                      <button
                        onClick={() => addNewField("email")}
                        className="py-1.5 px-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 hover:border-purple-300 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </button>
                      <button
                        onClick={() => addNewField("rating")}
                        className="py-1.5 px-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 hover:border-purple-300 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Rating Stars</span>
                      </button>
                      <button
                        onClick={() => addNewField("checkbox")}
                        className="py-1.5 px-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 hover:border-purple-300 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Checkbox</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-3 border border-purple-100 dark:border-purple-900/30">
                    <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                      💡 **Tip:** Double-click form title or field labels on the right canvas to live edit their text!
                    </p>
                  </div>
                </div>

                {/* Form Canvas Area (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center w-full min-h-[400px]">
                  
                  <AnimatePresence mode="wait">
                    {submittedForms[activeTab] ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-lg p-8 text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-2xl flex flex-col items-center justify-center transition-colors duration-200"
                        style={fontStyle}
                      >
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Check className="w-8 h-8 text-green-600 dark:text-green-400 stroke-[3px]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Form Submitted!</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          Your response has been saved to our simulated sandbox. Ready to build a real form?
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => resetForm(activeTab)}
                            className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            Submit Again
                          </button>
                          <button
                            onClick={() => navigate("/auth")}
                            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 cursor-pointer"
                          >
                            Create Free Account
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        style={fontStyle}
                        className={`w-full max-w-lg p-6 sm:p-8 transition-all duration-300 ${getThemeClasses()}`}
                      >
                        {/* Title block */}
                        <div className="mb-6 pb-4 border-b border-gray-200/50">
                          {editingId === "title" ? (
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onBlur={() => saveEditing("title")}
                              onKeyDown={(e) => e.key === "Enter" && saveEditing("title")}
                              className="text-xl sm:text-2xl font-bold border-b border-purple-500 outline-none w-full bg-transparent focus:ring-1 focus:ring-purple-200"
                              autoFocus
                            />
                          ) : (
                            <h3 
                              className="text-xl sm:text-2xl font-bold cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 px-1 py-0.5 rounded transition-all truncate"
                              title="Double-click to edit title"
                              onDoubleClick={() => startEditing("title", activeForm.title)}
                            >
                              {activeForm.title}
                            </h3>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{activeForm.responses} responses</span>
                            <span>•</span>
                            <span>{activeForm.completion} completion rate</span>
                          </div>
                        </div>

                        {/* Fields List */}
                        <div className="space-y-5 mb-8">
                          {activeForm.fields.map((field, fieldIndex) => {
                            const val = formResponses[field.id] || ""
                            return (
                              <motion.div
                                key={field.id}
                                className="space-y-1.5 relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: fieldIndex * 0.05 }}
                              >
                                {/* Label block */}
                                <div className="flex justify-between items-center">
                                  {editingId === field.id ? (
                                    <input
                                      type="text"
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      onBlur={() => saveEditing("label", field.id)}
                                      onKeyDown={(e) => e.key === "Enter" && saveEditing("label", field.id)}
                                      className="text-sm font-semibold border-b border-purple-500 outline-none w-full bg-transparent"
                                      autoFocus
                                    />
                                  ) : (
                                    <label
                                      className="text-sm font-semibold cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 px-1 py-0.5 rounded transition-all flex-1 mr-2"
                                      title="Double-click to edit label"
                                      onDoubleClick={() => startEditing(field.id, field.label)}
                                    >
                                      {field.label}
                                    </label>
                                  )}

                                  {/* Delete Field button in sandbox */}
                                  <button
                                    type="button"
                                    onClick={(e) => deleteField(field.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all cursor-pointer"
                                    title="Delete field"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Render Inputs */}
                                {field.type === "rating" && (
                                  <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        type="button"
                                        key={star}
                                        onClick={() => handleInputChange(field.id, star)}
                                        className="transition-transform active:scale-95 cursor-pointer"
                                      >
                                        <Star
                                          className={`w-7 h-7 transition-colors ${
                                            star <= (val || field.value) ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {field.type === "text" && (
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className={getInputClasses()}
                                  />
                                )}

                                {field.type === "email" && (
                                  <input
                                    type="email"
                                    value={val}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className={getInputClasses()}
                                  />
                                )}

                                {field.type === "textarea" && (
                                  <textarea
                                    value={val}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className={`${getInputClasses()} h-20 resize-none`}
                                  />
                                )}

                                {field.type === "select" && (
                                  <select
                                    value={val || field.value}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    className={getInputClasses()}
                                  >
                                    {field.options.map((opt, i) => (
                                      <option key={i} value={opt} className="text-gray-900 bg-white">
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                {field.type === "checkbox" && (
                                  <div className="space-y-2 pt-1">
                                    {field.options.map((option, optIdx) => {
                                      const currentList = val || []
                                      const checked = currentList.includes(option)
                                      return (
                                        <label key={optIdx} className="flex items-center space-x-2 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                              const newList = e.target.checked
                                                ? [...currentList, option]
                                                : currentList.filter(o => o !== option)
                                              handleInputChange(field.id, newList)
                                            }}
                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                          />
                                          <span className="text-sm text-gray-600 dark:text-gray-300">{option}</span>
                                        </label>
                                      )
                                    })}
                                  </div>
                                )}
                              </motion.div>
                            )
                          })}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center">
                          <button type="submit" className={getButtonClasses()}>
                            <Send className="w-4 h-4 mr-2" />
                            <span>Submit Response</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => resetForm(activeTab)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline cursor-pointer"
                          >
                            Reset Form
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Beautiful Themes",
      description: "Choose from dozens of stunning themes or create your own with custom colors, fonts, and layouts.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get deep insights with real-time charts, response tracking, and exportable reports.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work together with your team using role-based permissions and real-time editing.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Logic",
      description: "Create dynamic forms with conditional logic, branching, and personalized experiences.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with encryption, GDPR compliance, and advanced access controls.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Integrations",
      description: "Connect with 1000+ apps including Slack, Notion, Google Sheets, and Zapier.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Everything you need to create amazing forms
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From simple contact forms to complex surveys, FormWise has all the tools you need to collect, analyze, and
            act on your data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700/80 transition-colors duration-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true)
  const navigate = useNavigate()

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: ["5 Forms", "100 Responses/month", "Basic Themes", "Email Support", "Basic Analytics"],
      popular: false,
    },
    {
      name: "Pro",
      price: { monthly: 15, annual: 10 },
      description: "For growing businesses",
      features: [
        "Unlimited Forms",
        "5,000 Responses/month",
        "Custom Branding",
        "Advanced Logic",
        "Webhooks & API",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Business",
      price: { monthly: 35, annual: 25 },
      description: "For teams and enterprises",
      features: [
        "Everything in Pro",
        "Unlimited Responses",
        "Team Collaboration",
        "Advanced Analytics",
        "White-label Options",
        "Phone Support",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-indigo-950/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose the plan that's right for you. Upgrade or downgrade at any time.
          </p>

          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${!isAnnual ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"}`}>Monthly</span>
            <motion.button
              className="relative w-14 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-1 cursor-pointer"
              onClick={() => setIsAnnual(!isAnnual)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`ml-3 ${isAnnual ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
              Annual<span className="ml-2 bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full border border-transparent dark:border-green-900/30">Save 33%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-8 relative transition-colors duration-200 border border-transparent dark:border-slate-700 ${plan.popular ? "ring-2 ring-purple-600 shadow-2xl scale-105" : "shadow-lg"}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
                </div>
                {isAnnual && plan.price.annual < plan.price.monthly && (
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer ${plan.popular ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg" : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600"}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/auth")}
              >
                {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "FormWise transformed how we collect customer feedback. The analytics are incredible and the forms look amazing!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content:
        "We switched from Google Forms and never looked back. The conditional logic feature saved us hours of work.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager",
      company: "GlobalInc",
      content: "The team collaboration features are fantastic. We can all work on forms together seamlessly.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Loved by teams worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">See what our customers have to say about FormWise</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700/80 transition-colors duration-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 bg-gray-200 dark:bg-slate-700"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      question: "How is FormWise different from Google Forms?",
      answer:
        "FormWise offers advanced features like conditional logic, custom branding, detailed analytics, team collaboration, and beautiful themes that Google Forms doesn't provide. Plus, we're built specifically for businesses that need more control and customization.",
    },
    {
      question: "Can I import my existing Google Forms?",
      answer:
        "Yes! We provide an easy import tool that lets you migrate your existing Google Forms to FormWise in just a few clicks, preserving all your questions and settings.",
    },
    {
      question: "Is there a free plan available?",
      answer:
        "Our free plan includes 5 forms and 100 responses per month, which is perfect for getting started. You can upgrade anytime as your needs grow.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We take security seriously. All data is encrypted in transit and at rest, we're GDPR compliant, and we follow industry best practices for data protection. Your data is never shared with third parties.",
    },
    {
      question: "Can I customize the look of my forms?",
      answer:
        "Yes! FormWise offers extensive customization options including custom themes, colors, fonts, logos, and even custom CSS for advanced users. Make your forms match your brand perfectly.",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-indigo-950/20 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to know about FormWise</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-950 relative overflow-hidden transition-colors duration-200">
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8 + i * 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ left: `${10 + i * 30}%`, top: `${20 + i * 20}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to create amazing forms?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who've already made the switch to FormWise. Start building beautiful forms today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all border border-white/30 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </div>

          <p className="text-white/80 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
       <Helmet>
        <title>FormWise – Build Beautiful Forms Easily</title>
        <meta
          name="description"
          content="FormWise lets you build beautiful, smart forms with logic, analytics, and themes. Better than Google Forms."
        />
        <meta
          name="keywords"
          content="form builder, online forms, google forms alternative, survey builder, interactive forms"
        />
        <meta name="author" content="FormWise Team" />
        <meta property="og:title" content="FormWise – Smart Form Builder" />
        <meta
          property="og:description"
          content="Create beautiful forms with logic, analytics, and themes. Try FormWise free today."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://formwise.pages.dev/" />
        <meta property="og:image" content="/formwise-preview.png" />
        <link rel="canonical" href="https://formwise.pages.dev/" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FormWise",
              "description": "Smart, beautiful online form builder for surveys and more.",
              "applicationCategory": "BusinessApplication",
              "url": "https://formwise.pages.dev/",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </script>
      </Helmet>

      <PublicHeader />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  )
}
