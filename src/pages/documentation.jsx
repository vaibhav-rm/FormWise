"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Book, Layers, GitBranch, Paintbrush, Share2, AlertCircle, Copy, Check } from "lucide-react"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function Documentation() {
  const [activeTab, setActiveTab] = useState("intro")
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  const docTabs = [
    { id: "intro", label: "Getting Started", icon: <Book className="w-4 h-4" /> },
    { id: "fields", label: "Form Fields", icon: <Layers className="w-4 h-4" /> },
    { id: "logic", label: "Conditional Logic", icon: <GitBranch className="w-4 h-4" /> },
    { id: "styling", label: "Design & Themes", icon: <Paintbrush className="w-4 h-4" /> },
    { id: "embedding", label: "Embed & Publish", icon: <Share2 className="w-4 h-4" /> },
  ]

  const handleCopy = (codeText, id) => {
    navigator.clipboard.writeText(codeText)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const sampleIframe = `<iframe
  src="https://formwise.com/form/example-id?embed=true"
  width="100%"
  height="500px"
  frameborder="0"
></iframe>`

  const filteredTabs = docTabs.filter((tab) =>
    tab.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-200">
      <PublicHeader />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 dark:from-purple-950 dark:to-indigo-950 text-white pt-36 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.2),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <span className="px-3 py-1 bg-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider uppercase rounded-full border border-purple-500/20">
              FormWise Docs
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
              Documentation & Guides
            </h1>
            <p className="text-lg text-purple-200 max-w-2xl">
              Learn how to create forms, set up branching logic paths, customize templates, and embed components.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Docs Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="col-span-1">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm sticky top-28 space-y-4 transition-colors duration-200">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Filter articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-colors"
                />
              </div>

              {/* Sidebar Tabs */}
              <nav className="space-y-1">
                {filteredTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 text-sm font-medium py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-purple-600 text-white shadow-md dark:shadow-none font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
                {filteredTabs.length === 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">No categories match your filter.</p>
                )}
              </nav>
            </div>
          </aside>

          {/* Docs Content */}
          <article className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 shadow-sm prose prose-purple dark:prose-invert max-w-none transition-colors duration-200">
            {activeTab === "intro" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-slate-700">Getting Started</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Welcome to FormWise! FormWise is a modern platform that empowers designers and developers to construct intelligent web forms without code. This guide covers how to quickly publish your first form.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Quick Setup Steps</h3>
                <ol className="list-decimal pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                  <li><strong>Create an Account:</strong> Register for a free account at the <a href="/auth" className="text-purple-600 dark:text-purple-400 underline">Auth Page</a>.</li>
                  <li><strong>Open the Builder:</strong> From your Dashboard, click "New Form" to open the form constructor.</li>
                  <li><strong>Add Fields:</strong> Click or drag fields from the left sidebar onto your form canvas.</li>
                  <li><strong>Define Style:</strong> Head to the "Themes" tab to customize borders, margins, fonts, and background themes.</li>
                  <li><strong>Publish:</strong> Click "Publish" in the top-right corner to get your active sharing link.</li>
                </ol>

                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-xl p-5 flex items-start space-x-4 mt-8">
                  <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-purple-900 dark:text-purple-200">
                    <strong>Tip:</strong> You can start with our built-in premium templates (surveys, leads, contacts) directly from the Templates page rather than building from scratch!
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "fields" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-slate-700">Form Fields</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  FormWise provides a wide range of input components. Each field can be custom labeled, marked as required, or equipped with specific validation rules.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Standard Inputs</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Short text fields, long paragraphs, email addresses, and number inputs. These support length verification rules and validation.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Choice Inputs</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Dropdown selectors, checkbox groups, and radio buttons. You can set custom keys, pre-selected values, and placeholder items.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Rating & Feedback</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      1-to-5 star ratings or linear opinion scales. Perfect for Net Promoter Score (NPS) and customer satisfaction forms.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Advanced Fields</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      File uploads, date selectors, and digital signature panels. Supported on our Premium plans.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "logic" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-slate-700">Conditional Logic</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Branching logic lets you create dynamic forms that show or hide fields based on a respondent's previous answers. This shortens the form and boosts completion rates.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">How Logic Rules Work</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Each rule operates on an <code>IF [Field] [Operator] [Value] THEN [Action] [Target]</code> statement.
                </p>

                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 mt-6 space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 font-bold px-2 py-0.5 rounded uppercase text-xs">Rule 1:</span>
                    <span className="text-gray-700 dark:text-gray-200"><strong>IF</strong> <i>Satisfaction Rating</i> <strong>is less than</strong> <i>3 stars</i></span>
                  </div>
                  <div className="pl-6 text-sm text-gray-600 dark:text-gray-400">
                    👉 <strong>SHOW</strong> <i>"What did you dislike most?" text field</i>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "styling" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-slate-700">Design & Themes</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Make your forms stand out. FormWise supports a visual theme constructor that updates colors, fonts, shadows, and rounded corners instantly.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Pre-built Styles</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li><strong>Modern Clean:</strong> High-contrast borders, white cards, soft purple focus indicators.</li>
                  <li><strong>Brutalist:</strong> Heavy black shadows, thick borders, neon accent colors, monospace fonts.</li>
                  <li><strong>Glassmorphism:</strong> Semi-transparent frosted glass cards, blurred backdrop layers, white borders.</li>
                </ul>
              </motion.div>
            )}

            {activeTab === "embedding" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-slate-700">Embed & Publish</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  FormWise forms can be embedded on any site (WordPress, Webflow, Shopify, custom HTML sites) in seconds.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Using HTML Iframes</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  To place the form directly inline inside a web page, append <code>?embed=true</code> to your form URL. This strips down structural padding and borders:
                </p>

                {/* Code Panel */}
                <div className="relative bg-gray-900 text-gray-200 border border-gray-800 rounded-xl p-5 overflow-x-auto font-mono text-xs">
                  <button
                    onClick={() => handleCopy(sampleIframe, "iframe")}
                    className="absolute right-4 top-4 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors cursor-pointer text-gray-400"
                  >
                    {copiedId === "iframe" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <pre className="mb-0">{sampleIframe}</pre>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Popup Widget Scripts</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  You can also integrate popup widgets. The dashboard widget generator lets you configure trigger colors and labels, and outputs a script tags bundle that creates a floating widget panel on the host page.
                </p>
              </motion.div>
            )}
          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
