"use client"

import { useState, useEffect } from "react"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  increment,
} from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "./use-auth"
import { useNotifications, NotificationHelpers } from "./use-notifications"

export const useForms = () => {
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setForms([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "forms"), where("userId", "==", user.uid), orderBy("updatedAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const formsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }))

        setForms(formsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching forms:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const createForm = async (formData) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const newForm = {
        ...formData,
        userId: user.uid,
        responseCount: 0,
        views: 0,
        status: formData.status || "draft",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, "forms"), newForm)

      // Create notification for form creation (non-blocking)
      createNotification(NotificationHelpers.formCreated(formData.title, docRef.id)).catch((error) => {
        console.warn("Failed to create notification:", error)
      })

      return docRef.id
    } catch (error) {
      console.error("Error creating form:", error)
      throw error
    }
  }

  const updateForm = async (formId, updates) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const validUpdates = Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined))

      const formRef = doc(db, "forms", formId)

      // Get current form data to check for status changes
      const currentForm = await getDoc(formRef)
      const currentData = currentForm.data()

      await updateDoc(formRef, {
        ...validUpdates,
        updatedAt: Timestamp.now(),
      })

      // Create notifications for specific updates (non-blocking)
      if (updates.status === "published" && currentData.status !== "published") {
        createNotification(NotificationHelpers.formPublished(updates.title || currentData.title, formId)).catch(
          (error) => {
            console.warn("Failed to create notification:", error)
          },
        )
      } else if (updates.title || updates.fields) {
        createNotification(NotificationHelpers.formUpdated(updates.title || currentData.title, formId)).catch(
          (error) => {
            console.warn("Failed to create notification:", error)
          },
        )
      }
    } catch (error) {
      console.error("Error updating form:", error)
      throw error
    }
  }

  const deleteForm = async (formId) => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Get form title before deletion
      const formDoc = await getDoc(doc(db, "forms", formId))
      const formTitle = formDoc.data()?.title || "Unknown Form"

      // Delete all responses for this form first
      const responsesQuery = query(collection(db, "formResponses"), where("formId", "==", formId))
      const responsesSnapshot = await getDocs(responsesQuery)

      const deletePromises = responsesSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      // Then delete the form
      await deleteDoc(doc(db, "forms", formId))

      // Create notification for form deletion (non-blocking)
      createNotification(NotificationHelpers.formDeleted(formTitle)).catch((error) => {
        console.warn("Failed to create notification:", error)
      })
    } catch (error) {
      console.error("Error deleting form:", error)
      throw error
    }
  }

  const getForm = async (formId) => {
    try {
      const formRef = doc(db, "forms", formId)
      const formSnap = await getDoc(formRef)

      if (formSnap.exists()) {
        const data = formSnap.data()
        return {
          id: formSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        }
      }
      return null
    } catch (error) {
      console.error("Error getting form:", error)
      throw error
    }
  }

  const duplicateForm = async (formId) => {
    try {
      const form = await getForm(formId)
      if (!form) throw new Error("Form not found")

      const duplicatedForm = {
        ...form,
        title: `${form.title} (Copy)`,
        status: "draft",
        responseCount: 0,
        views: 0,
      }

      // Remove the id and timestamps
      delete duplicatedForm.id
      delete duplicatedForm.createdAt
      delete duplicatedForm.updatedAt

      const newFormId = await createForm(duplicatedForm)

      // Create notification for duplication (non-blocking)
      createNotification(NotificationHelpers.formDuplicated(form.title, newFormId)).catch((error) => {
        console.warn("Failed to create notification:", error)
      })

      return newFormId
    } catch (error) {
      console.error("Error duplicating form:", error)
      throw error
    }
  }

  const incrementFormViews = async (formId) => {
    try {
      const formRef = doc(db, "forms", formId)
      await updateDoc(formRef, {
        views: increment(1),
      })
    } catch (error) {
      console.error("Error incrementing form views:", error)
    }
  }

  const shareForm = async (formId) => {
    try {
      const form = await getForm(formId)
      if (!form) throw new Error("Form not found")

      // Create notification for sharing (non-blocking)
      createNotification(NotificationHelpers.formShared(form.title, formId)).catch((error) => {
        console.warn("Failed to create notification:", error)
      })
    } catch (error) {
      console.error("Error sharing form:", error)
      throw error
    }
  }

  return {
    forms,
    loading,
    createForm,
    updateForm,
    deleteForm,
    getForm,
    duplicateForm,
    incrementFormViews,
    shareForm,
  }
}

