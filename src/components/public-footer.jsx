"use client"

import { useNavigate, useLocation } from "react-router-dom"

export default function PublicFooter() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLinkClick = (path, e) => {
    e.preventDefault()
    if (path.startsWith("#")) {
      if (location.pathname === "/") {
        const element = document.getElementById(path.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        navigate(`/${path}`)
      }
    } else {
      navigate(path)
      window.scrollTo(0, 0)
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div
              className="flex items-center space-x-2 mb-4 cursor-pointer"
              onClick={() => {
                navigate("/")
                window.scrollTo(0, 0)
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">FormWise</span>
            </div>
            <p className="text-gray-400 mb-4">
              Create beautiful, intelligent forms that your users will love.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleLinkClick("#features", e)}
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleLinkClick("#pricing", e)}
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/templates"
                  onClick={(e) => handleLinkClick("/templates", e)}
                  className="hover:text-white transition-colors"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="/integrations"
                  onClick={(e) => handleLinkClick("/integrations", e)}
                  className="hover:text-white transition-colors"
                >
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick("/about", e)}
                  className="hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLinkClick("/blog", e)}
                  className="hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick("/contact", e)}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="/help"
                  onClick={(e) => handleLinkClick("/help", e)}
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/documentation"
                  onClick={(e) => handleLinkClick("/documentation", e)}
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/api-reference"
                  onClick={(e) => handleLinkClick("/api-reference", e)}
                  className="hover:text-white transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  onClick={(e) => handleLinkClick("/status", e)}
                  className="hover:text-white transition-colors"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FormWise. All rights reserved.</p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a
              href="/privacy"
              onClick={(e) => handleLinkClick("/privacy", e)}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLinkClick("/terms", e)}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              onClick={(e) => handleLinkClick("/cookies", e)}
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
