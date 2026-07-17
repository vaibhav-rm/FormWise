"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("agreement")

  const sections = [
    { id: "agreement", label: "1. Agreement to Terms" },
    { id: "accounts", label: "2. Account Terms" },
    { id: "billing", label: "3. Billing and Subscriptions" },
    { id: "conduct", label: "4. User Responsibilities" },
    { id: "intellectual-property", label: "5. Intellectual Property" },
    { id: "limitation", label: "6. Limitation of Liability" },
    { id: "termination", label: "7. Termination" },
    { id: "governing-law", label: "8. Governing Law" },
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
            Terms of Service
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Last Updated: July 17, 2026. Please read these terms carefully before using FormWise.
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
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
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
            <section id="agreement" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">1. Agreement to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By accessing or using our services at FormWise ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of the terms and conditions outlined here, you are not authorized to use the platform.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                We reserves the right to update or modify these Terms at any time without prior notice. Your continued use of the platform following the posting of changes constitutes your acceptance of the revised terms.
              </p>
            </section>

            <section id="accounts" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">2. Account Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                When you create an account, you must adhere to the following rules:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>You must be at least 13 years of age to use the services.</li>
                <li>You must provide accurate and complete email and contact information during signup.</li>
                <li>You are solely responsible for keeping your account credentials secure. We cannot and will not be liable for any loss resulting from your failure to secure your password.</li>
                <li>One person or legal entity may not maintain more than one free account.</li>
              </ul>
            </section>

            <section id="billing" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">3. Billing and Subscriptions</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Paid services are billed on a subscription basis (monthly or annually). Payments are processed securely via third-party processors. By subscribing, you authorize us to charge your payment method recurringly.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                All fees are exclusive of applicable taxes. You may cancel your subscription at any time, and your account will remain active on your tier until the end of your billing cycle. No refunds or credits will be issued for partial months of service or downgrades.
              </p>
            </section>

            <section id="conduct" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">4. User Responsibilities</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to use FormWise to create forms or collect responses that contain:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Phishing content, fake login forms, or credentials harvesting.</li>
                <li>Hate speech, harassment, threats of violence, or explicit material.</li>
                <li>Malware, viruses, or code designed to disrupt service.</li>
                <li>Personally identifiable info in an insecure manner that violates regional privacy acts.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                We reserve the right to audit forms and suspend accounts that violate these rules immediately and without notice.
              </p>
            </section>

            <section id="intellectual-property" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">5. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                FormWise does not claim ownership over the content you upload, configure, or collect using our services. Your forms and submission databases remain yours.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                However, all proprietary software, designs, layouts, trademarks, logos, and graphics of FormWise are the intellectual property of FormWise and are protected by copyrights and other laws. You may not copy, reverse-engineer, or duplicate any portion of our visual system or code.
              </p>
            </section>

            <section id="limitation" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">6. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                In no event shall FormWise, its directors, or partners be liable for any indirect, incidental, special, exemplary, or punitive damages (including loss of profits, data, or goodwill) arising out of or related to your use of the platform.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                Our services are provided on an "as is" and "as available" basis. We make no warranty that the service will meet your exact requirements, be uninterrupted, timely, secure, or error-free.
              </p>
            </section>

            <section id="termination" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">7. Termination</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may terminate or suspend your account and access to the services immediately, without prior notice or liability, for any reason, including if you breach these Terms.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                Upon termination, your right to use the platform will cease immediately. All provisions of the Terms which by their nature should survive termination shall survive (including ownership provisions, warranty disclaimers, and limitations of liability).
              </p>
            </section>

            <section id="governing-law" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">8. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of California, United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                Any failure by us to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>
          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
