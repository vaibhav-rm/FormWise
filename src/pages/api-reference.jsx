"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Copy, Check, Terminal, ShieldAlert } from "lucide-react"
import PublicHeader from "../components/public-header"
import PublicFooter from "../components/public-footer"

export default function ApiReference() {
  const [activeEndpoint, setActiveEndpoint] = useState("list-forms")
  const [activeLang, setActiveLang] = useState("curl")
  const [copied, setCopied] = useState(false)

  const endpoints = [
    { id: "list-forms", method: "GET", path: "/v1/forms", desc: "List all forms under your account." },
    { id: "get-form", method: "GET", path: "/v1/forms/{formId}", desc: "Retrieve layout configuration details for a specific form." },
    { id: "list-responses", method: "GET", path: "/v1/forms/{formId}/responses", desc: "Retrieve a list of submissions for a specific form." },
  ]

  const codeSnippets = {
    "list-forms": {
      curl: `curl -X GET "https://api.formwise.com/v1/forms" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      js: `fetch("https://api.formwise.com/v1/forms", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
})
.then(res => res.json())
.then(data => console.log(data));`,
      python: `import requests

url = "https://api.formwise.com/v1/forms"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
print(response.json())`,
      response: `{
  "object": "list",
  "data": [
    {
      "id": "frm_8f93e1a0b3",
      "title": "Customer Survey",
      "fields_count": 5,
      "status": "published",
      "created_at": "2026-07-10T14:32:00Z"
    }
  ],
  "has_more": false
}`,
    },
    "get-form": {
      curl: `curl -X GET "https://api.formwise.com/v1/forms/frm_8f93e1a0b3" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      js: `fetch("https://api.formwise.com/v1/forms/frm_8f93e1a0b3", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
})
.then(res => res.json())
.then(data => console.log(data));`,
      python: `import requests

url = "https://api.formwise.com/v1/forms/frm_8f93e1a0b3"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
print(response.json())`,
      response: `{
  "id": "frm_8f93e1a0b3",
  "title": "Customer Survey",
  "description": "Collect satisfaction scores",
  "fields": [
    {
      "id": "fld_1a2b",
      "type": "rating",
      "label": "Overall Score",
      "required": true
    }
  ],
  "created_at": "2026-07-10T14:32:00Z"
}`,
    },
    "list-responses": {
      curl: `curl -X GET "https://api.formwise.com/v1/forms/frm_8f93e1a0b3/responses" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      js: `fetch("https://api.formwise.com/v1/forms/frm_8f93e1a0b3/responses", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
})
.then(res => res.json())
.then(data => console.log(data));`,
      python: `import requests

url = "https://api.formwise.com/v1/forms/frm_8f93e1a0b3/responses"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
print(response.json())`,
      response: `{
  "object": "list",
  "data": [
    {
      "id": "res_9a8b7c6d",
      "form_id": "frm_8f93e1a0b3",
      "values": {
        "fld_1a2b": 5,
        "fld_comment": "Excellent UI styling!"
      },
      "submitted_at": "2026-07-17T15:20:10Z"
    }
  ]
}`,
    },
  }

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans transition-colors duration-200">
      <PublicHeader />

      {/* API Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 dark:from-purple-950 dark:to-indigo-950 text-white pt-36 pb-12 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold tracking-wider uppercase rounded-full border border-purple-500/10">
            Developer API
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-4">
            API Reference
          </h1>
          <p className="text-purple-200 max-w-2xl text-sm sm:text-base">
            Integrate FormWise submissions directly into your analytical stack or external systems using our REST API.
          </p>
        </div>
      </section>

      {/* API Documentation Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Auth callout */}
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-5 text-xs text-purple-900 dark:text-purple-200 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-purple-700 dark:text-purple-300 uppercase">
                <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Authentication</span>
              </div>
              <p className="leading-relaxed">
                All requests must carry your API key in the headers:
              </p>
              <code className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded text-gray-800 dark:text-gray-300 font-mono">
                Authorization: Bearer KEY
              </code>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-3">Endpoints</h3>
              <nav className="space-y-1">
                {endpoints.map((end) => (
                  <button
                    key={end.id}
                    onClick={() => setActiveEndpoint(end.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col ${
                      activeEndpoint === end.id
                        ? "bg-purple-50 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/20"
                        : "hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-purple-600 dark:text-purple-400 font-mono">
                        {end.method}
                      </span>
                      <span className="text-xs font-mono font-semibold text-gray-800 dark:text-gray-300">{end.path}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-normal truncate w-full">{end.desc}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Column 2 & 3: Details & Sandbox */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Endpoint Details */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 space-y-6 transition-colors duration-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <span className="text-sm font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-purple-600 dark:text-purple-400">
                    {endpoints.find((e) => e.id === activeEndpoint)?.method}
                  </span>
                  <span className="font-mono text-lg text-gray-800 dark:text-gray-300">
                    {endpoints.find((e) => e.id === activeEndpoint)?.path}
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                  {endpoints.find((e) => e.id === activeEndpoint)?.desc}
                </p>
              </div>

              {/* Params table */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Request Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500">
                        <th className="pb-3 font-semibold">Parameter</th>
                        <th className="pb-3 font-semibold">Type</th>
                        <th className="pb-3 font-semibold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      <tr>
                        <td className="py-3 font-mono text-purple-700 dark:text-purple-400">Authorization</td>
                        <td className="py-3 text-gray-500 dark:text-gray-400 font-mono">string (Header)</td>
                        <td className="py-3 text-gray-600 dark:text-gray-300 leading-normal font-sans">
                          Bearer API Key required for security validation.
                        </td>
                      </tr>
                      {activeEndpoint !== "list-forms" && (
                        <tr>
                          <td className="py-3 font-mono text-purple-700 dark:text-purple-400">formId</td>
                          <td className="py-3 text-gray-500 dark:text-gray-400 font-mono">string (Path)</td>
                          <td className="py-3 text-gray-600 dark:text-gray-300 leading-normal font-sans">
                            Unique identifier of the form.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Code Box Column */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
              {/* Tab Selector */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <div className="flex space-x-2">
                  {["curl", "js", "python"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        activeLang === lang ? "bg-purple-600 text-white" : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {lang === "js" ? "JavaScript" : lang}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleCopyCode(codeSnippets[activeEndpoint][activeLang])}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Code Editor */}
              <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950">
                <pre>{codeSnippets[activeEndpoint][activeLang]}</pre>
              </div>

              {/* Response Panel */}
              <div className="border-t border-slate-800 bg-slate-950 flex flex-col h-48 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center space-x-2 bg-slate-900 text-slate-400 text-[10px] font-semibold tracking-wider uppercase">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Response Payload (JSON)</span>
                </div>
                <div className="p-4 overflow-y-auto flex-1 font-mono text-[10px] text-slate-400 bg-slate-950">
                  <pre>{codeSnippets[activeEndpoint].response}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
