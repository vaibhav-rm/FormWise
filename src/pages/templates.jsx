"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Star,
  Eye,
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  Briefcase,
  GraduationCap,
  ShoppingCart,
  MessageSquare,
  Zap,
  Plus,
  Grid3X3,
  List,
  Menu,
  X,
  Filter,
  Clock,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  CheckCircle,
  Layers,
  CreditCard,
  GitBranch,
  Heart,
  Scale,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlignLeft,
  Hash,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"
import { useForms } from "../hooks/use-forms"

export default function Templates() {
  const navigate = useNavigate()
  const { createForm } = useForms()
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filterPayment, setFilterPayment] = useState(false)
  const [filterMultiStep, setFilterMultiStep] = useState(false)
  const [filterLogic, setFilterLogic] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState("all")

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = [
    { id: "all", label: "All Templates", icon: <Grid3X3 className="w-4 h-4" />, count: 31 },
    { id: "contact", label: "Contact", icon: <MessageSquare className="w-4 h-4" />, count: 6 },
    { id: "survey", label: "Surveys", icon: <FileText className="w-4 h-4" />, count: 5 },
    { id: "event", label: "Events", icon: <Calendar className="w-4 h-4" />, count: 4 },
    { id: "business", label: "Business", icon: <Briefcase className="w-4 h-4" />, count: 3 },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" />, count: 3 },
    { id: "ecommerce", label: "E-commerce", icon: <ShoppingCart className="w-4 h-4" />, count: 6 },
    { id: "hr", label: "HR & Recruiting", icon: <Users className="w-4 h-4" />, count: 2 },
    { id: "healthcare", label: "Healthcare", icon: <Heart className="w-4 h-4" />, count: 2 },
  ]

  const templates = [
    // Contact Forms
    {
      id: "1",
      title: "Simple Contact Form",
      description: "Clean and minimal contact form perfect for any website",
      category: "contact",
      fields: 4,
      uses: 25600,
      rating: 4.9,
      preview: ["Full Name", "Email Address", "Subject", "Message"],
      isPremium: false,
      isHot: true,
      tags: ["basic", "contact", "simple", "minimal"],
      difficulty: "Beginner",
      estimatedTime: "2 min",
      features: ["Email notifications", "Auto-response", "Spam protection"],
      industry: ["General", "Business", "Portfolio"],
      responsive: true,
      multiStep: false,
      hasLogic: false,
      hasPayment: false,
      templateFields: [
        { id: "c1", type: "text", label: "Full Name", required: true, placeholder: "Jane Doe" },
        { id: "c2", type: "email", label: "Email Address", required: true, placeholder: "jane@example.com" },
        { id: "c3", type: "text", label: "Subject", required: true, placeholder: "How can we help you?" },
        { id: "c4", type: "textarea", label: "Message", required: true, placeholder: "Write your message here..." },
      ],
      submitButtonText: "Send Message",
      thankYouMessage: "✅ Thank you for reaching out! We'll get back to you within 24 hours.",
    },
    {
      id: "2",
      title: "Advanced Contact Form",
      description: "Feature-rich contact form with file uploads and department routing",
      category: "contact",
      fields: 8,
      uses: 18400,
      rating: 4.8,
      preview: ["Contact Info", "Department", "Priority", "File Upload", "Message"],
      isPremium: true,
      tags: ["advanced", "contact", "upload", "routing"],
      difficulty: "Intermediate",
      estimatedTime: "5 min",
      features: ["File uploads", "Department routing", "Priority levels", "Auto-assignment"],
      industry: ["Business", "Support", "Enterprise"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
      templateFields: [
        { id: "ac1", type: "text", label: "Full Name", required: true, placeholder: "Your full name" },
        { id: "ac2", type: "email", label: "Email Address", required: true, placeholder: "you@company.com" },
        { id: "ac3", type: "phone", label: "Phone Number", required: false, placeholder: "+1 555 000 0000" },
        { id: "ac4", type: "select", label: "Department", required: true, options: ["Sales", "Technical Support", "Billing & Accounts", "General Enquiry", "Partnerships"] },
        { id: "ac5", type: "radio", label: "Priority Level", required: true, options: ["Low — general question", "Medium — need help soon", "High — urgent issue", "Critical — system down"] },
        { id: "ac6", type: "text", label: "Subject", required: true, placeholder: "Brief description of your issue" },
        { id: "ac7", type: "textarea", label: "Detailed Message", required: true, placeholder: "Please describe your issue in detail, including any steps to reproduce or context..." },
        { id: "ac8", type: "file", label: "Attachments (optional)", required: false, options: [] },
      ],
      submitButtonText: "Submit Request",
      thankYouMessage: "Your request has been received and routed to the right team. Expect a response based on your selected priority level.",
    },
    {
      id: "3",
      title: "Newsletter Signup",
      description: "Optimized newsletter subscription form with preferences",
      category: "contact",
      fields: 5,
      uses: 32100,
      rating: 4.9,
      preview: ["Email", "First Name", "Interests", "Frequency", "Consent"],
      isPremium: false,
      isHot: true,
      tags: ["newsletter", "subscription", "email", "marketing"],
      difficulty: "Beginner",
      estimatedTime: "3 min",
      features: ["Email validation", "Preference selection", "GDPR compliant", "Double opt-in"],
      industry: ["Marketing", "Media", "E-commerce"],
      responsive: true,
      multiStep: false,
      hasLogic: false,
      hasPayment: false,
      templateFields: [
        { id: "ns1", type: "text", label: "First Name", required: true, placeholder: "Your first name" },
        { id: "ns2", type: "email", label: "Email Address", required: true, placeholder: "your@email.com" },
        { id: "ns3", type: "checkbox", label: "Interests", required: false, options: ["Product Updates", "Industry News", "Tutorials & How-tos", "Promotions & Offers", "Case Studies"] },
        { id: "ns4", type: "radio", label: "Email Frequency", required: true, options: ["Daily digest", "Weekly roundup", "Monthly newsletter", "Only major announcements"] },
        { id: "ns5", type: "checkbox", label: "Consent", required: true, options: ["I agree to receive marketing emails and accept the Privacy Policy"] },
      ],
      submitButtonText: "Subscribe →",
      thankYouMessage: "🎉 Welcome aboard! Check your inbox for a confirmation email.",
    },

    // Surveys & Feedback
    {
      id: "4",
      title: "Customer Satisfaction Survey",
      description: "Comprehensive survey to measure customer satisfaction and loyalty",
      category: "survey",
      fields: 12,
      uses: 15800,
      rating: 4.8,
      preview: ["Overall Rating", "Service Quality", "Likelihood to Recommend", "Comments"],
      isPremium: false,
      tags: ["survey", "feedback", "rating", "nps"],
      difficulty: "Intermediate",
      estimatedTime: "8 min",
      features: ["Rating scales", "NPS scoring", "Conditional logic", "Analytics dashboard"],
      industry: ["Retail", "Service", "SaaS"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
      templateFields: [
        { id: "cs1", type: "rating", label: "Overall Satisfaction", required: true },
        { id: "cs2", type: "rating", label: "Service Quality", required: true },
        { id: "cs3", type: "rating", label: "Value for Money", required: true },
        { id: "cs4", type: "rating", label: "Ease of Use / Process", required: true },
        { id: "cs5", type: "radio", label: "How likely are you to recommend us? (NPS)", required: true, options: ["0 — Not at all", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10 — Extremely likely"] },
        { id: "cs6", type: "select", label: "How long have you been a customer?", required: false, options: ["Less than 1 month", "1–6 months", "6–12 months", "1–2 years", "Over 2 years"] },
        { id: "cs7", type: "checkbox", label: "Which aspects did you like most?", required: false, options: ["Customer support", "Product quality", "Pricing", "Speed of delivery", "Website experience", "Communication"] },
        { id: "cs8", type: "textarea", label: "What could we improve?", required: false, placeholder: "Your feedback helps us get better..." },
        { id: "cs9", type: "textarea", label: "Any other comments or testimonial?", required: false, placeholder: "Feel free to share a testimonial we can use on our website!" },
      ],
      submitButtonText: "Submit Feedback",
      thankYouMessage: "Thank you for your valuable feedback! It helps us improve every day.",
    },
    {
      id: "5",
      title: "Product Feedback Form",
      description: "Collect detailed feedback about your products and features",
      category: "survey",
      fields: 10,
      uses: 12300,
      rating: 4.7,
      preview: ["Product Rating", "Usage Frequency", "Feature Requests", "Testimonial"],
      isPremium: false,
      tags: ["product", "feedback", "features", "improvement"],
      difficulty: "Beginner",
      estimatedTime: "6 min",
      features: ["Star ratings", "Usage tracking", "Feature prioritization", "Testimonial collection"],
      industry: ["SaaS", "Technology", "E-commerce"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
      templateFields: [
        { id: "pf1", type: "text", label: "Product / Feature Name", required: true, placeholder: "Which product are you reviewing?" },
        { id: "pf2", type: "rating", label: "Overall Product Rating", required: true },
        { id: "pf3", type: "select", label: "How often do you use this product?", required: true, options: ["Daily", "Several times a week", "Weekly", "Monthly", "Rarely"] },
        { id: "pf4", type: "checkbox", label: "What features do you love most?", required: false, options: ["Performance", "Design & UI", "Reliability", "Integrations", "Customer support", "Pricing", "Documentation"] },
        { id: "pf5", type: "checkbox", label: "What features are missing?", required: false, options: ["Mobile app", "API access", "Advanced reporting", "Team collaboration", "Custom branding", "Offline mode"] },
        { id: "pf6", type: "textarea", label: "What problem does this product solve for you?", required: false, placeholder: "Describe how this product helps you..." },
        { id: "pf7", type: "radio", label: "Would you recommend this product?", required: true, options: ["Definitely yes", "Probably yes", "Not sure", "Probably not", "Definitely not"] },
        { id: "pf8", type: "textarea", label: "Your Testimonial (optional)", required: false, placeholder: "Share a quote we can use on our website..." },
      ],
      submitButtonText: "Submit Feedback",
      thankYouMessage: "Thank you for your product feedback! Your insights directly shape our roadmap.",
    },
    {
      id: "6",
      title: "Employee Engagement Survey",
      description: "Measure employee satisfaction and engagement levels",
      category: "survey",
      fields: 15,
      uses: 8900,
      rating: 4.6,
      preview: ["Job Satisfaction", "Work-Life Balance", "Management Rating", "Suggestions"],
      isPremium: true,
      tags: ["employee", "engagement", "hr", "satisfaction"],
      difficulty: "Advanced",
      estimatedTime: "12 min",
      features: ["Anonymous responses", "Department filtering", "Benchmark scoring", "Action planning"],
      industry: ["HR", "Corporate", "Consulting"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },

    // Events & Registration
    {
      id: "7",
      title: "Event Registration Form",
      description: "Complete event registration with payment and ticket selection",
      category: "event",
      fields: 15,
      uses: 11200,
      rating: 4.8,
      preview: ["Personal Info", "Ticket Type", "Dietary Requirements", "Payment"],
      isPremium: true,
      tags: ["event", "registration", "payment", "tickets"],
      difficulty: "Advanced",
      estimatedTime: "10 min",
      features: ["Payment processing", "Ticket management", "QR codes", "Email confirmations"],
      industry: ["Events", "Conference", "Entertainment"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: true,
    },
    {
      id: "8",
      title: "Workshop Registration",
      description: "Simple workshop signup with session selection",
      category: "event",
      fields: 8,
      uses: 7600,
      rating: 4.5,
      preview: ["Name", "Email", "Workshop Selection", "Experience Level"],
      isPremium: false,
      tags: ["workshop", "training", "education", "signup"],
      difficulty: "Beginner",
      estimatedTime: "4 min",
      features: ["Session selection", "Capacity limits", "Waitlist management", "Reminders"],
      industry: ["Education", "Training", "Professional"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
    },

    // Business & Marketing
    {
      id: "9",
      title: "Lead Generation Form",
      description: "High-converting lead capture form for marketing campaigns",
      category: "business",
      fields: 6,
      uses: 19400,
      rating: 4.9,
      preview: ["Company Info", "Contact Details", "Budget Range", "Requirements"],
      isPremium: true,
      tags: ["lead", "generation", "marketing", "sales"],
      difficulty: "Intermediate",
      estimatedTime: "5 min",
      features: ["Lead scoring", "CRM integration", "Follow-up automation", "Conversion tracking"],
      industry: ["B2B", "Sales", "Marketing"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "10",
      title: "Quote Request Form",
      description: "Professional quote request form for service businesses",
      category: "business",
      fields: 12,
      uses: 9800,
      rating: 4.6,
      preview: ["Service Type", "Project Details", "Timeline", "Budget"],
      isPremium: false,
      tags: ["quote", "request", "service", "pricing"],
      difficulty: "Intermediate",
      estimatedTime: "7 min",
      features: ["Service selection", "File uploads", "Auto-pricing", "Quote generation"],
      industry: ["Service", "Consulting", "Agency"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },

    // HR & Recruitment
    {
      id: "11",
      title: "Job Application Form",
      description: "Comprehensive job application with resume upload and screening",
      category: "hr",
      fields: 18,
      uses: 14500,
      rating: 4.7,
      preview: ["Personal Details", "Experience", "Skills", "Resume Upload"],
      isPremium: false,
      tags: ["job", "application", "hr", "resume", "recruitment"],
      difficulty: "Advanced",
      estimatedTime: "15 min",
      features: ["Resume parsing", "Skill assessment", "Video interviews", "ATS integration"],
      industry: ["HR", "Recruitment", "Corporate"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "12",
      title: "Employee Onboarding",
      description: "Streamlined onboarding form for new employees",
      category: "hr",
      fields: 20,
      uses: 6700,
      rating: 4.5,
      preview: ["Personal Info", "Emergency Contacts", "Tax Forms", "Equipment Request"],
      isPremium: true,
      tags: ["onboarding", "employee", "hr", "documentation"],
      difficulty: "Advanced",
      estimatedTime: "20 min",
      features: ["Document upload", "E-signatures", "Progress tracking", "Compliance checks"],
      industry: ["HR", "Corporate", "Government"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },

    // Education
    {
      id: "13",
      title: "Course Evaluation",
      description: "Student course evaluation and instructor feedback form",
      category: "education",
      fields: 14,
      uses: 8200,
      rating: 4.6,
      preview: ["Course Rating", "Instructor Feedback", "Content Quality", "Suggestions"],
      isPremium: false,
      tags: ["education", "course", "evaluation", "feedback"],
      difficulty: "Intermediate",
      estimatedTime: "8 min",
      features: ["Anonymous feedback", "Rating scales", "Comparative analysis", "Report generation"],
      industry: ["Education", "Training", "University"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "14",
      title: "Student Registration",
      description: "Complete student registration with course selection",
      category: "education",
      fields: 16,
      uses: 5900,
      rating: 4.4,
      preview: ["Student Info", "Course Selection", "Prerequisites", "Payment"],
      isPremium: true,
      tags: ["student", "registration", "course", "enrollment"],
      difficulty: "Advanced",
      estimatedTime: "12 min",
      features: ["Course catalog", "Prerequisite checking", "Payment processing", "Schedule conflicts"],
      industry: ["Education", "University", "Training"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: true,
    },

    // E-commerce & Order Forms
    {
      id: "15",
      title: "Product Order Form",
      description: "Complete multi-step product order form with catalog, quantities, shipping, and payment collection",
      category: "ecommerce",
      fields: 16,
      uses: 24600,
      rating: 4.9,
      preview: ["Product Selection", "Quantity & Variants", "Shipping Address", "Payment Details"],
      isPremium: true,
      tags: ["ecommerce", "order", "payment", "shipping", "product", "catalog"],
      difficulty: "Advanced",
      estimatedTime: "10 min",
      features: ["Product catalog", "Variant selection", "Shipping calculator", "Payment gateway", "Order confirmation", "Stock tracking"],
      industry: ["E-commerce", "Retail", "D2C", "Marketplace"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: true,
      templateFields: [
        { id: "f1", type: "text", label: "Full Name", required: true, placeholder: "John Doe" },
        { id: "f2", type: "email", label: "Email Address", required: true, placeholder: "john@example.com" },
        { id: "f3", type: "phone", label: "Phone Number", required: true, placeholder: "+91 9999999999" },
        { id: "f4", type: "select", label: "Product Category", required: true, options: ["Electronics", "Clothing & Apparel", "Home & Garden", "Sports & Fitness", "Books & Stationery", "Health & Beauty"] },
        { id: "f5", type: "text", label: "Product Name / SKU", required: true, placeholder: "e.g. Premium Wireless Headphones XZ-900" },
        { id: "f6", type: "radio", label: "Size / Variant", required: false, options: ["Small", "Medium", "Large", "XL", "One Size / Not Applicable"] },
        { id: "f7", type: "select", label: "Color / Finish", required: false, options: ["Black", "White", "Silver", "Gold", "Rose Gold", "Other"] },
        { id: "f8", type: "number", label: "Quantity", required: true, placeholder: "1" },
        { id: "f9", type: "select", label: "Shipping Method", required: true, options: ["Standard (5-7 days) - Free", "Express (2-3 days) - ₹99", "Overnight (Next Day) - ₹299", "Click & Collect - Free"] },
        { id: "f10", type: "textarea", label: "Delivery Address", required: true, placeholder: "House/Flat No., Street, Area..." },
        { id: "f11", type: "text", label: "City", required: true, placeholder: "Mumbai" },
        { id: "f12", type: "text", label: "State / Province", required: true, placeholder: "Maharashtra" },
        { id: "f13", type: "text", label: "PIN / ZIP Code", required: true, placeholder: "400001" },
        { id: "f14", type: "radio", label: "Payment Method", required: true, options: ["UPI / GPay / PhonePe", "Debit / Credit Card", "Net Banking", "Cash on Delivery", "EMI (0% interest)"] },
        { id: "f15", type: "textarea", label: "Special Instructions", required: false, placeholder: "Gift wrapping, engraving, delivery timing preferences..." },
        { id: "f16", type: "checkbox", label: "Consent & Policies", required: true, options: ["I agree to the Terms & Conditions", "I confirm my order details are correct", "Subscribe me to order updates via SMS/Email"] },
      ],
      submitButtonText: "Place Order →",
      thankYouMessage: "🎉 Your order has been placed successfully! You will receive a confirmation email shortly with your order ID and tracking details.",
    },
    {
      id: "16",
      title: "Service Order Form",
      description: "Professional service request & booking form for freelancers, agencies, and service businesses",
      category: "ecommerce",
      fields: 14,
      uses: 18200,
      rating: 4.8,
      preview: ["Service Selection", "Project Brief", "Timeline & Budget", "Contact & Payment"],
      isPremium: false,
      tags: ["service", "order", "booking", "freelance", "agency", "request"],
      difficulty: "Intermediate",
      estimatedTime: "7 min",
      features: ["Service catalog", "Project briefing", "Budget estimation", "Timeline selection", "File attachment", "Auto-quote"],
      industry: ["Agency", "Freelance", "Consulting", "Design", "Development", "Marketing"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
      templateFields: [
        { id: "s1", type: "text", label: "Your Name / Company", required: true, placeholder: "Acme Corp or Jane Doe" },
        { id: "s2", type: "email", label: "Business Email", required: true, placeholder: "hello@company.com" },
        { id: "s3", type: "phone", label: "Contact Number", required: false, placeholder: "+91 9000000000" },
        { id: "s4", type: "select", label: "Service Required", required: true, options: ["Website Design & Development", "Mobile App Development", "Graphic Design & Branding", "SEO & Digital Marketing", "Content Writing & Copywriting", "Video Production & Editing", "Data Analysis & Reporting", "Custom Software Solution"] },
        { id: "s5", type: "checkbox", label: "Specific Deliverables", required: false, options: ["Landing Page", "Full Website", "Logo & Brand Kit", "Social Media Assets", "Marketing Copy", "SEO Audit Report", "Analytics Dashboard", "API Integration"] },
        { id: "s6", type: "textarea", label: "Project Description", required: true, placeholder: "Tell us about your project goals, target audience, and key requirements..." },
        { id: "s7", type: "select", label: "Project Timeline", required: true, options: ["ASAP (Rush — premium pricing applies)", "Within 1 week", "2–4 weeks", "1–2 months", "3–6 months", "Flexible / Ongoing"] },
        { id: "s8", type: "select", label: "Budget Range", required: true, options: ["Under ₹10,000", "₹10,000 – ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹5,00,000", "₹5,00,000+", "Let's discuss"] },
        { id: "s9", type: "radio", label: "How Did You Hear About Us?", required: false, options: ["Google Search", "Social Media", "Referral from a friend", "LinkedIn", "Previous client", "Other"] },
        { id: "s10", type: "url", label: "Your Website / Portfolio (optional)", required: false, placeholder: "https://yourwebsite.com" },
        { id: "s11", type: "file", label: "Attach Reference Files / Brief", required: false, options: [] },
        { id: "s12", type: "select", label: "Preferred Communication", required: true, options: ["Email", "WhatsApp", "Phone Call", "Video Call (Zoom/Meet)", "Slack"] },
        { id: "s13", type: "radio", label: "Engagement Type", required: true, options: ["One-time project", "Monthly retainer", "Hourly / ad-hoc", "Ongoing partnership"] },
        { id: "s14", type: "checkbox", label: "Agreements", required: true, options: ["I understand a discovery call may be needed before a quote", "I agree to the service terms and privacy policy"] },
      ],
      submitButtonText: "Request a Quote →",
      thankYouMessage: "✅ Thanks for your service request! Our team will review your brief and get back to you within 24 business hours with a detailed proposal.",
    },
    {
      id: "17",
      title: "B2B Purchase Order Form",
      description: "Enterprise-grade purchase order form for bulk procurement, vendor management, and corporate purchasing",
      category: "ecommerce",
      fields: 18,
      uses: 11400,
      rating: 4.7,
      preview: ["Company Details", "Order Line Items", "Delivery Terms", "Approval & Authorization"],
      isPremium: true,
      tags: ["b2b", "purchase order", "procurement", "enterprise", "bulk", "corporate", "vendor"],
      difficulty: "Advanced",
      estimatedTime: "15 min",
      features: ["Line item ordering", "Tax & GST handling", "Vendor selection", "Approval workflow", "PO number generation", "Multi-signatory"],
      industry: ["Enterprise", "Manufacturing", "Wholesale", "Government", "Healthcare", "Education"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
      templateFields: [
        { id: "b1", type: "text", label: "Company / Organization Name", required: true, placeholder: "Acme Industries Pvt. Ltd." },
        { id: "b2", type: "text", label: "Purchase Order Number (PO #)", required: true, placeholder: "PO-2026-00123" },
        { id: "b3", type: "date", label: "Order Date", required: true },
        { id: "b4", type: "date", label: "Required Delivery Date", required: true },
        { id: "b5", type: "text", label: "Authorized Buyer Name", required: true, placeholder: "Full name of the person raising this PO" },
        { id: "b6", type: "text", label: "Buyer Designation", required: true, placeholder: "e.g. Purchase Manager" },
        { id: "b7", type: "email", label: "Buyer Email", required: true, placeholder: "buyer@company.com" },
        { id: "b8", type: "phone", label: "Buyer Phone", required: true, placeholder: "+91 9000000000" },
        { id: "b9", type: "text", label: "Vendor / Supplier Name", required: true, placeholder: "Supplier Company Ltd." },
        { id: "b10", type: "text", label: "GST Number (GSTIN)", required: false, placeholder: "22AAAAA0000A1Z5" },
        { id: "b11", type: "textarea", label: "Item 1: Description, Quantity & Unit Price", required: true, placeholder: "e.g. Laptop HP EliteBook 840 G9 × 10 units @ ₹85,000 each" },
        { id: "b12", type: "textarea", label: "Item 2: Description, Quantity & Unit Price (if applicable)", required: false, placeholder: "e.g. USB-C Docking Station × 10 units @ ₹4,500 each" },
        { id: "b13", type: "textarea", label: "Item 3: Description, Quantity & Unit Price (if applicable)", required: false, placeholder: "Add more line items as needed" },
        { id: "b14", type: "select", label: "Tax / GST Applicable", required: true, options: ["GST @ 5%", "GST @ 12%", "GST @ 18%", "GST @ 28%", "Tax Exempt / Zero Rated", "Outside Tax Jurisdiction"] },
        { id: "b15", type: "select", label: "Payment Terms", required: true, options: ["100% Advance", "50% Advance, 50% on Delivery", "Net 30 Days", "Net 60 Days", "Net 90 Days", "Letter of Credit (LC)"] },
        { id: "b16", type: "textarea", label: "Shipping / Delivery Address", required: true, placeholder: "Complete delivery address including landmark and PIN code" },
        { id: "b17", type: "select", label: "Freight Terms", required: true, options: ["FOB - Buyer's Warehouse", "CIF - Seller Bears Freight", "Ex-Works (EXW)", "Delivered Duty Paid (DDP)"] },
        { id: "b18", type: "textarea", label: "Special Terms, Conditions & Notes", required: false, placeholder: "Any warranties, certifications required, packaging specs, or special handling instructions..." },
      ],
      submitButtonText: "Submit Purchase Order →",
      thankYouMessage: "📋 Your Purchase Order has been submitted successfully. A copy will be emailed to the buyer and vendor. The vendor will confirm receipt within 1 business day.",
    },
    {
      id: "18",
      title: "Return Request Form",
      description: "Customer return and refund request form",
      category: "ecommerce",
      fields: 10,
      uses: 7300,
      rating: 4.3,
      preview: ["Order Details", "Return Reason", "Condition", "Refund Method"],
      isPremium: false,
      tags: ["return", "refund", "customer service", "ecommerce"],
      difficulty: "Intermediate",
      estimatedTime: "6 min",
      features: ["Order lookup", "Photo upload", "Return tracking", "Automated processing"],
      industry: ["E-commerce", "Retail", "Customer Service"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
      templateFields: [
        { id: "r1", type: "text", label: "Order ID", required: true, placeholder: "e.g. ORD-20260001" },
        { id: "r2", type: "text", label: "Full Name", required: true, placeholder: "Name as per order" },
        { id: "r3", type: "email", label: "Email Address", required: true, placeholder: "email used during purchase" },
        { id: "r4", type: "text", label: "Product Name", required: true, placeholder: "Name of the item to return" },
        { id: "r5", type: "number", label: "Quantity to Return", required: true, placeholder: "1" },
        { id: "r6", type: "select", label: "Reason for Return", required: true, options: ["Damaged / Defective item", "Wrong item received", "Item not as described", "Changed my mind", "Duplicate order", "Quality not satisfactory"] },
        { id: "r7", type: "radio", label: "Item Condition", required: true, options: ["Unopened / Unused", "Opened but unused", "Used - like new", "Damaged on arrival"] },
        { id: "r8", type: "radio", label: "Preferred Resolution", required: true, options: ["Full Refund to original payment method", "Store Credit / Wallet", "Exchange for same item", "Exchange for different item"] },
        { id: "r9", type: "image", label: "Upload Product Photo (optional)", required: false, options: [] },
        { id: "r10", type: "textarea", label: "Additional Comments", required: false, placeholder: "Any additional information about your return..." },
      ],
      submitButtonText: "Submit Return Request",
      thankYouMessage: "Your return request has been received. We will process it within 2-3 business days and send you a return shipping label via email.",
    },

    // Healthcare
    {
      id: "19",
      title: "Patient Intake Form",
      description: "Comprehensive new patient registration and medical history form for clinics and hospitals",
      category: "healthcare",
      fields: 20,
      uses: 13400,
      rating: 4.8,
      preview: ["Personal Info", "Medical History", "Current Medications", "Insurance Details"],
      isPremium: true,
      isNew: true,
      tags: ["healthcare", "medical", "patient", "intake", "clinic", "hospital"],
      difficulty: "Intermediate",
      estimatedTime: "10 min",
      features: ["HIPAA-ready structure", "Medical history", "Medication list", "Insurance capture", "Emergency contacts", "Consent forms"],
      industry: ["Healthcare", "Clinic", "Hospital", "Dental", "Telemedicine"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
      templateFields: [
        { id: "pi1", type: "text", label: "Patient Full Name", required: true, placeholder: "First and Last Name" },
        { id: "pi2", type: "date", label: "Date of Birth", required: true },
        { id: "pi3", type: "radio", label: "Gender", required: true, options: ["Male", "Female", "Non-binary", "Prefer not to say"] },
        { id: "pi4", type: "text", label: "Patient ID / Aadhaar Number", required: false, placeholder: "Government ID for records" },
        { id: "pi5", type: "phone", label: "Contact Number", required: true, placeholder: "+91 9000000000" },
        { id: "pi6", type: "email", label: "Email Address", required: false, placeholder: "patient@email.com" },
        { id: "pi7", type: "textarea", label: "Home Address", required: true, placeholder: "Full residential address" },
        { id: "pi8", type: "text", label: "Emergency Contact Name", required: true, placeholder: "Name of emergency contact" },
        { id: "pi9", type: "phone", label: "Emergency Contact Phone", required: true, placeholder: "+91 9000000000" },
        { id: "pi10", type: "text", label: "Relationship to Patient", required: true, placeholder: "e.g. Spouse, Parent, Sibling" },
        { id: "pi11", type: "select", label: "Blood Group", required: false, options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"] },
        { id: "pi12", type: "checkbox", label: "Known Allergies", required: false, options: ["Penicillin", "Sulfa drugs", "Aspirin", "Latex", "Peanuts", "Shellfish", "No known allergies"] },
        { id: "pi13", type: "checkbox", label: "Existing Medical Conditions", required: false, options: ["Diabetes", "Hypertension", "Asthma", "Heart disease", "Thyroid disorder", "Kidney disease", "Cancer (current/past)", "None"] },
        { id: "pi14", type: "textarea", label: "Current Medications", required: false, placeholder: "List all medications with dosage and frequency..." },
        { id: "pi15", type: "textarea", label: "Past Surgeries / Hospitalizations", required: false, placeholder: "Describe any previous surgeries or major hospitalizations..." },
        { id: "pi16", type: "select", label: "Primary Insurance Provider", required: false, options: ["Star Health", "HDFC ERGO", "Niva Bupa", "Care Health", "Bajaj Allianz", "ICICI Lombard", "Government / CGHS", "Self-pay (no insurance)"] },
        { id: "pi17", type: "text", label: "Insurance Policy Number", required: false, placeholder: "Policy / Member ID" },
        { id: "pi18", type: "textarea", label: "Reason for Visit / Chief Complaint", required: true, placeholder: "What brings you in today?" },
        { id: "pi19", type: "radio", label: "Have you visited this clinic before?", required: true, options: ["Yes — returning patient", "No — new patient"] },
        { id: "pi20", type: "checkbox", label: "Consent", required: true, options: ["I consent to examination and treatment", "I authorize sharing of medical records as needed", "I have read and accept the Privacy Policy"] },
      ],
      submitButtonText: "Complete Registration",
      thankYouMessage: "Thank you for completing your intake form. Our staff will review your information before your appointment. Please arrive 10 minutes early.",
    },
    {
      id: "20",
      title: "Appointment Booking Form",
      description: "Simple and fast appointment scheduling form for clinics, doctors, and wellness centers",
      category: "healthcare",
      fields: 10,
      uses: 9800,
      rating: 4.7,
      preview: ["Patient Name", "Doctor / Department", "Preferred Date & Time", "Reason for Visit"],
      isPremium: false,
      isNew: true,
      tags: ["appointment", "booking", "healthcare", "doctor", "clinic", "schedule"],
      difficulty: "Beginner",
      estimatedTime: "4 min",
      features: ["Date & time picker", "Department selection", "Doctor preference", "SMS confirmation", "Reschedule support"],
      industry: ["Healthcare", "Dental", "Wellness", "Physiotherapy", "Mental Health"],
      responsive: true,
      multiStep: false,
      hasLogic: false,
      hasPayment: false,
      templateFields: [
        { id: "ab1", type: "text", label: "Patient Full Name", required: true, placeholder: "Your full name" },
        { id: "ab2", type: "phone", label: "Mobile Number", required: true, placeholder: "+91 9000000000" },
        { id: "ab3", type: "email", label: "Email Address", required: false, placeholder: "optional, for email confirmation" },
        { id: "ab4", type: "select", label: "Department / Specialty", required: true, options: ["General Medicine", "Cardiology", "Dermatology", "Orthopedics", "Pediatrics", "Gynecology", "Neurology", "ENT", "Ophthalmology", "Psychiatry", "Dental"] },
        { id: "ab5", type: "text", label: "Preferred Doctor (optional)", required: false, placeholder: "Dr. Name or leave blank for next available" },
        { id: "ab6", type: "date", label: "Preferred Appointment Date", required: true },
        { id: "ab7", type: "radio", label: "Preferred Time Slot", required: true, options: ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)", "Any available"] },
        { id: "ab8", type: "radio", label: "Appointment Type", required: true, options: ["In-person consultation", "Video / Teleconsultation", "Home visit (if available)"] },
        { id: "ab9", type: "textarea", label: "Brief Reason for Visit", required: true, placeholder: "Describe your symptoms or reason for the appointment..." },
        { id: "ab10", type: "radio", label: "Are you a new or returning patient?", required: true, options: ["New patient", "Returning patient"] },
      ],
      submitButtonText: "Book Appointment",
      thankYouMessage: "🗓️ Your appointment request has been received! We will confirm your slot via SMS/WhatsApp within 2 hours.",
    },
  ]

  const featuredTemplates = templates.filter((t) => t.uses > 15000).slice(0, 3)
  const trendingTemplates = templates.filter((t) => t.rating >= 4.8).slice(0, 4)
  const newTemplates = templates.filter((t) => t.isNew)

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
      const matchesPayment = !filterPayment || template.hasPayment
      const matchesMultiStep = !filterMultiStep || template.multiStep
      const matchesLogic = !filterLogic || template.hasLogic
      const matchesDifficulty = filterDifficulty === "all" || template.difficulty === filterDifficulty

      return matchesSearch && matchesCategory && matchesPayment && matchesMultiStep && matchesLogic && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.uses - a.uses
        case "rating":
          return b.rating - a.rating
        case "newest":
          return 0 // Would sort by creation date
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId)
    } else {
      newFavorites.add(templateId)
    }
    setFavorites(newFavorites)
  }

  const handleUseTemplate = async (template) => {
    try {
      // Build real fields from templateFields definitions, or fall back to empty
      const fields = (template.templateFields || []).map((f) => ({
        id: `field_${Date.now()}_${f.id}`,
        type: f.type,
        label: f.label,
        required: f.required ?? false,
        placeholder: f.placeholder || "",
        options: f.options || [],
        description: f.description || "",
      }))

      const formData = {
        title: template.title,
        description: template.description,
        fields,
        settings: {
          theme: "modern",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          submitButtonText: template.submitButtonText || "Submit",
          thankYouMessage: template.thankYouMessage || "Thank you for your submission!",
          collectEmail: true,
          allowMultipleSubmissions: true,
        },
        status: "draft",
      }

      const newFormId = await createForm(formData)
      navigate(`/builder/${newFormId}`)
    } catch (error) {
      console.error("Error creating form from template:", error)
    }
  }

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderTemplateCard = (template) => (
    <motion.div
      key={template.id}
      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* Header with Badges */}
      <div className="relative">
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {template.isNew && (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5" /> New
            </span>
          )}
          {template.isHot && (
            <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <Flame className="w-2.5 h-2.5" /> Hot
            </span>
          )}
        </div>
        {template.isPremium && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-2 flex items-center justify-center">
            <Zap className="w-3 h-3 mr-1" />
            Premium Template
          </div>
        )}

        {/* Quick Stats Bar */}
        <div
          className={`${template.isPremium ? "mt-8" : "mt-0"} bg-gray-50 px-4 py-2 flex items-center justify-between text-xs text-gray-600`}
        >
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {template.estimatedTime}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {template.hasPayment && <span title="Payment" className="text-green-600"><CreditCard className="w-3 h-3" /></span>}
            {template.multiStep && <span title="Multi-step" className="text-blue-600"><Layers className="w-3 h-3" /></span>}
            {template.hasLogic && <span title="Conditional logic" className="text-purple-600"><GitBranch className="w-3 h-3" /></span>}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {template.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {template.fields} fields
              </span>
              <span className="flex items-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {template.uses.toLocaleString()} uses
              </span>
              <span className="flex items-center">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 fill-current" />
                {template.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {template.features.length > 3 && (
              <span className="text-xs text-gray-400">+{template.features.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Industry Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {template.industry.slice(0, 2).map((industry, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {industry}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUseTemplate(template)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
            Use Template
          </button>
          <button
            onClick={() => handlePreviewTemplate(template)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(template.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Add to Favorites"
          >
            {favorites.has(template.id) ? (
              <BookmarkCheck className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            ) : (
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderTemplateList = (template) => (
    <motion.div
      key={template.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div className="flex-1 mb-4 lg:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {template.title}
            </h3>
            <div className="flex items-center space-x-2">
              {template.isPremium && (
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Premium
                </span>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                {template.difficulty}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-3">{template.description}</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              {template.fields} fields
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {template.uses.toLocaleString()} uses
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              {template.rating}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {template.estimatedTime}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 4).map((feature, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUseTemplate(template)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Use Template
          </button>
          <button
            onClick={() => handlePreviewTemplate(template)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(template.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            {favorites.has(template.id) ? (
              <BookmarkCheck className="w-4 h-4 text-red-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )

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
              <h1 className="text-lg font-bold text-gray-900">Templates</h1>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Form Templates</h1>
                <p className="text-gray-600 mt-1">Choose from our collection of professionally designed forms</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Featured Templates Section */}
          {selectedCategory === "all" && !searchTerm && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Featured Templates</h2>
                <span className="text-sm text-gray-500">Most popular this month</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {featuredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    className="relative bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">Featured</span>
                        <Star className="w-5 h-5 text-yellow-300 fill-current" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                      <p className="text-white/80 text-sm mb-4">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">{template.uses.toLocaleString()} uses</span>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                        >
                          Use Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Templates */}
          {selectedCategory === "all" && !searchTerm && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Trending Templates
                </h2>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {trendingTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Trending</span>
                      <span className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                        {template.rating}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                    <p className="text-xs text-gray-600 mb-3">{template.uses.toLocaleString()} uses</p>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Use Template
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search templates by name, tag, or industry..."
                    className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort and Advanced Filter Toggle */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name A-Z</option>
                </select>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    showAdvancedFilters || filterPayment || filterMultiStep || filterLogic || filterDifficulty !== "all"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(filterPayment || filterMultiStep || filterLogic || filterDifficulty !== "all") && (
                    <span className="bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {[filterPayment, filterMultiStep, filterLogic, filterDifficulty !== "all"].filter(Boolean).length}
                    </span>
                  )}
                  {showAdvancedFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Advanced Filters</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterPayment(!filterPayment)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          filterPayment ? "bg-green-600 text-white border-green-600" : "border-gray-300 text-gray-600 hover:border-green-400"
                        }`}
                      >
                        <CreditCard className="w-3 h-3" /> Has Payment
                      </button>
                      <button
                        onClick={() => setFilterMultiStep(!filterMultiStep)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          filterMultiStep ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"
                        }`}
                      >
                        <Layers className="w-3 h-3" /> Multi-step
                      </button>
                      <button
                        onClick={() => setFilterLogic(!filterLogic)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          filterLogic ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 text-gray-600 hover:border-purple-400"
                        }`}
                      >
                        <GitBranch className="w-3 h-3" /> Conditional Logic
                      </button>
                      {["Beginner", "Intermediate", "Advanced"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setFilterDifficulty(filterDifficulty === d ? "all" : d)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            filterDifficulty === d ? getDifficultyColor(d) + " border-transparent" : "border-gray-300 text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                      {(filterPayment || filterMultiStep || filterLogic || filterDifficulty !== "all") && (
                        <button
                          onClick={() => { setFilterPayment(false); setFilterMultiStep(false); setFilterLogic(false); setFilterDifficulty("all") }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-all"
                        >
                          <X className="w-3 h-3" /> Clear
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories */}
            <div className={`mt-4 ${isMobile && !showFilters ? "" : ""}`}>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                    <span className="text-xs opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm sm:text-base">
              Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && ` in ${categories.find((c) => c.id === selectedCategory)?.label}`}
            </p>
          </div>

          {/* Templates Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          ) : (
            <div className="space-y-4">{filteredTemplates.map(renderTemplateList)}</div>
          )}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedTemplate && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.title}</h2>
                    <p className="text-sm text-gray-500">{selectedTemplate.category} · {selectedTemplate.fields} fields</p>
                  </div>
                </div>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm flex-shrink-0">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <strong>{selectedTemplate.rating}</strong>/5
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  {selectedTemplate.uses.toLocaleString()} uses
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4 text-purple-500" />
                  {selectedTemplate.estimatedTime}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                  {selectedTemplate.difficulty}
                </span>
                {selectedTemplate.hasPayment && <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CreditCard className="w-3 h-3" /> Payment</span>}
                {selectedTemplate.multiStep && <span className="flex items-center gap-1 text-blue-600 text-xs font-medium"><Layers className="w-3 h-3" /> Multi-step</span>}
                {selectedTemplate.hasLogic && <span className="flex items-center gap-1 text-purple-600 text-xs font-medium"><GitBranch className="w-3 h-3" /> Logic</span>}
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 p-6">
                <p className="text-gray-600 mb-5">{selectedTemplate.description}</p>

                {/* Features */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Key Features</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.features.map((f, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">{f}</span>
                    ))}
                  </div>
                </div>

                {/* Live Form Preview */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-500" />
                    Live Form Preview
                    <span className="text-xs font-normal text-gray-400 ml-1">({selectedTemplate.templateFields?.length || selectedTemplate.preview.length} fields)</span>
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                    {selectedTemplate.templateFields ? selectedTemplate.templateFields.slice(0, 8).map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                        {(field.type === "text" || field.type === "email" || field.type === "phone" || field.type === "url" || field.type === "number") && (
                          <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 pointer-events-none">
                            {field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          </div>
                        )}
                        {field.type === "textarea" && (
                          <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 pointer-events-none h-16">
                            {field.placeholder || "Type your response here..."}
                          </div>
                        )}
                        {field.type === "date" && (
                          <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 pointer-events-none">
                            📅 Select a date
                          </div>
                        )}
                        {field.type === "select" && (
                          <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 pointer-events-none flex items-center justify-between">
                            <span>{field.options?.[0] || "Select an option"}</span>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        )}
                        {(field.type === "radio" || field.type === "checkbox") && (
                          <div className="space-y-1.5">
                            {(field.options || []).slice(0, 3).map((opt, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className={`w-4 h-4 border-2 border-gray-300 flex-shrink-0 ${field.type === "radio" ? "rounded-full" : "rounded"}`} />
                                {opt}
                              </div>
                            ))}
                            {(field.options || []).length > 3 && (
                              <p className="text-xs text-gray-400 pl-6">+{field.options.length - 3} more options</p>
                            )}
                          </div>
                        )}
                        {field.type === "rating" && (
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-gray-300" />)}
                          </div>
                        )}
                        {field.type === "file" || field.type === "image" ? (
                          <div className="w-full px-3 py-4 bg-white border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 text-center pointer-events-none">
                            📎 Click to upload files
                          </div>
                        ) : null}
                      </div>
                    )) : selectedTemplate.preview.map((f, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f}</label>
                        <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg h-9" />
                      </div>
                    ))}
                    {selectedTemplate.templateFields && selectedTemplate.templateFields.length > 8 && (
                      <p className="text-center text-xs text-gray-400 pt-1">... and {selectedTemplate.templateFields.length - 8} more fields in the full form</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 p-6 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={() => { handleUseTemplate(selectedTemplate); setShowPreview(false) }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  {selectedTemplate.submitButtonText ? `Use Template — "${selectedTemplate.submitButtonText}"` : "Use This Template"}
                </button>
                <button
                  onClick={() => toggleFavorite(selectedTemplate.id)}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  title={favorites.has(selectedTemplate.id) ? "Remove from favorites" : "Save to favorites"}
                >
                  {favorites.has(selectedTemplate.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-red-500" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && <MobileNavigation activePath="/templates" />}
    </div>
  )
}
