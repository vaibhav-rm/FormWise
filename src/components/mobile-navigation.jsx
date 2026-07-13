"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  FileText,
  PlusCircle,
  BarChart3,
  Menu,
  X,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  CreditCard,
  Mail,
  Layout,
  Zap,
  Globe,
  Upload,
} from "lucide-react"
import { useAuth } from "../hooks/use-auth"

const MobileNavigation = ({ activePath }) => {
  const navigate = useNavigate()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { user, logout } = useAuth()

  // Enhanced mobile menu items to match all sidebar sections
  const mobileMenuSections = [
    {
      title: "Main",
      items: [
        {
          icon: <Home className="w-5 h-5" />,
          label: "Dashboard",
          path: "/dashboard",
          active: activePath === "/dashboard",
        },
        {
          icon: <PlusCircle className="w-5 h-5" />,
          label: "Create Form",
          path: "/builder/new",
          active: activePath === "/builder/new",
        },
        { icon: <FileText className="w-5 h-5" />, label: "My Forms", path: "/forms", active: activePath === "/forms" },
        {
          icon: <Layout className="w-5 h-5" />,
          label: "Templates",
          path: "/templates",
          active: activePath === "/templates",
        },
      ],
    },
    {
      title: "Analytics & Reports",
      items: [
        {
          icon: <BarChart3 className="w-5 h-5" />,
          label: "Analytics",
          path: "/analytics",
          active: activePath === "/analytics",
        },
      ],
    },
        {
          title: "Tools & Integrations",
          items: [
            { icon: <Zap className="w-5 h-5" />, label: "Integrations", path: "/integrations" },
            { icon: <Globe className="w-5 h-5" />, label: "Webhooks", path: "/webhooks" },
            { icon: <Upload className="w-5 h-5" />, label: "Import", path: "/import" },
          ],
        },
    {
      title: "Account & Settings",
      items: [
        { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile", active: activePath === "/profile" },
        {
          icon: <Settings className="w-5 h-5" />,
          label: "Settings",
          path: "/settings",
          active: activePath === "/settings",
        },
        {
          icon: <CreditCard className="w-5 h-5" />,
          label: "Billing",
          path: "/billing",
          active: activePath === "/billing",
        },
        {
          icon: <Bell className="w-5 h-5" />,
          label: "Notifications",
          path: "/notifications",
          active: activePath === "/notifications",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle className="w-5 h-5" />,
          label: "Help Center",
          path: "/help",
          active: activePath === "/help",
        },
        { icon: <Mail className="w-5 h-5" />, label: "Contact", path: "/contact", active: activePath === "/contact" },
      ],
    },
  ]



  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex flex-col items-center p-2 ${activePath === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => navigate("/forms")}
            className={`flex flex-col items-center p-2 ${activePath === "/forms" ? "text-purple-600" : "text-gray-500"}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs mt-1">Forms</span>
          </button>
          <button
            onClick={() => navigate("/builder/new")}
            className="flex flex-col items-center p-2 bg-purple-600 text-white rounded-full -mt-5 shadow-lg"
          >
            <PlusCircle className="w-8 h-8" />
            <span className="text-xs mt-1">Create</span>
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className={`flex flex-col items-center p-2 ${activePath === "/analytics" ? "text-purple-600" : "text-gray-500"}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Analytics</span>
          </button>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div>
                  <h2 className="font-semibold text-lg">Menu</h2>
                  <p className="text-purple-100 text-sm">All features & tools</p>
                </div>
                <button onClick={() => setShowMobileMenu(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Sections */}
              <div className="p-4 pb-24 overflow-y-auto">
                {mobileMenuSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          onClick={() => {
                            navigate(item.path)
                            setShowMobileMenu(false)
                          }}
                          className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                            item.active
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className={item.active ? "text-purple-600" : "text-gray-500"}>{item.icon}</div>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* User Section */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.displayName || "User"}</p>
                      <p className="text-sm text-gray-500">{user?.email || ""}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Handle logout
                      logout()
                      setShowMobileMenu(false)
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileNavigation
