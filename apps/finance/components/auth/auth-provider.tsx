"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  permissions: string[]
  maxApprovalAmount?: number
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // Validate token and get user info
        const response = await apiClient.getCurrentUser()
        setUser(response.data)
      }
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem("auth_token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      const { token, user: userData } = response.data

      localStorage.setItem("auth_token", token)
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.message || "Login failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    window.location.href = "/login"
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
