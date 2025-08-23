"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ManagerDashboard } from "@/components/manager-dashboard"
import { getManagerSession } from "@/lib/manager-auth"

export default function ManagerPage() {
  const router = useRouter()

  useEffect(() => {
    const session = getManagerSession()
    if (!session) {
      router.push("/manager-auth")
    }
  }, [router])

  return <ManagerDashboard />
}
