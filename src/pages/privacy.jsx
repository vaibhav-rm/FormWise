"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction")

  const sections = [
    { id: "introduction", label: "1. Introduction" },
    { id: "data-collection", label: "2. Information We Collect" },
    { id: "data-usage", label: "3. How We Use Information" },
    { id: "data-sharing", label: "4. Sharing and Disclosure" },
    { id: "data-security", label: "5. Security Measures" },
    { id: "user-rights", label: "6. Your Rights & Choices" },
    { id: "gdpr-ccpa", label: "7. GDPR & CCPA Compliance" },
    { id: "updates", label: "8. Updates to this Policy" },
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
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Last Updated: July 17, 2026. Your privacy is our top priority. Learn how we handle your personal data.
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
            {/* Quick Summary Callout */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-purple-950 dark:text-purple-300 mb-2">TL;DR: Summary of our commitment</h3>
              <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed mb-0">
                We believe that you own your data, and your users own theirs. FormWise never sells your personal information or response data. We secure your submissions with end-to-end encryption, offer granular controls, and strictly comply with global regulations (GDPR and CCPA).
              </p>
            </div>

            <section id="introduction" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">1. Introduction</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Welcome to FormWise ("we", "our", or "us"). We operate the FormWise platform, hosting service, and form builder. This Privacy Policy details our policies and practices regarding the collection, use, and disclosure of personal data when you use our platform, as well as the rights and choices available to you.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                By accessing or using our services, you consent to the collection and use of information in accordance with this policy. If you do not agree with any terms herein, please cease using the platform immediately.
              </p>
            </section>

            <section id="data-collection" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">2. Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We collect several types of information to provide and improve our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>Account Information:</strong> When you sign up, we collect your email address, name, password, and subscription tier.</li>
                <li><strong>Billing Data:</strong> For paid subscriptions, credit card and billing details are processed securely through Cashfree/Stripe. We do not store full card numbers on our servers.</li>
                <li><strong>Form Configuration:</strong> The fields, themes, logic paths, and configuration data of the forms you build are stored to render them properly.</li>
                <li><strong>Form Responses:</strong> Data submitted by respondents to your forms is stored securely on our servers so you can view, export, and analyze it.</li>
                <li><strong>Usage & Log Data:</strong> We log browser type, IP addresses, pages visited, date/time stamps, and referral paths to monitor service performance and detect abuse.</li>
              </ul>
            </section>

            <section id="data-usage" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">3. How We Use Information</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We use the collected data for the following core purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>To provision and maintain the FormWise platform.</li>
                <li>To notify you about changes, security alerts, and system status updates.</li>
                <li>To allow you to view, customize, share, and export responses.</li>
                <li>To process billing transactions and renewals.</li>
                <li>To provide customer support and troubleshoot technical bugs.</li>
                <li>To monitor usage metrics and prevent malicious behavior (e.g. spam, phishing).</li>
              </ul>
            </section>

            <section id="data-sharing" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">4. Sharing and Disclosure</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We do not sell, rent, or trade your personal data. We only share information with trusted third-party service providers (sub-processors) under strict data protection agreements.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                These sub-processors include database hosts (Firebase/Google Cloud), email service providers, and payment gateways. We may also disclose your data if legally required to do so in compliance with subpoena requests or governmental regulations.
              </p>
            </section>

            <section id="data-security" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">5. Security Measures</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We utilize industry-grade technical and organizational security standards. All network traffic is encrypted via HTTPS/TLS. Form databases are isolated and encrypted at rest.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                While we take maximum precautions, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee absolute security.
              </p>
            </section>

            <section id="user-rights" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">6. Your Rights & Choices</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Depending on your location, you have distinct rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>Access & Correction:</strong> You can edit your profile settings and access account data directly in the dashboard.</li>
                <li><strong>Deletion:</strong> You can delete forms and responses permanently from your account. You can request account closure by contacting support.</li>
                <li><strong>Data Portability:</strong> We provide full CSV and JSON exports of all form responses.</li>
              </ul>
            </section>

            <section id="gdpr-ccpa" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">7. GDPR & CCPA Compliance</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                FormWise is built to support General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA) requirements.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                As a FormWise user, you act as the **Data Controller** for responses collected. We act as the **Data Processor**. We host all data in secure facilities and comply with request procedures for personal data deletion within the statutory periods.
              </p>
            </section>

            <section id="updates" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">8. Updates to this Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this policy periodically for any changes.
              </p>
            </section>
          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