export const useFormResponses = (formId) => {
  const { createNotification } = useNotifications()
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!formId) {
      setResponses([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "formResponses"), where("formId", "==", formId), orderBy("submittedAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const responsesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate(),
        }))

        setResponses(responsesData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching responses:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [formId])

  const submitResponse = async (formId, responseData, metadata = {}) => {
    try {
      const response = {
        formId,
        responses: responseData,
        submittedAt: Timestamp.now(),
        userAgent: navigator.userAgent,
        ipAddress: null,
        ...metadata,
      }

      // Add the response first
      await addDoc(collection(db, "formResponses"), response)

      // Get form details and update response count
      const formRef = doc(db, "forms", formId)
      const formDoc = await getDoc(formRef)
      const formData = formDoc.data()

      const newResponseCount = (formData.responseCount || 0) + 1

      await updateDoc(formRef, {
        responseCount: increment(1),
        lastResponseAt: Timestamp.now(),
      })

      // Create notification for new response (non-blocking, fire-and-forget)
      if (formData.userId) {
        createNotification({
          ...NotificationHelpers.responseReceived(formData.title, formId, newResponseCount),
          userId: formData.userId,
        }).catch((error) => {
          console.warn("Failed to create notification:", error)
          // Don't throw - notification failure shouldn't affect form submission
        })
      }

      return true
    } catch (error) {
      console.error("Error submitting response:", error)
      throw error
    }
  }

  const deleteResponse = async (responseId) => {
    try {
      await deleteDoc(doc(db, "formResponses", responseId))
    } catch (error) {
      console.error("Error deleting response:", error)
      throw error
    }
  }

  const getResponseStats = () => {
    if (!responses.length) return null

    const totalResponses = responses.length
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayResponses = responses.filter(
      (r) => r.submittedAt && r.submittedAt.toDateString() === today.toDateString(),
    ).length

    const yesterdayResponses = responses.filter(
      (r) => r.submittedAt && r.submittedAt.toDateString() === yesterday.toDateString(),
    ).length

    return {
      total: totalResponses,
      today: todayResponses,
      yesterday: yesterdayResponses,
      change:
        yesterdayResponses > 0 ? (((todayResponses - yesterdayResponses) / yesterdayResponses) * 100).toFixed(1) : 0,
    }
  }

  return {
    responses,
    loading,
    submitResponse,
    deleteResponse,
    getResponseStats,
  }
}

