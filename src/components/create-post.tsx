"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Send, BookOpen, Award } from "lucide-react"

interface CreatePostProps {
  userName?: string | null
}

export function CreatePost({ userName }: CreatePostProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState("TEXT")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("") ?? "U"

  const handleSubmit = async () => {
    if (!content.trim()) return
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postType }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create post")
        return
      }

      setContent("")
      setPostType("TEXT")
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Share your thoughts, achievements, or ask a question..."
              className="min-h-[100px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <Button
                  variant={postType === "COURSE_COMPLETION" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPostType(postType === "COURSE_COMPLETION" ? "TEXT" : "COURSE_COMPLETION")}
                  type="button"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Course
                </Button>
                <Button
                  variant={postType === "CERTIFICATION" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPostType(postType === "CERTIFICATION" ? "TEXT" : "CERTIFICATION")}
                  type="button"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Certification
                </Button>
              </div>
              <Button
                size="sm"
                className="gap-2"
                onClick={handleSubmit}
                disabled={isLoading || !content.trim()}
                type="button"
              >
                <Send className="h-4 w-4" />
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
