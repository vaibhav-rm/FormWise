"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  Type,
  AlignLeft,
  CheckSquare,
  Circle,
  Star,
  Calendar,
  Upload,
  Hash,
  Mail,
  Phone,
  Link,
  ImageIcon,
  FileText,
  Save,
  Eye,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  ChevronDown,
  X,
  Palette,
  MousePointer,
  Layers,
  ArrowLeft,
  Globe,
  Zap,
  MoreVertical,
  ChevronLeft,
  Layout,
  Edit2,
  Sliders,
  Share2,
  ExternalLink,
  Check,
  Code,
  QrCode,
  MessageSquare,
  Undo,
  Redo,
  Heading,
  Clock,
  Grid3X3,
  PenLine,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import { SignatureCanvas } from "../components/signature-canvas"
import MobileNavigation from "../components/mobile-navigation"
import { useForms } from "../hooks/use-forms"
import { useAuth } from "../hooks/use-auth"
// Rule matching helpers
const checkRuleCondition = (rule, data) => {
  const sourceValue = data[rule.fieldId];
  const targetValue = rule.value;
  
  if (sourceValue === undefined || sourceValue === null) {
    if (rule.condition === "not_equals") {
      return targetValue !== "";
    }
    return false;
  }

  const srcStr = sourceValue.toString().trim().toLowerCase();
  const tgtStr = targetValue.toString().trim().toLowerCase();

  switch (rule.condition) {
    case "equals":
      return srcStr === tgtStr;
    case "not_equals":
      return srcStr !== tgtStr;
    case "contains":
      return srcStr.includes(tgtStr);
    case "greater_than":
      return Number(sourceValue) > Number(targetValue);
    case "less_than":
      return Number(sourceValue) < Number(targetValue);
    default:
      return false;
  }
};

const isFieldVisible = (fieldId, logicRules, currentFormData) => {
  if (!logicRules || logicRules.length === 0) return true;
  
  const rules = logicRules.filter(r => r.targetFieldId === fieldId);
  if (rules.length === 0) return true;

  const showRules = rules.filter(r => r.action === "show");
  const hideRules = rules.filter(r => r.action === "hide");

  let visible = true;

  if (showRules.length > 0) {
    visible = showRules.some(rule => checkRuleCondition(rule, currentFormData));
  }

  if (hideRules.length > 0) {
    const shouldHide = hideRules.some(rule => checkRuleCondition(rule, currentFormData));
    if (shouldHide) {
      visible = false;
    }
  }

  return visible;
};

