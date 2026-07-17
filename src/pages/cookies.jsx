"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState("what-are-cookies")

  const sections = [
    { id: "what-are-cookies", label: "1. What Are Cookies" },
    { id: "how-we-use", label: "2. How We Use Cookies" },
    { id: "types", label: "3. Types of Cookies We Use" },
    { id: "controlling", label: "4. Controlling Cookie Choices" },
    { id: "third-party", label: "5. Third-Party Tracking" },
    { id: "changes", label: "6. Changes to this Policy" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveSection(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-200">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 dark:from-purple-950 dark:to-indigo-950 text-white pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cookie Policy
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Last Updated: July 17, 2026. This policy explains how and why we use cookies on FormWise.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Table of Contents - Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm transition-colors duration-200">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Table of Contents</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Text */}
          <article className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 shadow-sm space-y-12 prose prose-purple dark:prose-invert max-w-none transition-colors duration-200">
            <section id="what-are-cookies" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">1. What Are Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Cookies are small text files containing a string of characters that are placed on your computer or mobile device when you visit a website. They allow the website to recognize your browser, store preferences, and track certain activities over time.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                We use both "session cookies" (which expire once you close your web browser) and "persistent cookies" (which stay on your device until you delete them or they expire).
              </p>
            </section>

            <section id="how-we-use" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">2. How We Use Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                FormWise uses cookies to enhance your experience and keep our platform functional and secure. Specifically, we use cookies for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mt-4">
                <li>Keeping you logged in as you navigate between pages.</li>
                <li>Remembering your settings, custom theme selections, and builder preferences.</li>
                <li>Preventing malicious cross-site requests and enhancing overall security.</li>
                <li>Analyzing aggregate user traffic patterns to improve platform speed and design.</li>
              </ul>
            </section>

            <section id="types" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">3. Types of Cookies We Use</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                The cookies we use are categorized as follows:
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Essential / Strictly Necessary</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-0">
                    These cookies are essential to provide you with the services available through our platform and to use some of its features, such as secure areas or session authentication. Without these, the platform cannot function correctly.
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Functionality Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-0">
                    These cookies remember choices you make (such as language preferences or custom builder layout states) and provide enhanced, more personal features so you don't have to reconfigure them every session.
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Analytics / Performance Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-0">
                    These cookies are used to collect information in the aggregate about how visitors use our platform (for example, which pages are visited most often). This helps us improve responsiveness and functionality.
                  </p>
                </div>
              </div>
            </section>

            <section id="controlling" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">4. Controlling Cookie Choices</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                If you choose to reject cookies, you may still use our website and form viewer, though your access to certain features and secure areas of the dashboard (such as the form builder) will be severely restricted or broken as authentication relies on them.
              </p>
            </section>

            <section id="third-party" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">5. Third-Party Tracking</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                In addition to our first-party cookies, some third-party service providers (such as Google Analytics or payment processors like Cashfree/Stripe) may place cookies on your browser to measure interactions or verify billing workflows. These third parties have their own privacy policies governing their cookie practices.
              </p>
            </section>

            <section id="changes" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">6. Changes to this Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Please re-visit this policy regularly to stay informed about our use of cookies and related technologies.
              </p>
            </section>
          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
