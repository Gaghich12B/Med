"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, Check, Loader2 } from "lucide-react"

interface ConnectButtonProps {
  targetUserId: string
  isConnected?: boolean
  isPending?: boolean
}

export function ConnectButton({ targetUserId, isConnected, isPending }: ConnectButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "connected" | "loading">(
    isConnected ? "connected" : isPending ? "pending" : "idle"
  )

  const handleConnect = async () => {
    if (status !== "idle") return
    setStatus("loading")

    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectedId: targetUserId }),
      })

      if (response.ok) {
        setStatus("pending")
      } else {
        setStatus("idle")
      }
    } catch {
      setStatus("idle")
    }
  }

  if (status === "connected") {
    return (
      <Button size="sm" variant="outline" disabled>
        <Check className="h-4 w-4 mr-1" />
        Connected
      </Button>
    )
  }

  if (status === "pending") {
    return (
      <Button size="sm" variant="outline" disabled>
        Pending
      </Button>
    )
  }

  if (status === "loading") {
    return (
      <Button size="sm" variant="outline" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  return (
    <Button size="sm" variant="outline" onClick={handleConnect}>
      <UserPlus className="h-4 w-4 mr-1" />
      Connect
    </Button>
  )
}
