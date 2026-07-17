"use client"

import { motion } from "framer-motion"
import { Shield, Sparkles, Heart, Users, CheckCircle } from "lucide-react"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function About() {
  const stats = [
    { value: "2M+", label: "Forms Created" },
    { value: "50M+", label: "Submissions Processed" },
    { value: "99.99%", label: "Uptime Guaranteed" },
    { value: "10,000+", label: "Active Creators" },
  ]

  const values = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "Design-First Thinking",
      description: "We believe forms shouldn't just collect information; they should be beautiful, engaging brand touchpoints that respect user time.",
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Security & Privacy",
      description: "Your responses are sacred. We protect all data with advanced encryption, robust access logs, and transparent data privacy controls.",
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "Customer Centric",
      description: "We are obsessed with customer feedback. The features we build are co-designed directly with our community of form creators.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Radical Simplicity",
      description: "Building forms can get complicated. We strive to abstract that complexity away behind a lightning-fast, intuitive UI.",
    },
  ]

  const timeline = [
    { year: "2024", title: "The Spark", description: "FormWise was founded in a garage with the simple goal of replacing clunky form builders with a modern, elegant web builder." },
    { year: "2025", title: "Version 1.0 Release", description: "Launched our drag-and-drop builder, capturing the interest of 2,000+ freelance developers and digital agencies." },
    { year: "2025", title: "Analytics Overhaul", description: "Introduced advanced drop-off tracking, user agent insights, and graphical field analytics." },
    { year: "2026", title: "Intelligent Embeds & Logic", description: "Released conditional branching logic, custom webhook triggers, and embedded widgets for external sites." },
  ]

  const team = [
    {
      name: "Vaibhav Rathod",
      role: "Founder & Chief Architect",
      bio: "Software developer obsessed with designing robust SaaS products and interactive user interfaces.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Sagar Rathod",
      role: "Lead Frontend Engineer",
      bio: "Framer Motion and animation guru who ensures every transition feels fluid and high-end.",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-200">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 dark:from-purple-950 dark:to-indigo-950 text-white pt-36 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.2),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-3 py-1 bg-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider uppercase rounded-full border border-purple-500/20">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-4 mb-6">
              Simplifying Data Collection, <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Beautifully</span>
            </h1>
            <p className="text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              We started FormWise because we were tired of ugly, boring, and complicated form tools. We are building a platform that makes data collection a premium experience for creators and respondents alike.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Panel */}
      <section className="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 transition-colors duration-200">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Values that guide us</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            These fundamental principles inform every design choice, line of code, and support conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm flex items-start space-x-6 hover:shadow-md transition-all duration-200"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl border border-gray-100 dark:border-slate-600 flex-shrink-0">
                {val.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{val.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 bg-gray-100/50 dark:bg-slate-800/30 border-y border-gray-200 dark:border-slate-800 w-full transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              How we grow and iterate over time.
            </p>
          </div>

          <div className="relative border-l-2 border-purple-200 dark:border-purple-900 max-w-3xl mx-auto pl-8 space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -left-12 top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-purple-600 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-300 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/45 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-full mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Meet the creators</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A small team of designers, engineers, and developers building the tool we always wanted to use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`h-3 bg-gradient-to-r ${member.color}`} />
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6 uppercase">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mt-1">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-4">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
