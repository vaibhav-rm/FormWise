"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Camera,
  Trash2,
  Plus,
  Menu,
  X,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import { useAuth } from "../hooks/use-auth"
import { useUserProfile } from "../hooks/use-user-profile"
import { useForms } from "../hooks/use-forms"
import MobileNavigation from "../components/mobile-navigation" // Import MobileNavigation component

export default function Settings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { userProfile } = useUserProfile()
  const { forms } = useForms()
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    company: "",
    website: "",
    bio: "",
    avatar: user?.photoURL || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    formResponses: true,
    weeklyReports: true,
    productUpdates: false,
    marketingEmails: false,
  })

  const [teamMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
  ])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "team", label: "Team", icon: <Users className="w-4 h-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  ]

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>

        {/* Avatar */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <img
              src={profileData.avatar || "/placeholder.svg?height=80&width=80"}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{profileData.name || "Your Name"}</h4>
            <p className="text-sm text-gray-600">{profileData.email}</p>
            <button className="text-sm text-purple-600 hover:text-purple-700 mt-1">Change photo</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={profileData.company}
              onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Authentication</h4>
              <p className="text-sm text-gray-600">Receive verification codes via SMS</p>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h4>
                <p className="text-sm text-gray-600">
                  {key === "emailNotifications" && "Receive email notifications for important updates"}
                  {key === "formResponses" && "Get notified when someone submits a form"}
                  {key === "weeklyReports" && "Receive weekly analytics reports"}
                  {key === "productUpdates" && "Stay informed about new features and improvements"}
                  {key === "marketingEmails" && "Receive promotional emails and tips"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Team Members</h3>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-3">
                <span className="text-sm text-gray-600">{member.role}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    member.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.status}
                </span>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBillingTab = () => {
    const plan = userProfile?.subscription?.plan || "free"
    const cycle = userProfile?.subscription?.billingCycle || "monthly"
    const planLimits = {
      free: { forms: 10, responses: 1000, teamMembers: 1, storage: 0.5 },
      starter: { forms: 99999, responses: 10000, teamMembers: 5, storage: 5 },
      pro: { forms: 99999, responses: 50000, teamMembers: 99999, storage: 50 }
    }
    const currentLimits = planLimits[plan] || planLimits.free
    const totalResponsesUsed = forms ? forms.reduce((sum, f) => sum + (f.responseCount || 0), 0) : 0
    const totalFormsUsed = forms ? forms.length : 0

    const formatLimit = (value) => {
      if (value >= 99999) return "Unlimited"
      return value.toLocaleString()
    }

    const planPrices = {
      free: "$0/month",
      starter: cycle === "annual" ? "$8/month (Billed annually)" : "$10/month",
      pro: cycle === "annual" ? "$10/month (Billed annually)" : "$15/month"
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 capitalize">{plan} Plan</h4>
                <p className="text-gray-600">{planPrices[plan]}</p>
              </div>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mt-4 sm:mt-0"
                onClick={() => navigate("/billing")}
              >
                {plan === "pro" ? "Manage Subscription" : "Upgrade Plan"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Forms</p>
                <p className="font-semibold">{totalFormsUsed} / {formatLimit(currentLimits.forms)}</p>
              </div>
              <div>
                <p className="text-gray-600">Responses</p>
                <p className="font-semibold">{totalResponsesUsed.toLocaleString()} / {formatLimit(currentLimits.responses)}</p>
              </div>
              <div>
                <p className="text-gray-600">Team Members</p>
                <p className="font-semibold">1 / {formatLimit(currentLimits.teamMembers)}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">
                    {plan === "free" ? "No active card linked" : "Cashfree Payments Integration"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {plan === "free" ? "Upgrade to link card/UPI" : "Payments secured via Cashfree Gateway"}
                  </p>
                </div>
              </div>
              <button
                className="text-purple-600 hover:text-purple-700 font-medium"
                onClick={() => navigate("/billing")}
              >
                {plan === "free" ? "Link" : "Manage"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 lg:p-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
              <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Settings</h1>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and preferences</p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Tabs */}
            <div className="lg:w-64">
              {/* Mobile Tab Selector */}
              {isMobile ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="p-4">
                    <select
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                          {tab.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* Desktop Tabs */
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                {activeTab === "profile" && renderProfileTab()}
                {activeTab === "security" && renderSecurityTab()}
                {activeTab === "notifications" && renderNotificationsTab()}
                {activeTab === "team" && renderTeamTab()}
                {activeTab === "billing" && renderBillingTab()}
              </div>

              {/* Mobile Save Button */}
              {isMobile && (
                <div className="mt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isMobile && <MobileNavigation activePath="/settings" />}
    </div>
  )
}
