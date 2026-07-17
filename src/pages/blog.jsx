"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, ArrowRight, X, Calendar, User } from "lucide-react"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeArticle, setActiveArticle] = useState(null)

  const categories = ["All", "Product Updates", "Form Design", "Case Studies"]

  const articles = [
    {
      id: 1,
      title: "Introducing Intelligent Embeds and Popup Widgets",
      description: "Embed your FormWise forms seamlessly inside external HTML sites using iframe blocks or customize automated click-trigger popups.",
      category: "Product Updates",
      date: "July 17, 2026",
      author: "Vaibhav",
      readTime: "5 min read",
      content: `
        <p class="lead">Today, we are thrilled to release one of the most requested features: <strong>Intelligent Embeds & Popup Widgets</strong>.</p>
        <p>Our goal with FormWise is to make feedback collection as native as possible. Standard external redirects often add friction, lowering conversion rates. With embeds, you can place forms directly inside blog posts, user onboarding steps, or checkout pipelines.</p>
        
        <h3>1. Strip-Down Embed Parameter</h3>
        <p>By appending <code>?embed=true</code> to any form URL, FormWise automatically removes outer gradients, container spacing, backgrounds, shadows, and headers, leaving just the pure form fields. This allows the form to look completely native to the parent page.</p>

        <h3>2. Popup Widget Builder</h3>
        <p>We've integrated a visual widget constructor in the dashboard. You can set the button trigger text, specify custom hex colors, and copy-paste the script code block. The popups use beautiful slide-in panels that don't block the screen disruptively.</p>

        <h3>Conclusion</h3>
        <p>Head to your dashboard, click <strong>Share</strong> on any form, and explore the new capabilities. We can't wait to see how you embed FormWise into your workflows!</p>
      `,
    },
    {
      id: 2,
      title: "10 Best Practices for Form Conversion Rates",
      description: "Form drop-off rates are a silent conversion killer. Learn how to structure questions, configure inputs, and optimize styles to hit 80%+ completion.",
      category: "Form Design",
      date: "July 12, 2026",
      author: "Sarah Lin",
      readTime: "7 min read",
      content: `
        <p class="lead">Most forms convert at less than 15%. However, with some adjustments, you can push that number past 75%.</p>
        
        <h3>1. Keep it Single-Column</h3>
        <p>Multi-column form layouts force respondents' eyes to scan in a Z-pattern, increasing cognitive load. Keeping fields stacked in a single vertical column creates a clean, downward scrolling motion that speeds up form filling.</p>

        <h3>2. Ditch Placeholders as Labels</h3>
        <p>Placeholders disappear the moment the user starts typing. If they forget what they are filling out, they have to delete their text. Always use high-contrast labels above inputs.</p>

        <h3>3. Use Inline Validation</h3>
        <p>Do not wait until submission to tell the user they made an error. Verify email syntax or length constraints as they type so they can correct mistakes instantly.</p>

        <h3>4. Use Progressive Disclosure</h3>
        <p>If you have more than 7 fields, break them into multiple steps. Multi-step forms reduce visual clutter and build completion momentum.</p>
      `,
    },
    {
      id: 3,
      title: "How Acme Corp Scaled Lead Gen by 300% Using FormWise",
      description: "Find out how Acme Corp restructured their onboarding survey, integrated webhooks, and drove major sales pipelines using our builder.",
      category: "Case Studies",
      date: "July 05, 2026",
      author: "Vaibhav",
      readTime: "8 min read",
      content: `
        <p class="lead">Acme Corp, a fast-growing B2B analytics platform, was struggling to qualify inbound sales leads through their traditional contact form.</p>
        
        <h3>The Challenge</h3>
        <p>Their contact page was static and asked for 12 details upfront. The bounce rate on the page was 82%. Out of the remaining 18%, only a tiny fraction were actual target customers, wasting sales team follow-up hours.</p>

        <h3>The FormWise Solution</h3>
        <p>Using FormWise, Acme's marketing team built a dynamic, multi-step customer qualification survey. They implemented conditional logic: if a lead specified a team size greater than 50, the form instantly requested scheduling on their calendar. If the team size was smaller, it collected contact information and routed them to a self-serve tier.</p>

        <h3>Results</h3>
        <p>By implementing progression and branching logic:</p>
        <ul>
          <li>Bounce rate fell from 82% to 29%.</li>
          <li>Qualified pipeline submissions tripled within 30 days.</li>
          <li>Automatic Slack notifications via webhooks allowed account executives to contact leads within minutes.</li>
        </ul>
      `,
    },
    {
      id: 4,
      title: "Designing Accessible Forms for Everyone",
      description: "A comprehensive guide to web accessibility (a11y) in digital forms, covering screen readers, keyboard tabs, and contrast rules.",
      category: "Form Design",
      date: "June 28, 2026",
      author: "Sarah Lin",
      readTime: "6 min read",
      content: `
        <p class="lead">Accessibility is not a feature; it is a fundamental requirement of the modern web.</p>
        
        <h3>1. Screen Reader Compatibility</h3>
        <p>Ensure every input is associated with an <code>&lt;label&gt;</code> element using the <code>htmlFor</code> property. Use descriptive error announcements using <code>aria-describedby</code> attributes.</p>

        <h3>2. Keyboard Focus Indicators</h3>
        <p>Never disable the focus ring (<code>outline: none</code>) without providing a high-contrast replacement. Users navigating with a keyboard must know precisely where their cursor is at all times.</p>

        <h3>3. Color and Contrast</h3>
        <p>Ensure text and inputs meet WCAG AA contrast standards. Don't use color as the sole indicator of state (e.g. indicating an error purely through red borders without error text).</p>
      `,
    },
  ]

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-200">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 to-indigo-900 dark:from-purple-950 dark:to-indigo-950 text-white pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.2),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 bg-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider uppercase rounded-full border border-purple-500/20">
              FormWise Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4">
              Insights & Product Updates
            </h1>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Stay up-to-date with our latest features, case studies, and form design best practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-md dark:shadow-none"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm shadow-sm text-gray-800 dark:text-gray-100 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Grid List */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-12 text-center shadow-sm transition-colors duration-200">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            filteredArticles.map((article, idx) => (
              <motion.article
                key={article.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between duration-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-lg uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="flex items-center text-xs text-gray-400 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    {article.description}
                  </p>
                </div>
                <div className="px-8 pb-8 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-400 font-medium">
                    Published: {article.date}
                  </span>
                  <button
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors group cursor-pointer"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </main>

      {/* Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-transparent dark:border-slate-700 transition-colors duration-200"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-slate-700 flex justify-between items-start bg-gray-50/50 dark:bg-slate-800/50">
                <div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-lg uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{activeArticle.title}</h2>
                  <div className="flex flex-wrap items-center space-x-4 text-xs text-gray-400 dark:text-gray-400 mt-3">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {activeArticle.date}
                    </span>
                    <span className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1" />
                      By {activeArticle.author}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {activeArticle.readTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-white dark:bg-slate-700 p-2 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm text-gray-500 dark:text-gray-300 cursor-pointer ml-4 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 sm:p-12 overflow-y-auto flex-1 prose prose-purple dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-purple-50 dark:prose-code:bg-purple-950/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                <div dangerouslySetInnerHTML={{ __html: activeArticle.content }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  )
}
