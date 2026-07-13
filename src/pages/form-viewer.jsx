"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send, CheckCircle, AlertCircle, Star, Upload, ImageIcon, Clock, Shield } from 'lucide-react'
import { useForms, useFormResponses } from "../hooks/use-forms"

export default function FormViewer() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { getForm, incrementFormViews } = useForms()
  const { submitResponse } = useFormResponses()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const loadForm = async () => {
      try {
        const formData = await getForm(formId)
        if (formData && formData.status === "published") {
          setForm(formData)
          await incrementFormViews(formId)
        } else {
          navigate("/404")
        }
      } catch (error) {
        console.error("Error loading form:", error)
        navigate("/404")
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [formId, getForm, incrementFormViews, navigate])

  const validateField = (field, value) => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address"
      }
    }

    if (field.type === "phone" && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        return "Please enter a valid phone number"
      }
    }

    if (field.type === "url" && value) {
      try {
        new URL(value)
      } catch {
        return "Please enter a valid URL"
      }
    }

    if (field.validation) {
      if (field.validation.minLength && value && value.length < field.validation.minLength) {
        return `Minimum ${field.validation.minLength} characters required`
      }
      if (field.validation.maxLength && value && value.length > field.validation.maxLength) {
        return `Maximum ${field.validation.maxLength} characters allowed`
      }
    }

    return null
  }

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {}
    form.fields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      await submitResponse(formId, formData, {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
      })
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field) => {
    const value = formData[field.id] || ""
    const error = errors[field.id]
    const baseClasses = `w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
      error ? "border-red-300 bg-red-50" : "border-gray-300"
    }`

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
      case "url":
        return (
          <input
            type={field.type === "phone" ? "tel" : field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseClasses}
            required={field.required}
          />
        )

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={`${baseClasses} h-24 resize-none`}
            required={field.required}
          />
        )

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option)
                    handleInputChange(field.id, newValues)
                  }}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            <option value="">Choose an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(field.id, star)}
                className={`w-8 h-8 ${
                  value >= star ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
          </div>
        )

      case "file":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
            <input
              type="file"
              onChange={(e) => handleInputChange(field.id, e.target.files[0])}
              className="hidden"
              id={`file-${field.id}`}
            />
            <label
              htmlFor={`file-${field.id}`}
              className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
            >
              Choose File
            </label>
          </div>
        )

      case "image":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange(field.id, e.target.files[0])}
              className="hidden"
              id={`image-${field.id}`}
            />
            <label
              htmlFor={`image-${field.id}`}
              className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
            >
              Choose Image
            </label>
          </div>
        )

      default:
        return <div className="text-gray-400 text-sm">Unknown field type</div>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            {form.settings?.thankYouMessage || "Your response has been submitted successfully."}
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-4 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-purple-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </button>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: form.settings?.backgroundColor || "#ffffff",
            color: form.settings?.textColor || "#1f2937",
          }}
        >
          {/* Form Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: form.settings?.textColor }}>
              {form.title}
            </h1>
            {form.description && <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{form.description}</p>}

            {/* Form Info */}
            <div className="flex items-center space-x-4 sm:space-x-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>~{Math.max(2, Math.ceil(form.fields?.length * 0.5))} min</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-6">
              {form.fields?.map((field, index) => (
                <motion.div
                  key={field.id}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-900">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.description && <p className="text-sm text-gray-600 mb-2">{field.description}</p>}

                  {renderField(field)}

                  {errors[field.id] && (
                    <div className="flex items-center text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors[field.id]}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {form.settings?.submitButtonText || "Submit"}
                  </>
                )}
              </motion.button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Powered by{" "}
                <a href="/" className="text-purple-600 hover:text-purple-700 font-medium">
                  FormWise
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}