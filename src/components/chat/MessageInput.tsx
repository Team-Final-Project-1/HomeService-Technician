import { useRef } from "react"

type Props = {
  text: string
  setText: (val: string) => void
  sendMessage: () => void
  handleTyping: (val: string) => void
  sendImage: (imageUrl: string) => void
}

export default function MessageInput({
  text,
  setText,
  sendMessage,
  handleTyping,
  sendImage
}: Props) {

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      const API = (process.env.NEXT_PUBLIC_API_URL as string)
        .replace(/\/$/, "")
      const BASE = API.endsWith("/api") ? API : `${API}/api`
      const res = await fetch(`${BASE}/upload`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data?.url) sendImage(data.url)
    } catch (err) {
      console.error("❌ upload image:", err)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-t">

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-400 hover:text-blue-500 text-xl transition"
        aria-label="แนบรูปภาพ"
      >
        📎
      </button>

      <input
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleTyping(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="พิมพ์ข้อความ..."
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm outline-none"
      />

      <button
        onClick={sendMessage}
        disabled={!text.trim()}
        className={`
          px-4 py-2 rounded-full text-white text-sm
          ${text.trim()
            ? "bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"}
        `}
      >
        ➤
      </button>

    </div>
  )
}