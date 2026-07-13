"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  BarChart3,
  Calendar,
  X,
  Grid,
  ListIcon,
  Folder,
  Tag,
  Archive,
  FileText,
  FolderPlus,
  TagIcon,
  SlidersHorizontal,
  CheckSquare,
  Square,
  ArrowDown,
  ArrowUp,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"
import { useForms } from "../hooks/use-forms"
import { db } from "../lib/firebase"
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"
import { useAuth } from "../hooks/use-auth"

export default function Forms() {
  const { user } = useAuth()
  const { forms, loading: formsLoading, deleteForm, duplicateForm } = useForms()
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(null)
  const [viewMode, setViewMode] = useState("list")
  const [sortBy, setSortBy] = useState("recent")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedForms, setSelectedForms] = useState([])
  const [selectMode, setSelectMode] = useState(false)
  const [showBatchActions, setShowBatchActions] = useState(false)
  const [folders, setFolders] = useState([
    { id: "all", name: "All Forms", count: 0 },
    { id: "recent", name: "Recent", count: 0 },
    { id: "starred", name: "Starred", count: 0 },
    { id: "shared", name: "Shared with me", count: 0 },
    { id: "archived", name: "Archived", count: 0 },
  ])
  const [tags, setTags] = useState([
    { id: "survey", name: "Survey", color: "blue" },
    { id: "contact", name: "Contact", color: "green" },
    { id: "event", name: "Event", color: "purple" },
    { id: "feedback", name: "Feedback", color: "orange" },
    { id: "application", name: "Application", color: "pink" },
  ])
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [selectedTag, setSelectedTag] = useState(null)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("blue")
  const [showSidebar] = useState(true)
  const navigate = useNavigate()
  const mobileActionsRef = useRef(null)

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

  // Update folder counts
  useEffect(() => {
    if (forms.length > 0) {
      const recentForms = forms.filter(
        (form) => form.updatedAt && new Date(form.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ).length
      const starredForms = forms.filter((form) => form.starred).length
      const sharedForms = forms.filter((form) => form.shared).length
      const archivedForms = forms.filter((form) => form.archived).length

      setFolders([
        { id: "all", name: "All Forms", count: forms.length },
        { id: "recent", name: "Recent", count: recentForms },
        { id: "starred", name: "Starred", count: starredForms },
        { id: "shared", name: "Shared with me", count: sharedForms },
        { id: "archived", name: "Archived", count: archivedForms },
      ])
    }
  }, [forms])

  // Filter forms based on search, folder, tag, and status
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || form.status === filterStatus

    const matchesFolder = (() => {
      switch (selectedFolder) {
        case "all":
          return !form.archived
        case "recent":
          return (
            form.updatedAt &&
            new Date(form.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
            !form.archived
          )
        case "starred":
          return form.starred && !form.archived
        case "shared":
          return form.shared && !form.archived
        case "archived":
          return form.archived
        default:
          return form.folder === selectedFolder && !form.archived
      }
    })()

    const matchesTag = selectedTag ? form.tags?.includes(selectedTag) : true

    return matchesSearch && matchesStatus && matchesFolder && matchesTag
  })

  // Sort forms based on selected option and direction
  const sortedForms = [...filteredForms].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "recent":
        comparison = new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        break
      case "responses":
        comparison = (b.responseCount || 0) - (a.responseCount || 0)
        break
      case "views":
        comparison = (b.views || 0) - (a.views || 0)
        break
      case "alphabetical":
        comparison = a.title.localeCompare(b.title)
        break
      case "created":
        comparison = new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        break
      default:
        comparison = 0
    }

    return sortDirection === "asc" ? -comparison : comparison
  })

  const handleShareForm = async (formId, event) => {
    if (event) {
      event.stopPropagation()
    }

    const shareableLink = `${window.location.origin}/form/${formId}`

    try {
      // Copy the link to the clipboard
      await navigator.clipboard.writeText(shareableLink)

      // Log activity
      if (user) {
        try {
          await updateDoc(doc(db, "userActivity", user.uid), {
            activities: arrayUnion({
              type: "share",
              formId,
              timestamp: Timestamp.now(),
            }),
          })
        } catch (error) {
          console.error("Error logging activity:", error)
        }
      }

      alert("Link copied to clipboard!")
    } catch (error) {
      console.error("Error copying link: ", error)
      alert("Failed to copy link. Please try again.")
    }

    setShowMobileActions(null)
  }

  const handleDeleteForm = async (formId, event) => {
    if (event) {
      event.stopPropagation()
    }

    if (window.confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      try {
        await deleteForm(formId)
        setShowMobileActions(null)

        // Remove from selected forms if in select mode
        if (selectMode) {
          setSelectedForms(selectedForms.filter((id) => id !== formId))
        }
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
    if (selectMode) {
      toggleFormSelection(formId)
    } else {
      navigate(`/form-responses/${formId}`)
    }
  }

  const toggleFormSelection = (formId) => {
    if (selectedForms.includes(formId)) {
      setSelectedForms(selectedForms.filter((id) => id !== formId))
    } else {
      setSelectedForms([...selectedForms, formId])
    }
  }

  const handleSelectAll = () => {
    if (selectedForms.length === sortedForms.length) {
      setSelectedForms([])
    } else {
      setSelectedForms(sortedForms.map((form) => form.id))
    }
  }

  const handleBatchDelete = async () => {
    if (selectedForms.length === 0) return

    if (
      window.confirm(`Are you sure you want to delete ${selectedForms.length} forms? This action cannot be undone.`)
    ) {
      try {
        // Delete each form
        for (const formId of selectedForms) {
          await deleteForm(formId)
        }

        setSelectedForms([])
        setSelectMode(false)
        setShowBatchActions(false)
      } catch (error) {
        console.error("Error batch deleting forms:", error)
        alert("Failed to delete some forms. Please try again.")
      }
    }
  }

  const handleBatchArchive = async () => {
    if (selectedForms.length === 0) return

    try {
      // Archive each form
      for (const formId of selectedForms) {
        const formRef = doc(db, "forms", formId)
        await updateDoc(formRef, { archived: true })
      }

      setSelectedForms([])
      setSelectMode(false)
      setShowBatchActions(false)
    } catch (error) {
      console.error("Error batch archiving forms:", error)
      alert("Failed to archive some forms. Please try again.")
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    const folderId = newFolderName.toLowerCase().replace(/\s+/g, "-")

    // Check if folder already exists
    if (folders.some((folder) => folder.id === folderId)) {
      alert("A folder with this name already exists.")
      return
    }

    // Add new folder
    setFolders([...folders, { id: folderId, name: newFolderName, count: 0 }])
    setNewFolderName("")
    setShowCreateFolder(false)
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    const tagId = newTagName.toLowerCase().replace(/\s+/g, "-")

    // Check if tag already exists
    if (tags.some((tag) => tag.id === tagId)) {
      alert("A tag with this name already exists.")
      return
    }

    // Add new tag
    setTags([...tags, { id: tagId, name: newTagName, color: newTagColor }])
    setNewTagName("")
    setNewTagColor("blue")
    setShowCreateTag(false)
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const getTagColor = (tagId) => {
    const tag = tags.find((t) => t.id === tagId)
    return tag ? tag.color : "gray"
  }

  const tagColorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
    pink: "bg-pink-100 text-pink-800",
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    indigo: "bg-indigo-100 text-indigo-800",
    teal: "bg-teal-100 text-teal-800",
  }

  if (formsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {!isMobile && <Sidebar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forms...</p>
          </div>
        </div>
        {isMobile && <MobileNavigation activePath="/forms" />}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Forms</h1>
            <div className="flex items-center space-x-2">
              {selectMode ? (
                <>
                  <button
                    onClick={() => {
                      setSelectMode(false)
                      setSelectedForms([])
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowBatchActions(!showBatchActions)}
                    className="p-2 text-gray-500 hover:text-gray-700 relative"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    {selectedForms.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {selectedForms.length}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setSelectMode(true)} className="p-2 text-gray-500 hover:text-gray-700">
                    <CheckSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/builder/new")}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Batch Actions Bar - Mobile */}
        <AnimatePresence>
          {isMobile && showBatchActions && (
            <motion.div
              className="fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-lg z-20 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Batch Actions</h3>
                  <button onClick={() => setShowBatchActions(false)}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleBatchDelete}
                    className="flex flex-col items-center p-3 bg-red-50 text-red-600 rounded-lg"
                    disabled={selectedForms.length === 0}
                  >
                    <Trash2 className="w-5 h-5 mb-1" />
                    <span className="text-xs">Delete</span>
                  </button>
                  <button
                    onClick={handleBatchArchive}
                    className="flex flex-col items-center p-3 bg-gray-50 text-gray-600 rounded-lg"
                    disabled={selectedForms.length === 0}
                  >
                    <Archive className="w-5 h-5 mb-1" />
                    <span className="text-xs">Archive</span>
                  </button>
                  <button
                    onClick={() => {
                      // Add tag functionality
                      setShowBatchActions(false)
                      setShowCreateTag(true)
                    }}
                    className="flex flex-col items-center p-3 bg-blue-50 text-blue-600 rounded-lg"
                    disabled={selectedForms.length === 0}
                  >
                    <Tag className="w-5 h-5 mb-1" />
                    <span className="text-xs">Tag</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 md:p-6 lg:p-8">
          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
                <p className="text-gray-600 mt-1">Manage and organize all your forms</p>
              </div>
              <div className="flex items-center space-x-3">
                {selectMode ? (
                  <>
                    <span className="text-sm text-gray-600">
                      {selectedForms.length} {selectedForms.length === 1 ? "form" : "forms"} selected
                    </span>
                    <button
                      onClick={handleBatchDelete}
                      className="flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      disabled={selectedForms.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                    <button
                      onClick={handleBatchArchive}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={selectedForms.length === 0}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </button>
                    <button
                      onClick={() => {
                        setSelectMode(false)
                        setSelectedForms([])
                      }}
                      className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectMode(true)}
                      className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Select
                    </button>
                    <button
                      onClick={() => navigate("/builder/new")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Form
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Desktop Only */}
            {!isMobile && showSidebar && (
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Folders</h2>
                    <button
                      onClick={() => setShowCreateFolder(true)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <FolderPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 mb-6">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left ${
                          selectedFolder === folder.id
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedFolder(folder.id)}
                      >
                        <div className="flex items-center">
                          <Folder
                            className={`w-4 h-4 mr-2 ${selectedFolder === folder.id ? "text-purple-600" : "text-gray-500"}`}
                          />
                          <span className="text-sm">{folder.name}</span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {folder.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Tags</h2>
                    <button
                      onClick={() => setShowCreateTag(true)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <TagIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left ${
                          selectedTag === tag.id ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                      >
                        <div className="flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${tagColorClasses[tag.color]
                              .split(" ")[0]
                              .replace("bg-", "bg-")}`}
                          ></span>
                          <span className="text-sm">{tag.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Folder/Tag Selector */}
              {isMobile && (
                <div className="mb-4 overflow-x-auto pb-2">
                  <div className="flex space-x-2">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full whitespace-nowrap ${
                          selectedFolder === folder.id
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-white border border-gray-200 text-gray-700"
                        }`}
                        onClick={() => setSelectedFolder(folder.id)}
                      >
                        <Folder className="w-3 h-3" />
                        <span className="text-xs">{folder.name}</span>
                        {folder.count > 0 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 rounded-full">{folder.count}</span>
                        )}
                      </button>
                    ))}
                    <button
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-full whitespace-nowrap bg-white border border-gray-200 text-gray-700"
                      onClick={() => setShowCreateFolder(true)}
                    >
                      <FolderPlus className="w-3 h-3" />
                      <span className="text-xs">New Folder</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Search and Filter Bar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search forms..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <div className="relative">
                      <button
                        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        onClick={toggleSortDirection}
                      >
                        <span className="mr-2">Sort</span>
                        {sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      </button>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="absolute opacity-0 inset-0 w-full cursor-pointer"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="responses">Most Responses</option>
                        <option value="views">Most Views</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="created">Date Created</option>
                      </select>
                    </div>
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
              </div>

              {/* Forms List/Grid */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* List Header - Desktop */}
                {!isMobile && viewMode === "list" && (
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="col-span-5 flex items-center">
                      <button onClick={handleSelectAll} className="mr-3 text-gray-500 hover:text-gray-700">
                        {selectedForms.length === sortedForms.length && sortedForms.length > 0 ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-xs font-medium text-gray-500 uppercase">Form Name</span>
                    </div>
                    <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">Status</div>
                    <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">Responses</div>
                    <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">Last Updated</div>
                    <div className="col-span-1 text-xs font-medium text-gray-500 uppercase text-right">Actions</div>
                  </div>
                )}

                {sortedForms.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
                    <p className="text-gray-600 mb-6">
                      {forms.length === 0
                        ? "Create your first form to get started"
                        : "Try adjusting your search criteria"}
                    </p>
                    <button
                      onClick={() => navigate("/builder/new")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Create New Form
                    </button>
                  </div>
                ) : viewMode === "grid" ? (
                  // Grid View
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {sortedForms.map((form) => (
                      <motion.div
                        key={form.id}
                        className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden ${
                          selectedForms.includes(form.id)
                            ? "border-purple-400 ring-2 ring-purple-100"
                            : "border-gray-200"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => handleFormClick(form.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            {selectMode && (
                              <button
                                className="p-1 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFormSelection(form.id)
                                }}
                              >
                                {selectedForms.includes(form.id) ? (
                                  <CheckSquare className="w-5 h-5 text-purple-600" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            )}
                            <h3 className={`font-semibold text-gray-900 truncate ${selectMode ? "pl-2" : ""}`}>
                              {form.title}
                            </h3>
                            {!selectMode && (
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

                                {/* Actions Dropdown */}
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
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                form.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {form.status || "draft"}
                            </span>
                            {form.tags?.map((tagId) => (
                              <span
                                key={tagId}
                                className={`text-xs px-2 py-1 rounded-full ${tagColorClasses[getTagColor(tagId)]}`}
                              >
                                {tags.find((t) => t.id === tagId)?.name || tagId}
                              </span>
                            ))}
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
                  <div className="divide-y divide-gray-200">
                    {sortedForms.map((form) => (
                      <motion.div
                        key={form.id}
                        className={`px-4 py-3 sm:px-6 sm:py-4 hover:bg-gray-50 transition-colors ${
                          selectedForms.includes(form.id) ? "bg-purple-50" : ""
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => handleFormClick(form.id)}
                      >
                        {isMobile ? (
                          // Mobile List View
                          <div className="flex items-start">
                            {selectMode && (
                              <button
                                className="p-1 mr-2 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFormSelection(form.id)
                                }}
                              >
                                {selectedForms.includes(form.id) ? (
                                  <CheckSquare className="w-5 h-5 text-purple-600" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900 truncate">{form.title}</h3>
                                {!selectMode && (
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
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 my-2">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    form.status === "published"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {form.status || "draft"}
                                </span>
                                {form.tags?.slice(0, 2).map((tagId) => (
                                  <span
                                    key={tagId}
                                    className={`text-xs px-2 py-0.5 rounded-full ${tagColorClasses[getTagColor(tagId)]}`}
                                  >
                                    {tags.find((t) => t.id === tagId)?.name || tagId}
                                  </span>
                                ))}
                                {(form.tags?.length || 0) > 2 && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                    +{form.tags.length - 2}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <BarChart3 className="w-3 h-3 mr-1" />
                                  {form.responseCount || 0}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "Unknown"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Desktop List View
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-5 flex items-center">
                              {selectMode && (
                                <button
                                  className="mr-3"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFormSelection(form.id)
                                  }}
                                >
                                  {selectedForms.includes(form.id) ? (
                                    <CheckSquare className="w-5 h-5 text-purple-600" />
                                  ) : (
                                    <Square className="w-5 h-5 text-gray-400" />
                                  )}
                                </button>
                              )}
                              <div>
                                <h3 className="font-medium text-gray-900">{form.title}</h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {form.tags?.map((tagId) => (
                                    <span
                                      key={tagId}
                                      className={`text-xs px-1.5 py-0.5 rounded-full ${tagColorClasses[getTagColor(tagId)]}`}
                                    >
                                      {tags.find((t) => t.id === tagId)?.name || tagId}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  form.status === "published"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {form.status || "draft"}
                              </span>
                            </div>
                            <div className="col-span-2 text-sm">
                              <div className="flex items-center">
                                <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{form.responseCount || 0} responses</span>
                              </div>
                            </div>
                            <div className="col-span-2 text-sm text-gray-600">
                              {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "Unknown"}
                            </div>
                            <div className="col-span-1 flex items-center justify-end space-x-1">
                              <button
                                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/builder/${form.id}`)
                                }}
                                title="Edit Form"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                onClick={(e) => handleShareForm(form.id, e)}
                                title="Share Form"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={(e) => handleDeleteForm(form.id, e)}
                                title="Delete Form"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Folder Modal */}
        <AnimatePresence>
          {showCreateFolder && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateFolder(false)}
            >
              <motion.div
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">
                        Folder Name
                      </label>
                      <input
                        type="text"
                        id="folderName"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter folder name"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowCreateFolder(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim()}
                      >
                        Create Folder
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Tag Modal */}
        <AnimatePresence>
          {showCreateTag && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateTag(false)}
            >
              <motion.div
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Tag</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tag Name
                      </label>
                      <input
                        type="text"
                        id="tagName"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter tag name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tag Color</label>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.keys(tagColorClasses).map((color) => (
                          <button
                            key={color}
                            className={`w-full h-8 rounded-lg ${tagColorClasses[color]} ${
                              newTagColor === color ? "ring-2 ring-gray-400" : ""
                            }`}
                            onClick={() => setNewTagColor(color)}
                          ></button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowCreateTag(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        onClick={handleCreateTag}
                        disabled={!newTagName.trim()}
                      >
                        Create Tag
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        {isMobile && <MobileNavigation activePath="/forms" />}
      </div>
    </div>
  )
}
