import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/use-auth"
import LandingPage from "./pages/landing-page"
import Dashboard from "./pages/dashboard"
import FormBuilder from "./pages/form-builder"
import Analytics from "./pages/analytics"
import Templates from "./pages/templates"
import Settings from "./pages/settings"
import Billing from "./pages/billing"
import AuthPage from "./pages/auth"
import FormViewer from "./pages/form-viewer"
import FormResponses from "./pages/form-responses"
import ContactPage from "./pages/contact"
import Forms from "./pages/forms"
import Notifications from "./pages/notifications"
import NotFoundPage from "./pages/404"
import Help from "./pages/help"
import Support from "./pages/support"
import ProfileSettings from "./components/profile-settings"
import Integrations from "./pages/integrations"
import Webhooks from "./pages/webhooks"
import Import from "./pages/import"
import AboutPage from "./pages/about"
import BlogPage from "./pages/blog"
import PrivacyPage from "./pages/privacy"
import TermsPage from "./pages/terms"
import CookiesPage from "./pages/cookies"
import DocumentationPage from "./pages/documentation"
import ApiReferencePage from "./pages/api-reference"
import StatusPage from "./pages/status"

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/auth" />
}

// App Routes Component
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/help" element={<Help />} />
      <Route path="/support" element={<Support />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="/api-reference" element={<ApiReferencePage />} />
      <Route path="/status" element={<StatusPage />} />

      {/* Public form viewer */}
      <Route path="/form/:formId" element={<FormViewer />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder/:formId?"
        element={
          <ProtectedRoute>
            <FormBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/:formId?"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/form-responses/:formId"
        element={
          <ProtectedRoute>
            <FormResponses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <Forms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/import"
        element={
          <ProtectedRoute>
            <Import />
          </ProtectedRoute>
        }
      />
      <Route
        path="/integrations"
        element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/webhooks"
        element={
          <ProtectedRoute>
            <Webhooks />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

// Main App Component
export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light"
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [])

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}