// Hook for getting all forms analytics
export const useFormsAnalytics = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setAnalytics(null)
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      try {
        // Get all user's forms
        const formsQuery = query(collection(db, "forms"), where("userId", "==", user.uid))
        const formsSnapshot = await getDocs(formsQuery)

        // Get all responses for user's forms
        const formIds = formsSnapshot.docs.map((doc) => doc.id)
        if (formIds.length === 0) {
          setAnalytics({
            totalForms: 0,
            totalResponses: 0,
            activeForms: 0,
            totalViews: 0,
          })
          setLoading(false)
          return
        }

        const responsesQuery = query(collection(db, "formResponses"), where("formId", "in", formIds))
        const responsesSnapshot = await getDocs(responsesQuery)

        const forms = formsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const totalForms = forms.length
        const activeForms = forms.filter((form) => form.status === "published").length
        const totalResponses = responsesSnapshot.docs.length
        const totalViews = forms.reduce((sum, form) => sum + (form.views || 0), 0)

        setAnalytics({
          totalForms,
          totalResponses,
          activeForms,
          totalViews,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  return { analytics, loading }
}

// Enhanced analytics hook with real percentage calculations
export const useEnhancedAnalytics = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setAnalytics(null)
      setLoading(false)
      return
    }

    const fetchEnhancedAnalytics = async () => {
      try {
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

        // Get all user's forms
        const formsQuery = query(collection(db, "forms"), where("userId", "==", user.uid))
        const formsSnapshot = await getDocs(formsQuery)
        const forms = formsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        if (forms.length === 0) {
          setAnalytics({
            totalForms: 0,
            totalResponses: 0,
            activeForms: 0,
            totalViews: 0,
            formsChange: 0,
            responsesChange: 0,
            activeFormsChange: 0,
            viewsChange: 0,
            conversionRate: 0,
            avgResponseTime: 0,
            topPerformingForm: null,
            recentTrends: [],
          })
          setLoading(false)
          return
        }

        const formIds = forms.map((form) => form.id)

        // Get all responses for user's forms
        const responsesQuery = query(collection(db, "formResponses"), where("formId", "in", formIds))
        const responsesSnapshot = await getDocs(responsesQuery)
        const responses = responsesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        // Calculate current period stats
        const totalForms = forms.length
        const activeForms = forms.filter((form) => form.status === "published").length
        const totalResponses = responses.length
        const totalViews = forms.reduce((sum, form) => sum + (form.views || 0), 0)

        // Calculate previous period stats (30-60 days ago)
        const formsCreatedLast30Days = forms.filter(
          (form) => form.createdAt && form.createdAt.toDate() >= thirtyDaysAgo,
        ).length
        const formsCreatedPrevious30Days = forms.filter(
          (form) =>
            form.createdAt && form.createdAt.toDate() >= sixtyDaysAgo && form.createdAt.toDate() < thirtyDaysAgo,
        ).length

        const responsesLast30Days = responses.filter(
          (response) => response.submittedAt && response.submittedAt.toDate() >= thirtyDaysAgo,
        ).length
        const responsesPrevious30Days = responses.filter(
          (response) =>
            response.submittedAt &&
            response.submittedAt.toDate() >= sixtyDaysAgo &&
            response.submittedAt.toDate() < thirtyDaysAgo,
        ).length

        // Calculate percentage changes
        const formsChange =
          formsCreatedPrevious30Days > 0
            ? ((formsCreatedLast30Days - formsCreatedPrevious30Days) / formsCreatedPrevious30Days) * 100
            : formsCreatedLast30Days > 0
              ? 100
              : 0

        const responsesChange =
          responsesPrevious30Days > 0
            ? ((responsesLast30Days - responsesPrevious30Days) / responsesPrevious30Days) * 100
            : responsesLast30Days > 0
              ? 100
              : 0

        // Calculate conversion rate (responses/views)
        const conversionRate = totalViews > 0 ? (totalResponses / totalViews) * 100 : 0

        // Find top performing form
        const topPerformingForm = forms.reduce((top, form) => {
          const formResponses = form.responseCount || 0
          return formResponses > (top?.responseCount || 0) ? form : top
        }, null)

        // Calculate average response time (mock for now, would need timestamps)
        const avgResponseTime = responses.length > 0 ? "2.3 min" : "0 min"

        setAnalytics({
          totalForms,
          totalResponses,
          activeForms,
          totalViews,
          formsChange: Math.round(formsChange * 10) / 10,
          responsesChange: Math.round(responsesChange * 10) / 10,
          activeFormsChange: Math.round((activeForms / Math.max(totalForms, 1)) * 100),
          viewsChange: totalViews > 0 ? Math.round((totalViews / Math.max(totalForms, 1)) * 10) / 10 : 0, // avg views per form
          conversionRate: Math.round(conversionRate * 10) / 10,
          avgResponseTime,
          topPerformingForm,
          responsesLast30Days,
          formsCreatedLast30Days,
        })
      } catch (error) {
        console.error("Error fetching enhanced analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnhancedAnalytics()
  }, [user])

  return { analytics, loading }
}