export default function FormBuilder() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createForm, updateForm, getForm } = useForms()

  // Responsive states
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [activeTab, setActiveTab] = useState("fields")
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [mobileEditMode, setMobileEditMode] = useState("fields") // fields, design, logic, settings
  const [showMobileFieldOptions, setShowMobileFieldOptions] = useState(false)
  const [showMobileContextMenu, setShowMobileContextMenu] = useState(null)

  // Mobile FAB states
  const [showMobileFAB, setShowMobileFAB] = useState(false)
  const [isFABOpen, setIsFABOpen] = useState(false)

  // Form states
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const [previewMode, setPreviewMode] = useState("desktop")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formStatus, setFormStatus] = useState("draft")
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareTab, setShareTab] = useState("link")
  const [copied, setCopied] = useState(false)
  const [embedWidth, setEmbedWidth] = useState("100%")
  const [embedHeight, setEmbedHeight] = useState("600px")
  const [widgetText, setWidgetText] = useState("Feedback")
  const [widgetColor, setWidgetColor] = useState("#9333ea")
  const [editingRuleId, setEditingRuleId] = useState(null)
  const [ruleForm, setRuleForm] = useState({
    fieldId: "",
    condition: "equals",
    value: "",
    action: "show",
    targetFieldId: "",
  })
  const [previewFormData, setPreviewFormData] = useState({})
  const [formSettings, setFormSettings] = useState({
    theme: "modern",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    primaryColor: "#7c3aed",
    submitButtonText: "Submit",
    thankYouMessage: "Thank you for your submission!",
    collectEmail: false,
    allowMultipleSubmissions: true,
    fontFamily: "Inter",
    borderRadius: "rounded-xl",
    shadowStyle: "shadow-md",
    logicRules: [],
  })
  
  // History states for undo/redo
  const [history, setHistory] = useState([])
  const [historyPointer, setHistoryPointer] = useState(-1)

  const dragItem = useRef(null)
  const dragOverItem = useRef(null)
  const fieldContainerRef = useRef(null)

  // Enhanced responsive detection with more breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      let newScreenSize = "desktop"
      const isMobileView = width < 768

      if (width < 480) {
        newScreenSize = "mobile-sm"
      } else if (width < 640) {
        newScreenSize = "mobile"
      } else if (width < 768) {
        newScreenSize = "tablet-sm"
      } else if (width < 1024) {
        newScreenSize = "tablet"
      } else if (width < 1280) {
        newScreenSize = "desktop-sm"
      } else {
        newScreenSize = "desktop"
      }

      setScreenSize(newScreenSize)
      setIsMobile(isMobileView)
      setShowMobileFAB(isMobileView)

      // Auto-close panels on larger screens
      if (newScreenSize.includes("desktop")) {
        setShowLeftPanel(false)
        setShowRightPanel(false)
        setShowMobilePreview(false)
        setIsFABOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Set initial history when form is loaded or created
  useEffect(() => {
    if (history.length === 0) {
      setHistory([fields])
      setHistoryPointer(0)
    }
  }, [fields, history])

  const pushToHistory = (newFields) => {
    const nextHistory = history.slice(0, historyPointer + 1)
    setHistory([...nextHistory, newFields])
    setHistoryPointer(nextHistory.length)
  }

  const undo = () => {
    if (historyPointer > 0) {
      const prevPointer = historyPointer - 1
      setHistoryPointer(prevPointer)
      setFields(history[prevPointer])
    }
  }

  const redo = () => {
    if (historyPointer < history.length - 1) {
      const nextPointer = historyPointer + 1
      setHistoryPointer(nextPointer)
      setFields(history[nextPointer])
    }
  }

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keyboard shortcuts when user is typing in form inputs, textareas, or selects
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.tagName === "SELECT" ||
        activeEl.isContentEditable
      );

      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (isInput) return; // Allow default undo inside inputs
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        if (isInput) return; // Allow default redo inside inputs
        e.preventDefault();
        redo();
        return;
      }

      // Deselect selected field: Escape
      if (e.key === "Escape") {
        setSelectedField(null);
        return;
      }

      // Delete selected field: Backspace or Delete
      if ((e.key === "Delete" || e.key === "Backspace") && selectedField) {
        if (isInput) return; // Don't delete field when typing inside inputs/textareas
        e.preventDefault();
        deleteField(selectedField);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fields, selectedField, history, historyPointer]);

  // Load form data if editing
  useEffect(() => {
    const loadForm = async () => {
      if (!formId || formId === "new") return

      try {
        const form = await getForm(formId)
        if (form) {
          setFormTitle(form.title || "Untitled Form")
          setFormDescription(form.description || "")
          setFormStatus(form.status || "draft")
          setFields(
            form.fields?.map((field) => ({
              ...field,
              options: field.options || [],
            })) || [],
          )
          setFormSettings({
            theme: "modern",
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            primaryColor: "#7c3aed",
            submitButtonText: "Submit",
            thankYouMessage: "Thank you for your submission!",
            collectEmail: false,
            allowMultipleSubmissions: true,
            fontFamily: "Inter",
            borderRadius: "rounded-xl",
            shadowStyle: "shadow-md",
            logicRules: [],
            ...(form.settings || {}),
          })
        }
      } catch (error) {
        console.error("Error loading form:", error)
      }
    }

    if (formId && formId !== "new") {
      loadForm()
    }
  }, [formId, getForm])

  const location = useLocation()
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get("published") === "true") {
      setShowShareModal(true)
      navigate(`/builder/${formId}`, { replace: true })
    }
  }, [location.search, formId, navigate])

  // Run custom JS in preview mode
  useEffect(() => {
    if (showPreview && formSettings.customJS) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(formSettings.customJS)
        fn()
      } catch (e) {
        console.warn("Custom JS preview error:", e)
      }
    }
  }, [showPreview, formSettings.customJS])

  const fieldTypes = [
    { type: "text", label: "Short Text", icon: <Type className="w-4 h-4" />, category: "basic" },
    { type: "textarea", label: "Long Text", icon: <AlignLeft className="w-4 h-4" />, category: "basic" },
    { type: "email", label: "Email", icon: <Mail className="w-4 h-4" />, category: "basic" },
    { type: "phone", label: "Phone", icon: <Phone className="w-4 h-4" />, category: "basic" },
    { type: "number", label: "Number", icon: <Hash className="w-4 h-4" />, category: "basic" },
    { type: "url", label: "Website URL", icon: <Link className="w-4 h-4" />, category: "basic" },
    { type: "date", label: "Date", icon: <Calendar className="w-4 h-4" />, category: "basic" },
    { type: "time", label: "Time", icon: <Clock className="w-4 h-4" />, category: "basic" },
    { type: "checkbox", label: "Checkboxes", icon: <CheckSquare className="w-4 h-4" />, category: "choice" },
    { type: "radio", label: "Multiple Choice", icon: <Circle className="w-4 h-4" />, category: "choice" },
    { type: "select", label: "Dropdown", icon: <ChevronDown className="w-4 h-4" />, category: "choice" },
    { type: "rating", label: "Rating", icon: <Star className="w-4 h-4" />, category: "advanced" },
    { type: "file", label: "File Upload", icon: <Upload className="w-4 h-4" />, category: "advanced" },
    { type: "image", label: "Image Upload", icon: <ImageIcon className="w-4 h-4" />, category: "advanced" },
    { type: "heading", label: "Heading", icon: <Heading className="w-4 h-4" />, category: "layout" },
    { type: "paragraph", label: "Paragraph", icon: <FileText className="w-4 h-4" />, category: "layout" },
    { type: "matrix", label: "Matrix / Likert", icon: <Grid3X3 className="w-4 h-4" />, category: "advanced" },
    { type: "signature", label: "Signature", icon: <PenLine className="w-4 h-4" />, category: "advanced" },
  ]

  const addField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: `${fieldTypes.find((f) => f.type === type)?.label || "Field"}`,
      required: false,
      options: type === "checkbox" || type === "radio" || type === "select" ? ["Option 1", "Option 2"] : [],
      rows: type === "matrix" ? ["Statement 1", "Statement 2", "Statement 3"] : undefined,
      columns: type === "matrix" ? ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] : undefined,
    }
    const newFields = [...fields, newField]
    setFields(newFields)
    pushToHistory(newFields)
    setSelectedField(newField.id)

    // Close mobile panels after adding field
    if (screenSize !== "desktop") {
      setShowLeftPanel(false)
      setIsFABOpen(false)

      // Auto-scroll to the new field in mobile view
      setTimeout(() => {
        if (fieldContainerRef.current) {
          fieldContainerRef.current.scrollTop = fieldContainerRef.current.scrollHeight
        }
      }, 100)
    }
  }

  const updateField = (id, updates) => {
    const newFields = fields.map((field) => (field.id === id ? { ...field, ...updates } : field))
    setFields(newFields)
    pushToHistory(newFields)
  }

  const deleteField = (id) => {
    const newFields = fields.filter((field) => field.id !== id)
    setFields(newFields)
    pushToHistory(newFields)
    if (selectedField === id) {
      setSelectedField(null)
    }
    setShowMobileContextMenu(null)
  }

  const duplicateField = (id) => {
    const field = fields.find((f) => f.id === id)
    if (field) {
      const newField = { ...field, id: `field_${Date.now()}`, label: `${field.label} (Copy)` }
      const index = fields.findIndex((f) => f.id === id)
      const newFields = [...fields]
      newFields.splice(index + 1, 0, newField)
      setFields(newFields)
      pushToHistory(newFields)
    }
    setShowMobileContextMenu(null)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const formData = {
        title: formTitle,
        description: formDescription,
        fields,
        settings: formSettings,
        status: formStatus,
      }

      if (formId && formId !== "new") {
        await updateForm(formId, formData)
      } else {
        const newFormId = await createForm(formData)
        navigate(`/builder/${newFormId}`)
      }
    } catch (error) {
      console.error("Error saving form:", error)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!user) return

    setSaving(true)
    try {
      const formData = {
        title: formTitle,
        description: formDescription,
        fields,
        settings: formSettings,
        status: "published",
      }

      if (formId && formId !== "new") {
        await updateForm(formId, formData)
        setFormStatus("published")
        setShowShareModal(true)
      } else {
        const newFormId = await createForm(formData)
        navigate(`/builder/${newFormId}?published=true`)
      }
    } catch (error) {
      console.error("Error publishing form:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderShareModal = () => {
    const formUrl = `${window.location.origin}/form/${formId}`
    const iframeCode = `<iframe src="${formUrl}?embed=true" width="${embedWidth}" height="${embedHeight}" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 8px;"></iframe>`
    
    const widgetCode = `<!-- Place this button where you want it to appear -->
<button onclick="openFormWiseModal()" style="background-color: ${widgetColor}; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: sans-serif; transition: opacity 0.2s;">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  \${widgetText}
</button>

<script>
  function openFormWiseModal() {
    const width = 600;
    const height = 700;
    const left = (screen.width/2)-(width/2);
    const top = (screen.height/2)-(height/2);
    window.open(
      '${formUrl}',
      'FormWisePopup',
      'width='+width+',height='+height+',top='+top+',left='+left+',resizable=yes,scrollbars=yes'
    );
  }
</script>`

    return (
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowShareModal(false)}
      >
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-gray-100"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/10 dark:to-blue-950/10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Form Published Successfully!</span>
                <span className="text-2xl">🎉</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your form is live. Choose how you want to share or embed it.</p>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
            <button
              onClick={() => { setShareTab("link"); setCopied(false); }}
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
                shareTab === "link"
                  ? "border-purple-600 text-purple-600 bg-white dark:bg-slate-800"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/30 dark:hover:bg-slate-800/30"
              }`}
            >
              <Link className="w-4 h-4" />
              <span>Direct Link</span>
            </button>
            <button
              onClick={() => { setShareTab("embed"); setCopied(false); }}
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
                shareTab === "embed"
                  ? "border-purple-600 text-purple-600 bg-white dark:bg-slate-800"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-400 hover:bg-gray-50/30 dark:hover:bg-slate-800/30"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Iframe Embed</span>
            </button>
            <button
              onClick={() => { setShareTab("widget"); setCopied(false); }}
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
                shareTab === "widget"
                  ? "border-purple-600 text-purple-600 bg-white dark:bg-slate-800"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-400 hover:bg-gray-50/30 dark:hover:bg-slate-800/30"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Popup Widget</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {shareTab === "link" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Public Form URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={formUrl}
                      className="flex-1 p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopy(formUrl)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Live Form</span>
                  </a>
                </div>

                {/* Social Share */}
                <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Share on Social Media</h4>
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=Please%20fill%20out%20my%20form%20built%20with%20FormWise!&url=${encodeURIComponent(formUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center justify-center gap-2 transition-colors bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100/50 dark:hover:bg-slate-800/50"
                    >
                      Twitter / X
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center justify-center gap-2 transition-colors bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100/50 dark:hover:bg-slate-800/50"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={`mailto:?subject=Please%20fill%20out%20my%20form&body=Here%20is%20the%20link%20to%20my%20FormWise%20form:%20${encodeURIComponent(formUrl)}`}
                      className="flex-1 py-2 px-3 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center justify-center gap-2 transition-colors bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100/50 dark:hover:bg-slate-800/50"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            )}

            {shareTab === "embed" && (
              <div className="space-y-6">
                {/* Embed customization controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Width</label>
                    <input
                      type="text"
                      value={embedWidth}
                      onChange={(e) => setEmbedWidth(e.target.value)}
                      placeholder="e.g. 100% or 600px"
                      className="w-full p-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Height</label>
                    <input
                      type="text"
                      value={embedHeight}
                      onChange={(e) => setEmbedHeight(e.target.value)}
                      placeholder="e.g. 600px"
                      className="w-full p-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Iframe Code</label>
                    <button
                      onClick={() => handleCopy(iframeCode)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Code</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={iframeCode}
                    rows={4}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-600 dark:text-gray-300 font-mono focus:outline-none resize-none"
                  />
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30 flex items-start gap-3">
                  <QrCode className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-purple-900 dark:text-purple-300">Embedding Tip</h5>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mt-1 leading-relaxed">
                      Simply paste this code block directly into your CMS (WordPress, Webflow, Shopify) or website's custom HTML component.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {shareTab === "widget" && (
              <div className="space-y-6">
                {/* Widget customization controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Button Text</label>
                    <input
                      type="text"
                      value={widgetText}
                      onChange={(e) => setWidgetText(e.target.value)}
                      placeholder="e.g. Feedback"
                      className="w-full p-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Button Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={widgetColor}
                        onChange={(e) => setWidgetColor(e.target.value)}
                        className="w-10 h-10 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer p-0.5 bg-white dark:bg-slate-700"
                      />
                      <input
                        type="text"
                        value={widgetColor}
                        onChange={(e) => setWidgetColor(e.target.value)}
                        placeholder="#9333ea"
                        className="flex-1 p-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Popup Code</label>
                    <button
                      onClick={() => handleCopy(widgetCode)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Code</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={widgetCode}
                    rows={8}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-600 dark:text-gray-300 font-mono focus:outline-none resize-none"
                  />
                </div>

                {/* Live Button Preview */}
                <div className="border border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-gray-50/50 dark:bg-slate-900/30 flex flex-col items-center">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">Button Preview</span>
                  <button
                    type="button"
                    style={{ backgroundColor: widgetColor }}
                    className="text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-default pointer-events-none"
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>{widgetText}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex justify-end">
            <button
              onClick={() => setShowShareModal(false)}
              className="bg-gray-900 hover:bg-gray-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const handleDragStart = (index) => {
    dragItem.current = index
  }

  const handleDragEnter = (index) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const draggedItem = fields[dragItem.current]
      const newFields = [...fields]
      newFields.splice(dragItem.current, 1)
      newFields.splice(dragOverItem.current, 0, draggedItem)
      setFields(newFields)
      pushToHistory(newFields)
    }
    dragItem.current = null
    dragOverItem.current = null
  }

  // Mobile touch drag handlers
  const handleTouchDragStart = (index) => {
    dragItem.current = index
    // Add visual feedback for drag start
    const element = document.getElementById(`field-${fields[index].id}`)
    if (element) {
      element.classList.add("bg-purple-50", "border-purple-300", "shadow-lg")
    }
  }

  const handleTouchDragMove = (e, index) => {
    e.preventDefault()
    if (dragItem.current === null) return

    dragOverItem.current = index

    // Visual feedback for potential drop target
    const elements = document.querySelectorAll(".field-item")
    elements.forEach((el, i) => {
      if (i === index && i !== dragItem.current) {
        el.classList.add("border-blue-300", "bg-blue-50")
      } else if (i !== dragItem.current) {
        el.classList.remove("border-blue-300", "bg-blue-50")
      }
    })
  }

  const handleTouchDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const draggedItem = fields[dragItem.current]
      const newFields = [...fields]
      newFields.splice(dragItem.current, 1)
      newFields.splice(dragOverItem.current, 0, draggedItem)
      setFields(newFields)
      pushToHistory(newFields)
    }

    // Remove all visual feedback
    const elements = document.querySelectorAll(".field-item")
    elements.forEach((el) => {
      el.classList.remove("bg-purple-50", "border-purple-300", "shadow-lg", "border-blue-300", "bg-blue-50")
    })

    dragItem.current = null
    dragOverItem.current = null
  }

  // Mobile FAB actions
  const mobileActions = [
    {
      id: "add-field",
      label: "Add Field",
      icon: <Plus className="w-5 h-5" />,
      color: "bg-purple-600",
      action: () => setShowLeftPanel(true),
    },
    {
      id: "preview",
      label: "Preview",
      icon: <Eye className="w-5 h-5" />,
      color: "bg-blue-600",
      action: () => setShowMobilePreview(!showMobilePreview),
    },
    {
      id: "design",
      label: "Design",
      icon: <Palette className="w-5 h-5" />,
      color: "bg-pink-600",
      action: () => setMobileEditMode("design"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-gray-600",
      action: () => setMobileEditMode("settings"),
    },
  ]

  const handlePreviewInputChange = (fieldId, value) => {
    setPreviewFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const renderField = (field, isPreview = false) => {
    const radiusClass = formSettings.borderRadius || "rounded-lg"

    let themeClasses = "border border-gray-300 bg-white text-gray-900 dark:bg-slate-700 dark:text-white dark:border-slate-600"
    if (formSettings.theme === "classic") {
      themeClasses = "border-b-2 border-x-0 border-t-0 border-gray-300 bg-[#fafafa] dark:bg-slate-700/50 focus:ring-0 rounded-none text-gray-900 dark:text-white dark:border-slate-600"
    } else if (formSettings.theme === "minimal") {
      themeClasses = "border border-gray-200 bg-transparent rounded-none focus:ring-0 text-gray-900 dark:text-white dark:border-slate-700"
    }

    const baseClasses = isPreview
      ? `w-full p-3 transition-all outline-none custom-form-input ${themeClasses} ${formSettings.theme !== "classic" && formSettings.theme !== "minimal" ? radiusClass : ""}`
      : `w-full p-2 text-sm transition-all outline-none custom-form-input ${themeClasses} ${formSettings.theme !== "classic" && formSettings.theme !== "minimal" ? radiusClass : ""}`

    const value = isPreview ? (previewFormData[field.id] || "") : ""

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
      case "url":
        return (
          <input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseClasses}
            disabled={!isPreview}
            value={value}
            onChange={isPreview ? (e) => handlePreviewInputChange(field.id, e.target.value) : undefined}
          />
        )
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={`${baseClasses} h-24 resize-none`}
            disabled={!isPreview}
            value={value}
            onChange={isPreview ? (e) => handlePreviewInputChange(field.id, e.target.value) : undefined}
          />
        )
      case "date":
        return (
          <input 
            type="date" 
            className={baseClasses} 
            disabled={!isPreview} 
            value={value}
            onChange={isPreview ? (e) => handlePreviewInputChange(field.id, e.target.value) : undefined}
          />
        )
      case "time":
        return (
          <input 
            type="time" 
            className={baseClasses} 
            disabled={!isPreview} 
            value={value}
            onChange={isPreview ? (e) => handlePreviewInputChange(field.id, e.target.value) : undefined}
          />
        )
      case "heading":
        return (
          <h2 className="text-xl font-bold font-heading select-none">
            {field.label}
          </h2>
        )
      case "paragraph":
        return (
          <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line select-none">
            {field.label}
          </p>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => {
              const currentValues = Array.isArray(previewFormData[field.id]) ? previewFormData[field.id] : []
              return (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 custom-form-checkbox focus:ring-0"
                    disabled={!isPreview}
                    checked={isPreview ? currentValues.includes(option) : false}
                    onChange={isPreview ? (e) => {
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option)
                      handlePreviewInputChange(field.id, newValues)
                    } : undefined}
                  />
                  <span className={isPreview ? "text-gray-700 dark:text-gray-300" : "text-sm text-gray-600 dark:text-gray-400"}>{option}</span>
                </label>
              )
            })}
          </div>
        )
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  className="border-gray-300 custom-form-radio focus:ring-0"
                  disabled={!isPreview}
                  checked={isPreview ? value === option : false}
                  onChange={isPreview ? () => handlePreviewInputChange(field.id, option) : undefined}
                />
                <span className={isPreview ? "text-gray-700 dark:text-gray-300" : "text-sm text-gray-600 dark:text-gray-400"}>{option}</span>
              </label>
            ))}
          </div>
        )
      case "select":
        return (
          <select 
            className={baseClasses} 
            disabled={!isPreview}
            value={value}
            onChange={isPreview ? (e) => handlePreviewInputChange(field.id, e.target.value) : undefined}
          >
            <option value="">Choose an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer ${
                  isPreview && Number(value) >= star ? "text-yellow-400 fill-yellow-400" : ""
                } ${isPreview ? "" : "pointer-events-none"}`}
                onClick={isPreview ? () => handlePreviewInputChange(field.id, star) : undefined}
              />
            ))}
          </div>
        )
      case "file":
        return (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${isPreview ? "hover:border-purple-400" : ""}`}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        )
      case "image":
        return (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${isPreview ? "hover:border-purple-400" : ""}`}
          >
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        )
      case "matrix": {
        const cols = field.columns || ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        const rows = field.rows || ["Statement 1", "Statement 2"]
        const matrixValue = isPreview ? (previewFormData[field.id] || {}) : {}
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 w-2/5 min-w-[120px]"></th>
                  {cols.map((col, i) => (
                    <th key={i} className="text-center py-2 px-1 font-medium text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-50 dark:bg-slate-700/30" : ""}>
                    <td className="py-2 pr-4 text-gray-700 dark:text-gray-300 text-sm">{row}</td>
                    {cols.map((col, colIdx) => (
                      <td key={colIdx} className="text-center py-2 px-1">
                        <input
                          type="radio"
                          name={`${field.id}_${rowIdx}`}
                          disabled={!isPreview}
                          checked={isPreview ? matrixValue[row] === col : false}
                          onChange={isPreview
                            ? () => handlePreviewInputChange(field.id, { ...matrixValue, [row]: col })
                            : undefined
                          }
                          className="border-gray-300 custom-form-radio focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      case "signature":
        return (
          <SignatureCanvas
            value={isPreview ? (previewFormData[field.id] || "") : ""}
            onChange={isPreview ? (val) => handlePreviewInputChange(field.id, val) : undefined}
            disabled={!isPreview}
          />
        )
      default:
        return <div className="text-gray-400 text-sm">Unknown field type</div>
    }
  }

  const selectedFieldData = fields.find((f) => f.id === selectedField)

  const renderLeftPanel = () => (
    <div className="bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-full overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Mobile/Tablet header */}
      {screenSize !== "desktop" && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Add Fields</h3>
          <button onClick={() => setShowLeftPanel(false)}>
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      )}

      {/* Tabs for mobile/tablet */}
      {screenSize !== "desktop" && (
        <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          {[
            { id: "fields", label: "Fields", icon: <Layers className="w-4 h-4" /> },
            { id: "design", label: "Design", icon: <Palette className="w-4 h-4" /> },
            { id: "logic", label: "Logic", icon: <Zap className="w-4 h-4" /> },
            { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex-shrink-0 flex items-center justify-center space-x-1 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {(screenSize === "desktop" || activeTab === "fields") && (
          <>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Field Types</h3>

            {/* Basic Fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Basic</h4>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes
                  .filter((f) => f.category === "basic")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-white dark:bg-slate-800 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600 dark:text-purple-400 mb-2">{fieldType.icon}</div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Choice Fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choice</h4>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes
                  .filter((f) => f.category === "choice")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-white dark:bg-slate-800 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600 dark:text-purple-400 mb-2">{fieldType.icon}</div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Advanced Fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Advanced</h4>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes
                  .filter((f) => f.category === "advanced")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-white dark:bg-slate-800 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600 dark:text-purple-400 mb-2">{fieldType.icon}</div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Layout Fields */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Layout & Text</h4>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes
                  .filter((f) => f.category === "layout")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-white dark:bg-slate-800 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600 dark:text-purple-400 mb-2">{fieldType.icon}</div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>
          </>
        )}
        {screenSize !== "desktop" && activeTab === "design" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Design Settings</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
              <select
                value={formSettings.theme}
                onChange={(e) => setFormSettings({ ...formSettings, theme: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Color</label>
              <input
                type="color"
                value={formSettings.backgroundColor}
                onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                className="w-full h-10 border border-gray-300 dark:border-slate-700 rounded bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Color</label>
              <input
                type="color"
                value={formSettings.textColor}
                onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                className="w-full h-10 border border-gray-300 dark:border-slate-700 rounded bg-transparent"
              />
            </div>
          </div>
        )}

        {screenSize !== "desktop" && activeTab === "logic" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Logic & Rules</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Conditional logic features coming soon!</p>
          </div>
        )}

        {screenSize !== "desktop" && activeTab === "settings" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Form Settings</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submit Button Text</label>
              <input
                type="text"
                value={formSettings.submitButtonText}
                onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thank You Message</label>
              <textarea
                value={formSettings.thankYouMessage}
                onChange={(e) => setFormSettings({ ...formSettings, thankYouMessage: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.collectEmail}
                  onChange={(e) => setFormSettings({ ...formSettings, collectEmail: e.target.checked })}
                  className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-transparent"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Collect email addresses</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.allowMultipleSubmissions}
                  onChange={(e) => setFormSettings({ ...formSettings, allowMultipleSubmissions: e.target.checked })}
                  className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-transparent"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow multiple submissions</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderRightPanel = () => (
    <div className="bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 h-full overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {screenSize !== "desktop" && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Properties</h3>
          <button onClick={() => setShowRightPanel(false)}>
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Field Properties</h3>

        {selectedFieldData ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {selectedFieldData.type === "heading" ? "Heading Text" : selectedFieldData.type === "paragraph" ? "Paragraph Text" : "Label"}
              </label>
              {selectedFieldData.type === "paragraph" ? (
                <textarea
                  value={selectedFieldData.label}
                  onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  value={selectedFieldData.label}
                  onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                />
              )}
            </div>

            {selectedFieldData.type !== "heading" && selectedFieldData.type !== "paragraph" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={selectedFieldData.description || ""}
                  onChange={(e) => updateField(selectedFieldData.id, { description: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                  placeholder="Optional field description"
                />
              </div>
            )}

            {(selectedFieldData.type === "text" ||
              selectedFieldData.type === "textarea" ||
              selectedFieldData.type === "email") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={selectedFieldData.placeholder || ""}
                  onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            {(selectedFieldData.type === "checkbox" ||
              selectedFieldData.type === "radio" ||
              selectedFieldData.type === "select") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Options</label>
                <div className="space-y-2">
                  {selectedFieldData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedFieldData.options || [])]
                          newOptions[index] = e.target.value
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="flex-1 p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedFieldData.options?.filter((_, i) => i !== index)
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [
                        ...(selectedFieldData.options || []),
                        `Option ${(selectedFieldData.options?.length || 0) + 1}`,
                      ]
                      updateField(selectedFieldData.id, { options: newOptions })
                    }}
                    className="w-full p-2 border border-dashed border-gray-300 dark:border-slate-600 bg-transparent rounded text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Option
                  </button>
                </div>
              </div>
            )}

            {selectedFieldData.type !== "heading" && selectedFieldData.type !== "paragraph" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedFieldData.required}
                  onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                  className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-transparent"
                />
                <label htmlFor="required" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Required field
                </label>
              </div>
            )}

            {/* Validation Rules */}
            {selectedFieldData.type !== "heading" && selectedFieldData.type !== "paragraph" && (
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Validation</h4>

                {selectedFieldData.type === "text" && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min Length</label>
                      <input
                        type="number"
                        value={selectedFieldData.validation?.minLength || ""}
                        onChange={(e) =>
                          updateField(selectedFieldData.id, {
                            validation: {
                              ...selectedFieldData.validation,
                              minLength: Number.parseInt(e.target.value) || undefined,
                            },
                          })
                        }
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Length</label>
                      <input
                        type="number"
                        value={selectedFieldData.validation?.maxLength || ""}
                        onChange={(e) =>
                          updateField(selectedFieldData.id, {
                            validation: {
                              ...selectedFieldData.validation,
                              maxLength: Number.parseInt(e.target.value) || undefined,
                            },
                          })
                        }
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded text-sm"
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MousePointer className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Select a field to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderDesignPanel = () => (
    <div className="bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 h-full overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Design Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {["modern", "classic", "minimal"].map((theme) => (
                <button
                  key={theme}
                  className={`p-3 border rounded-lg text-center text-sm capitalize transition-colors ${
                    formSettings.theme === theme
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400"
                      : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
                  onClick={() => setFormSettings({ ...formSettings, theme: theme })}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formSettings.backgroundColor}
                onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                className="w-10 h-10 border border-gray-300 dark:border-slate-700 rounded bg-transparent"
              />
              <input
                type="text"
                value={formSettings.backgroundColor}
                onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                className="flex-1 p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formSettings.textColor}
                onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                className="w-10 h-10 border border-gray-300 dark:border-slate-700 rounded bg-transparent"
              />
              <input
                type="text"
                value={formSettings.textColor}
                onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                className="flex-1 p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary / Accent Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formSettings.primaryColor || "#7c3aed"}
                onChange={(e) => setFormSettings({ ...formSettings, primaryColor: e.target.value })}
                className="w-10 h-10 border border-gray-300 dark:border-slate-700 rounded bg-transparent"
              />
              <input
                type="text"
                value={formSettings.primaryColor || "#7c3aed"}
                onChange={(e) => setFormSettings({ ...formSettings, primaryColor: e.target.value })}
                className="flex-1 p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
            <select
              value={formSettings.fontFamily || "Inter"}
              onChange={(e) => setFormSettings({ ...formSettings, fontFamily: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
            >
              <option value="Inter">Inter (Sans-serif)</option>
              <option value="Roboto">Roboto (Sans-serif)</option>
              <option value="Montserrat">Montserrat (Modern Sans)</option>
              <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
              <option value="JetBrains Mono">JetBrains Mono (Monospace)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Corner Roundness</label>
            <select
              value={formSettings.borderRadius || "rounded-xl"}
              onChange={(e) => setFormSettings({ ...formSettings, borderRadius: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
            >
              <option value="rounded-none">Sharp Corners (rounded-none)</option>
              <option value="rounded-md">Subtle (rounded-md)</option>
              <option value="rounded-lg">Medium (rounded-lg)</option>
              <option value="rounded-xl">Curved (rounded-xl)</option>
              <option value="rounded-3xl">Pill-shaped (rounded-3xl)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Container Shadow</label>
            <select
              value={formSettings.shadowStyle || "shadow-md"}
              onChange={(e) => setFormSettings({ ...formSettings, shadowStyle: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
            >
              <option value="shadow-none">Flat (no shadow)</option>
              <option value="shadow-sm">Subtle (shadow-sm)</option>
              <option value="shadow-md">Medium (shadow-md)</option>
              <option value="shadow-lg">Large (shadow-lg)</option>
              <option value="shadow-xl">Extra Large (shadow-xl)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submit Button Text</label>
            <input
              type="text"
              value={formSettings.submitButtonText}
              onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thank You Message</label>
            <textarea
              value={formSettings.thankYouMessage}
              onChange={(e) => setFormSettings({ ...formSettings, thankYouMessage: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom CSS</label>
            <textarea
              value={formSettings.customCSS || ""}
              onChange={(e) => setFormSettings({ ...formSettings, customCSS: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 font-mono text-xs"
              rows={4}
              placeholder="/* Enter custom CSS rules here (e.g. .custom-form-input { ... }) */"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom JavaScript</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Runs when the form loads. Use <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">document.querySelector</code> to target elements.</p>
            <textarea
              value={formSettings.customJS || ""}
              onChange={(e) => setFormSettings({ ...formSettings, customJS: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 font-mono text-xs"
              rows={4}
              placeholder="// Enter custom JavaScript here\n// e.g. console.log('Form loaded');"
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Logic rule CRUD handlers
  const handleAddRule = () => {
    const sourceFieldId = fields[0]?.id || ""
    const targetFieldId = fields[1]?.id || fields[0]?.id || ""
    setRuleForm({
      fieldId: sourceFieldId,
      condition: "equals",
      value: "",
      action: "show",
      targetFieldId: targetFieldId,
    })
    setEditingRuleId("new")
  }

  const handleEditRule = (rule) => {
    setRuleForm({ ...rule })
    setEditingRuleId(rule.id)
  }

  const handleDeleteRule = (ruleId) => {
    const updatedRules = (formSettings.logicRules || []).filter(r => r.id !== ruleId)
    setFormSettings({ ...formSettings, logicRules: updatedRules })
  }

  const handleSaveRule = () => {
    if (!ruleForm.fieldId || !ruleForm.targetFieldId) {
      alert("Please select both a source field and a target field.")
      return
    }
    if (ruleForm.fieldId === ruleForm.targetFieldId) {
      alert("Source field and target field cannot be the same.")
      return
    }

    const currentRules = formSettings.logicRules || []
    let updatedRules

    if (editingRuleId === "new") {
      const newRule = {
        ...ruleForm,
        id: Math.random().toString(36).substring(2, 9),
      }
      updatedRules = [...currentRules, newRule]
    } else {
      updatedRules = currentRules.map(r => r.id === editingRuleId ? { ...ruleForm, id: editingRuleId } : r)
    }

    setFormSettings({ ...formSettings, logicRules: updatedRules })
    setEditingRuleId(null)
  }

  // Desktop logic panel
  const renderLogicPanel = () => (
    <div className="bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 h-full overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Logic & Rules</h3>

        {editingRuleId !== null ? (
          <div className="p-4 border border-purple-200 dark:border-purple-900/50 rounded-xl bg-purple-50/30 dark:bg-purple-950/10 space-y-4">
            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-400">
              {editingRuleId === "new" ? "Create Logic Rule" : "Edit Logic Rule"}
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  If Field
                </label>
                <select
                  value={ruleForm.fieldId}
                  onChange={(e) => setRuleForm({ ...ruleForm, fieldId: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Field</option>
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>{f.label || `Field (${f.type})`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Condition
                </label>
                <select
                  value={ruleForm.condition}
                  onChange={(e) => setRuleForm({ ...ruleForm, condition: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="equals">is equal to</option>
                  <option value="not_equals">is not equal to</option>
                  <option value="contains">contains</option>
                  <option value="greater_than">is greater than</option>
                  <option value="less_than">is less than</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Value
                </label>
                {(() => {
                  const selectedF = fields.find(f => f.id === ruleForm.fieldId)
                  if (selectedF && selectedF.options && selectedF.options.length > 0) {
                    return (
                      <select
                        value={ruleForm.value}
                        onChange={(e) => setRuleForm({ ...ruleForm, value: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Option</option>
                        {selectedF.options.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )
                  }
                  return (
                    <input
                      type="text"
                      value={ruleForm.value}
                      onChange={(e) => setRuleForm({ ...ruleForm, value: e.target.value })}
                      placeholder="e.g. Yes"
                      className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  )
                })()}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Action
                </label>
                <select
                  value={ruleForm.action}
                  onChange={(e) => setRuleForm({ ...ruleForm, action: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Target Field
                </label>
                <select
                  value={ruleForm.targetFieldId}
                  onChange={(e) => setRuleForm({ ...ruleForm, targetFieldId: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Target Field</option>
                  {fields.filter(f => f.id !== ruleForm.fieldId).map(f => (
                    <option key={f.id} value={f.id}>{f.label || `Field (${f.type})`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveRule}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-semibold transition-colors"
              >
                Save Rule
              </button>
              <button
                onClick={() => setEditingRuleId(null)}
                className="flex-1 py-2 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 bg-transparent rounded text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleAddRule}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Logic Rule</span>
            </button>

            {(formSettings.logicRules || []).length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-800/50">
                <Zap className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No logic rules yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto">
                  Show or hide fields dynamically based on user responses.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(formSettings.logicRules || []).map((rule) => {
                  const sourceField = fields.find(f => f.id === rule.fieldId)
                  const targetField = fields.find(f => f.id === rule.targetFieldId)

                  return (
                    <div key={rule.id} className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-200 dark:hover:border-purple-900 bg-white dark:bg-slate-800/80 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
                          Rule
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditRule(rule)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                            title="Edit rule"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                        <p>
                          <span className="font-semibold text-gray-900 dark:text-white">IF </span>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">"{sourceField?.label || "Unknown Field"}"</span>
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {rule.condition === "equals" && "is equal to"}
                          {rule.condition === "not_equals" && "is not equal to"}
                          {rule.condition === "contains" && "contains"}
                          {rule.condition === "greater_than" && "is greater than"}
                          {rule.condition === "less_than" && "is less than"}
                          <span className="font-semibold text-gray-900 dark:text-white ml-1">"{rule.value}"</span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-900 dark:text-white">THEN </span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{rule.action.toUpperCase()} </span>
                          <span className="text-gray-900 dark:text-white font-medium">"{targetField?.label || "Unknown Field"}"</span>
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Desktop settings panel
  const renderSettingsPanel = () => (
    <div className="bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 h-full overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Form Settings</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submission Settings</h4>
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.collectEmail}
                  onChange={(e) => setFormSettings({ ...formSettings, collectEmail: e.target.checked })}
                  className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-transparent"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Collect email addresses</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.allowMultipleSubmissions}
                  onChange={(e) => setFormSettings({ ...formSettings, allowMultipleSubmissions: e.target.checked })}
                  className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-transparent"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow multiple submissions</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notifications</h4>
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-transparent" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email notifications on submission</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Privacy</h4>
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 bg-transparent" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable GDPR compliance features</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile field editor
  const renderMobileFieldEditor = () => {
    if (!selectedFieldData) return null

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <button onClick={() => setShowMobileFieldOptions(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-gray-900 dark:text-white">Edit {selectedFieldData.label}</h3>
            <button
              onClick={() => {
                setShowMobileFieldOptions(false)
                setSelectedField(null)
              }}
              className="p-2 text-purple-600 dark:text-purple-400 font-medium"
            >
              Done
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Field Type</label>
              <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center">
                {fieldTypes.find((f) => f.type === selectedFieldData.type)?.icon}
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {fieldTypes.find((f) => f.type === selectedFieldData.type)?.label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label</label>
              <input
                type="text"
                value={selectedFieldData.label}
                onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={selectedFieldData.description || ""}
                onChange={(e) => updateField(selectedFieldData.id, { description: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={2}
                placeholder="Add a description (optional)"
              />
            </div>

            {(selectedFieldData.type === "text" ||
              selectedFieldData.type === "textarea" ||
              selectedFieldData.type === "email") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={selectedFieldData.placeholder || ""}
                  onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter placeholder text"
                />
              </div>
            )}

            {(selectedFieldData.type === "checkbox" ||
              selectedFieldData.type === "radio" ||
              selectedFieldData.type === "select") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</label>
                <div className="space-y-2">
                  {selectedFieldData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedFieldData.options || [])]
                          newOptions[index] = e.target.value
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="flex-1 p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedFieldData.options?.filter((_, i) => i !== index)
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="p-3 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [
                        ...(selectedFieldData.options || []),
                        `Option ${(selectedFieldData.options?.length || 0) + 1}`,
                      ]
                      updateField(selectedFieldData.id, { options: newOptions })
                    }}
                    className="w-full p-3 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/10 flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Option
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4">
              <label className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedFieldData.required}
                  onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                  className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 w-5 h-5 bg-transparent"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Required field</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-slate-700 mt-6">
              <button
                onClick={() => deleteField(selectedFieldData.id)}
                className="w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Field
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile context menu
  const renderMobileContextMenu = () => {
    if (!showMobileContextMenu) return null

    const fieldId = showMobileContextMenu
    const field = fields.find((f) => f.id === fieldId)
    if (!field) return null

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-30" onClick={() => setShowMobileContextMenu(null)}>
        <div
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-t-xl p-4 space-y-2 border-t border-gray-200 dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1 bg-gray-300 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>

          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{field.label}</h3>

          <button
            onClick={() => {
              setSelectedField(fieldId)
              setShowMobileFieldOptions(true)
              setShowMobileContextMenu(null)
            }}
            className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"
          >
            <Edit2 className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span>Edit field</span>
          </button>

          <button
            onClick={() => {
              duplicateField(fieldId)
            }}
            className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"
          >
            <Copy className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={() => {
              deleteField(fieldId)
            }}
            className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-5 h-5 mr-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    )
  }

  // Mobile design editor
  const renderMobileDesignEditor = () => {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <button onClick={() => setMobileEditMode("fields")} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-gray-900 dark:text-white">Design</h3>
            <button onClick={() => setMobileEditMode("fields")} className="p-2 text-purple-600 dark:text-purple-400 font-medium">
              Done
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                {["modern", "classic", "minimal"].map((theme) => (
                  <button
                    key={theme}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      formSettings.theme === theme
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                    }`}
                    onClick={() => setFormSettings({ ...formSettings, theme: theme })}
                  >
                    <div className="h-12 mb-2 flex items-center justify-center">
                      <Layout className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="text-sm capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Colors</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Background</label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 flex-shrink-0"
                      style={{ backgroundColor: formSettings.backgroundColor }}
                    ></div>
                    <input
                      type="color"
                      value={formSettings.backgroundColor}
                      onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                      className="sr-only"
                      id="bg-color-picker"
                    />
                    <label
                      htmlFor="bg-color-picker"
                      className="flex-1 p-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer"
                    >
                      {formSettings.backgroundColor}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Text</label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 flex-shrink-0"
                      style={{ backgroundColor: formSettings.textColor }}
                    ></div>
                    <input
                      type="color"
                      value={formSettings.textColor}
                      onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                      className="sr-only"
                      id="text-color-picker"
                    />
                    <label
                      htmlFor="text-color-picker"
                      className="flex-1 p-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer"
                    >
                      {formSettings.textColor}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Primary / Accent</label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 flex-shrink-0"
                      style={{ backgroundColor: formSettings.primaryColor || "#7c3aed" }}
                    ></div>
                    <input
                      type="color"
                      value={formSettings.primaryColor || "#7c3aed"}
                      onChange={(e) => setFormSettings({ ...formSettings, primaryColor: e.target.value })}
                      className="sr-only"
                      id="primary-color-picker"
                    />
                    <label
                      htmlFor="primary-color-picker"
                      className="flex-1 p-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer"
                    >
                      {formSettings.primaryColor || "#7c3aed"}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Typography & Shape</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Font Family</label>
                  <select
                    value={formSettings.fontFamily || "Inter"}
                    onChange={(e) => setFormSettings({ ...formSettings, fontFamily: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm"
                  >
                    <option value="Inter">Inter (Sans-serif)</option>
                    <option value="Roboto">Roboto (Sans-serif)</option>
                    <option value="Montserrat">Montserrat (Modern Sans)</option>
                    <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                    <option value="JetBrains Mono">JetBrains Mono (Monospace)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Corner Roundness</label>
                  <select
                    value={formSettings.borderRadius || "rounded-xl"}
                    onChange={(e) => setFormSettings({ ...formSettings, borderRadius: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm"
                  >
                    <option value="rounded-none">Sharp Corners (rounded-none)</option>
                    <option value="rounded-md">Subtle (rounded-md)</option>
                    <option value="rounded-lg">Medium (rounded-lg)</option>
                    <option value="rounded-xl">Curved (rounded-xl)</option>
                    <option value="rounded-3xl">Pill-shaped (rounded-3xl)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Container Shadow</label>
                  <select
                    value={formSettings.shadowStyle || "shadow-md"}
                    onChange={(e) => setFormSettings({ ...formSettings, shadowStyle: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm"
                  >
                    <option value="shadow-none">Flat (no shadow)</option>
                    <option value="shadow-sm">Subtle (shadow-sm)</option>
                    <option value="shadow-md">Medium (shadow-md)</option>
                    <option value="shadow-lg">Large (shadow-lg)</option>
                    <option value="shadow-xl">Extra Large (shadow-xl)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Button</h4>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Submit Button Text</label>
                <input
                  type="text"
                  value={formSettings.submitButtonText}
                  onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Confirmation</h4>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Thank You Message</label>
                <textarea
                  value={formSettings.thankYouMessage}
                  onChange={(e) => setFormSettings({ ...formSettings, thankYouMessage: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Custom CSS</h4>
              <div>
                <textarea
                  value={formSettings.customCSS || ""}
                  onChange={(e) => setFormSettings({ ...formSettings, customCSS: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-mono text-xs"
                  rows={4}
                  placeholder="/* Enter custom CSS rules here */"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Custom JavaScript</h4>
              <div>
                <textarea
                  value={formSettings.customJS || ""}
                  onChange={(e) => setFormSettings({ ...formSettings, customJS: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-mono text-xs"
                  rows={4}
                  placeholder="// Enter custom JavaScript here"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile settings editor
  const renderMobileSettingsEditor = () => {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <button onClick={() => setMobileEditMode("fields")} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
            <button onClick={() => setMobileEditMode("fields")} className="p-2 text-purple-600 dark:text-purple-400 font-medium">
              Done
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Submission Settings</h4>
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formSettings.collectEmail}
                    onChange={(e) => setFormSettings({ ...formSettings, collectEmail: e.target.checked })}
                    className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 w-5 h-5 bg-transparent"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Collect email addresses</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Require respondents to sign in</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 pt-2 border-t border-gray-200 dark:border-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={formSettings.allowMultipleSubmissions}
                    onChange={(e) => setFormSettings({ ...formSettings, allowMultipleSubmissions: e.target.checked })}
                    className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 w-5 h-5 bg-transparent"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Allow multiple submissions</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Users can submit more than once</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Notifications</h4>
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 w-5 h-5 bg-transparent"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Email notifications</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Get notified when someone submits your form</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Privacy</h4>
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 w-5 h-5 bg-transparent"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">GDPR compliance</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Add privacy policy and consent checkboxes</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Floating Action Button
  const renderMobileFAB = () => {
    if (!showMobileFAB || !isMobile) return null

    return (
      <>
        {/* FAB Backdrop */}
        <AnimatePresence>
          {isFABOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFABOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* FAB Container */}
        <div className="fixed bottom-20 right-4 z-50">
          {/* Action Buttons */}
          <AnimatePresence>
            {isFABOpen && (
              <motion.div
                className="flex flex-col space-y-3 mb-3"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {mobileActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    className={`${action.color} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center min-w-[48px] h-12`}
                    onClick={() => {
                      action.action()
                      setIsFABOpen(false)
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.icon}
                    <span className="ml-2 text-sm font-medium whitespace-nowrap">{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <motion.button
            className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all ${
              isFABOpen ? "rotate-45" : "rotate-0"
            }`}
            onClick={() => setIsFABOpen(!isFABOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isFABOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Responsive Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-2 sm:p-3 lg:p-4 flex-shrink-0 transition-colors duration-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-1 min-w-0">
              {isMobile && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg flex-shrink-0 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className={`font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1 min-w-0 text-gray-900 dark:text-white ${
                  screenSize === "mobile-sm"
                    ? "text-sm"
                    : screenSize === "mobile"
                      ? "text-base"
                      : screenSize.includes("tablet")
                        ? "text-lg"
                        : "text-lg lg:text-xl"
                }`}
                placeholder="Form Title"
              />
              <span
                className={`text-gray-500 dark:text-gray-400 flex-shrink-0 whitespace-nowrap ${
                  screenSize === "mobile-sm" ? "text-xs" : "text-xs lg:text-sm"
                }`}
              >
                • Draft
              </span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Desktop controls */}
              {!isMobile && (
                <>
                  <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1 transition-colors">
                    <button
                      className={`p-2 rounded transition-colors ${previewMode === "desktop" ? "bg-white dark:bg-slate-600 shadow-sm text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                      onClick={() => setPreviewMode("desktop")}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded transition-colors ${previewMode === "tablet" ? "bg-white dark:bg-slate-600 shadow-sm text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                      onClick={() => setPreviewMode("tablet")}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded transition-colors ${previewMode === "mobile" ? "bg-white dark:bg-slate-600 shadow-sm text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                      onClick={() => setPreviewMode("mobile")}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg p-0.5 mr-1 bg-gray-50/50 dark:bg-slate-800 transition-colors">
                    <button
                      onClick={undo}
                      disabled={historyPointer <= 0}
                      title="Undo (Ctrl+Z)"
                      className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      <Undo className="w-4 h-4" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyPointer >= history.length - 1}
                      title="Redo (Ctrl+Y)"
                      className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      <Redo className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      showPreview ? "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600" : "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-950/60"
                    }`}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="w-4 h-4 mr-2 inline" />
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                </>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0 ${
                  screenSize === "mobile-sm"
                    ? "px-2 py-1.5 text-xs"
                    : screenSize === "mobile"
                      ? "px-3 py-2 text-sm"
                      : "px-3 lg:px-4 py-2 text-sm"
                }`}
              >
                <Save className={`mr-1 lg:mr-2 inline ${screenSize === "mobile-sm" ? "w-3 h-3" : "w-4 h-4"}`} />
                <span className={screenSize.includes("mobile") ? "hidden sm:inline" : "hidden lg:inline"}>
                  {saving ? "Saving..." : formStatus === "published" ? "Save Changes" : "Save"}
                </span>
              </button>

              {formStatus === "published" ? (
                <button
                  onClick={() => setShowShareModal(true)}
                  className={`bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex-shrink-0 ${
                    screenSize === "mobile-sm"
                      ? "px-2 py-1.5 text-xs"
                      : screenSize === "mobile"
                        ? "px-3 py-2 text-sm"
                        : "px-3 lg:px-4 py-2 text-sm"
                  }`}
                >
                  <Share2 className={`mr-1 lg:mr-2 inline ${screenSize === "mobile-sm" ? "w-3 h-3" : "w-4 h-4"}`} />
                  <span className={screenSize.includes("mobile") ? "hidden sm:inline" : "hidden lg:inline"}>Share</span>
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className={`bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 flex-shrink-0 ${
                    screenSize === "mobile-sm"
                      ? "px-2 py-1.5 text-xs"
                      : screenSize === "mobile"
                        ? "px-3 py-2 text-sm"
                        : "px-3 lg:px-4 py-2 text-sm"
                  }`}
                >
                  <Globe className={`mr-1 lg:mr-2 inline ${screenSize === "mobile-sm" ? "w-3 h-3" : "w-4 h-4"}`} />
                  <span className={screenSize.includes("mobile") ? "hidden sm:inline" : "hidden lg:inline"}>Publish</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Desktop with responsive width */}
          {!isMobile && (
            <div className={`flex-shrink-0 ${screenSize === "desktop-sm" ? "w-56" : "w-64"}`}>{renderLeftPanel()}</div>
          )}

          {/* Form Canvas with responsive width */}
          <div className="flex-1 overflow-auto min-w-0">
            {/* Mobile/Tablet: Show preview or builder */}
            {isMobile ? (
              <div className="h-full">
                {showMobilePreview ? (
                  // Mobile/Tablet Preview Mode
                  <div className={`bg-gray-50 dark:bg-slate-900 h-full ${screenSize.includes("mobile") ? "p-2 sm:p-4" : "p-4 lg:p-6"} transition-colors duration-200`}>
                    <div
                      className={`mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors duration-200 ${
                        screenSize === "mobile-sm"
                          ? "max-w-full"
                          : screenSize === "mobile"
                            ? "max-w-sm"
                            : screenSize.includes("tablet")
                              ? "max-w-2xl"
                              : "max-w-3xl"
                      }`}
                      style={{
                        backgroundColor: (document.documentElement.classList.contains("dark") && formSettings.backgroundColor === "#ffffff") ? undefined : formSettings.backgroundColor,
                        color: (document.documentElement.classList.contains("dark") && formSettings.textColor === "#111827") ? undefined : formSettings.textColor,
                        fontFamily: formSettings.fontFamily || "Inter",
                      }}
                    >
                      <div className={`${screenSize.includes("mobile") ? "p-4 sm:p-6" : "p-6 lg:p-8"}`}>
                        <div className="mb-6">
                          <h1
                            className={`font-bold mb-2 ${
                              screenSize === "mobile-sm"
                                ? "text-lg"
                                : screenSize === "mobile"
                                  ? "text-xl"
                                  : "text-xl lg:text-2xl"
                            }`}
                          >
                            {formTitle}
                          </h1>
                          {formDescription && (
                            <p
                              className={`text-gray-600 dark:text-gray-300 ${
                                screenSize.includes("mobile") ? "text-sm" : "text-sm lg:text-base"
                              }`}
                            >
                              {formDescription}
                            </p>
                          )}
                        </div>

                        <div className="space-y-4">
                          {fields.length === 0 ? (
                            <div className="text-center py-8">
                              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-600 dark:text-gray-400 text-sm">No fields added yet</p>
                            </div>
                          ) : (
                            fields.map((field) => (
                              <div key={field.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-900 dark:text-slate-100">
                                  {field.label}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {field.description && <p className="text-xs text-gray-600 dark:text-gray-400">{field.description}</p>}
                                {renderField(field, true)}
                              </div>
                            ))
                          )}
                        </div>

                        {fields.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold">
                              {formSettings.submitButtonText}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mobile/Tablet Builder Mode
                  <div className="p-4 h-full">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 h-full">
                      <div className="p-4 h-full overflow-y-auto" ref={fieldContainerRef}>
                        <div className="mb-6">
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className={`font-bold w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 mb-2 ${
                              screenSize === "mobile" ? "text-xl" : "text-2xl"
                            }`}
                            placeholder="Form Title"
                          />
                          <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="w-full text-gray-600 dark:text-gray-300 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none text-sm"
                            placeholder="Add a description..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-4">
                          {fields.length === 0 ? (
                            <div className="text-center py-8">
                              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                              <h3
                                className={`font-medium text-gray-900 dark:text-white mb-2 ${
                                  screenSize === "mobile" ? "text-lg" : "text-xl"
                                }`}
                              >
                                Start building
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Tap the + button to add your first field</p>
                              <button
                                onClick={() => setIsFABOpen(true)}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                              >
                                <Plus className="w-4 h-4 mr-2 inline" />
                                Add Field
                              </button>
                            </div>
                          ) : (
                            fields.map((field, index) => {
                              const visible = !showPreview || isFieldVisible(field.id, formSettings.logicRules, previewFormData);
                              if (!visible) return null;
                              return (
                                <motion.div
                                  key={field.id}
                                  id={`field-${field.id}`}
                                  className={`field-item relative p-3 border-2 rounded-lg transition-all ${
                                    selectedField === field.id 
                                      ? "border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20" 
                                      : "border-gray-200 dark:border-slate-700"
                                  }`}
                                  onClick={() => setSelectedField(field.id)}
                                  onTouchStart={() => handleTouchDragStart(index)}
                                  onTouchMove={(e) => handleTouchDragMove(e, index)}
                                  onTouchEnd={handleTouchDragEnd}
                                  layout
                                >
                                  {field.type !== "heading" && field.type !== "paragraph" && (
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-900 dark:text-slate-100 mb-1">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                      </label>
                                      {field.description && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{field.description}</p>
                                      )}
                                    </div>
                                  )}

                                  {renderField(field, showPreview)}

                                  <div className="absolute top-2 right-2 flex space-x-1">
                                    <button
                                      className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full hover:bg-gray-50 dark:hover:bg-slate-600 shadow-sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedField(field.id)
                                        setShowMobileFieldOptions(true)
                                      }}
                                    >
                                      <Edit2 className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                                    </button>
                                    <button
                                      className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full hover:bg-gray-50 dark:hover:bg-slate-600 shadow-sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setShowMobileContextMenu(field.id)
                                      }}
                                    >
                                      <MoreVertical className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                                    </button>
                                  </div>
                                </motion.div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Desktop Layout
              <div className={`${screenSize === "desktop-sm" ? "p-3 lg:p-6" : "p-4 lg:p-8"} h-full overflow-y-auto`}>
                <div
                  className={`mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-all duration-300 ${formSettings.borderRadius || "rounded-lg"} ${formSettings.shadowStyle || "shadow-sm"} ${
                    previewMode === "mobile"
                      ? "max-w-sm"
                      : previewMode === "tablet"
                        ? "max-w-2xl"
                        : screenSize === "desktop-sm"
                          ? "max-w-5xl"
                          : "max-w-6xl"
                  }`}
                  style={{
                    backgroundColor: formSettings.backgroundColor,
                    color: formSettings.textColor,
                    fontFamily: formSettings.fontFamily || "Inter",
                  }}
                >
                  {/* Dynamic Style Tag for Custom Primary Color focus states and fonts */}
                  <style dangerouslySetInnerHTML={{__html: `
                    .custom-form-input:focus {
                      border-color: ${formSettings.primaryColor || '#7c3aed'} !important;
                      box-shadow: 0 0 0 2px ${(formSettings.primaryColor || '#7c3aed')}33 !important;
                    }
                    .custom-form-checkbox:checked {
                      background-color: ${formSettings.primaryColor || '#7c3aed'} !important;
                      border-color: ${formSettings.primaryColor || '#7c3aed'} !important;
                    }
                    .custom-form-radio:checked {
                      border-color: ${formSettings.primaryColor || '#7c3aed'} !important;
                    }
                    .custom-form-radio:checked::after {
                      background-color: ${formSettings.primaryColor || '#7c3aed'} !important;
                    }
                    ${formSettings.customCSS || ""}
                  `}} />
                  {/* Form Header */}
                  <div className="p-4 lg:p-8">
                    {/* Form Header */}
                    <div className="mb-8">
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="text-2xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 mb-2 dark:text-white"
                        placeholder="Form Title"
                        style={{ color: formSettings.textColor }}
                      />
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full text-gray-600 dark:text-gray-300 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none"
                        placeholder="Add a description for your form..."
                        rows={2}
                      />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      {fields.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start building your form</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">Add fields from the left panel to get started</p>
                        </div>
                      ) : (
                        fields.map((field, index) => {
                          const visible = !showPreview || isFieldVisible(field.id, formSettings.logicRules, previewFormData);
                          if (!visible) return null;
                          return (
                            <motion.div
                              key={field.id}
                              className={`group relative p-4 border-2 rounded-lg transition-all ${
                                selectedField === field.id
                                  ? "border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20"
                                  : "border-transparent hover:border-gray-200 dark:hover:border-slate-600"
                              }`}
                              onClick={() => setSelectedField(field.id)}
                              draggable={!showPreview}
                              onDragStart={() => handleDragStart(index)}
                              onDragEnter={() => handleDragEnter(index)}
                              onDragEnd={handleDragEnd}
                              layout
                            >
                              {!showPreview && (
                                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                </div>
                              )}

                              {field.type !== "heading" && field.type !== "paragraph" && (
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-900 dark:text-slate-100 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </label>
                                  {field.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{field.description}</p>}
                                </div>
                              )}

                              {renderField(field, showPreview)}

                              {!showPreview && selectedField === field.id && (
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <button
                                    className="p-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-600"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      duplicateField(field.id)
                                    }}
                                  >
                                    <Copy className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                                  </button>
                                  <button
                                    className="p-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-800"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteField(field.id)
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          )
                        })
                      )}
                    </div>

                    {showPreview && fields.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                        <button
                          className="text-white px-8 py-3 font-semibold hover:shadow-lg transition-all"
                          style={{
                            backgroundColor: formSettings.primaryColor || "#7c3aed",
                            borderRadius: formSettings.borderRadius === "rounded-none" ? "0px" : formSettings.borderRadius === "rounded-md" ? "6px" : formSettings.borderRadius === "rounded-lg" ? "8px" : formSettings.borderRadius === "rounded-xl" ? "12px" : formSettings.borderRadius === "rounded-3xl" ? "24px" : "12px",
                          }}
                        >
                          {formSettings.submitButtonText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Desktop with responsive width */}
          {!isMobile && !showPreview && (
            <div className={`flex-shrink-0 ${screenSize === "desktop-sm" ? "w-72" : "w-80"}`}>
              {/* Desktop tabs */}
              <div className="bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 h-full transition-colors duration-200">
                <div className="flex border-b border-gray-200 dark:border-slate-700">
                  {[
                    { id: "properties", label: "Properties", icon: <Sliders className="w-4 h-4" /> },
                    { id: "design", label: "Design", icon: <Palette className="w-4 h-4" /> },
                    { id: "logic", label: "Logic", icon: <Zap className="w-4 h-4" /> },
                    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 text-xs font-medium ${
                        activeTab === tab.id
                          ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {activeTab === "properties" && renderRightPanel()}
                {activeTab === "design" && renderDesignPanel()}
                {activeTab === "logic" && renderLogicPanel()}
                {activeTab === "settings" && renderSettingsPanel()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Panels with responsive widths */}
      <AnimatePresence>
        {isMobile && showLeftPanel && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLeftPanel(false)}
          >
            <motion.div
              className={`absolute left-0 top-0 bottom-0 ${
                screenSize === "mobile-sm"
                  ? "w-full max-w-[95vw]"
                  : screenSize === "mobile"
                    ? "w-80 max-w-[90vw]"
                    : "w-96 max-w-[85vw]"
              }`}
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderLeftPanel()}
            </motion.div>
          </motion.div>
        )}

        {isMobile && showRightPanel && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRightPanel(false)}
          >
            <motion.div
              className={`absolute right-0 top-0 bottom-0 ${
                screenSize === "mobile-sm"
                  ? "w-full max-w-[95vw]"
                  : screenSize === "mobile"
                    ? "w-80 max-w-[90vw]"
                    : "w-96 max-w-[85vw]"
              }`}
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderRightPanel()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}

      {/* Mobile Floating Action Button */}
      {renderMobileFAB()}

      {/* Mobile-specific overlays */}
      {isMobile && showMobileFieldOptions && renderMobileFieldEditor()}
      {isMobile && mobileEditMode === "design" && renderMobileDesignEditor()}
      {isMobile && mobileEditMode === "settings" && renderMobileSettingsEditor()}
      {isMobile && renderMobileContextMenu()}

      <AnimatePresence>
        {showShareModal && renderShareModal()}
      </AnimatePresence>
    </div>
  )
}
