import { useEffect, useState } from "react"
import { getSocket } from "@/lib/socket"
import api from "@/lib/api"

type Props = {
  orderId: string
  userId: string
}

export default function ChatBadge({ orderId, userId }: Props) {

  const [count, setCount] = useState(0)

  // =========================
  // LOAD INITIAL
  // =========================
  useEffect(() => {

    if (!orderId || !userId) return

    const loadUnread = async () => {
      try {
        const res = await api.get<{ count?: number }>(
          `/chat/messages/unread/${orderId}/${userId}`
        )
        setCount(Number(res.data?.count) || 0)
      } catch {
        setCount(0)
      }
    }

    loadUnread()

  }, [orderId, userId])


  // =========================
  // SOCKET REALTIME
  // =========================
  useEffect(() => {

    if (!orderId || !userId) return

    const socket = getSocket()

    if (!socket) {
      return
    }

    const handleNewMessage = (msg: {
      order_id?: string | number
      sender_id?: string | number
    }) => {
      if (!msg) return

      if (
        String(msg.order_id) === String(orderId) &&
        String(msg.sender_id) !== String(userId)
      ) {
        setCount(prev => prev + 1)
      }

    }

    socket.on("receive_message", handleNewMessage)

    return () => {
      socket.off("receive_message", handleNewMessage)
    }

  }, [orderId, userId])


  // =========================
  // RESET เมื่อกลับมา focus
  // =========================
  useEffect(() => {

    const handleFocus = () => {
      setCount(0)
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }

  }, [])


  // =========================
  // UI
  // =========================
  if (!count || count <= 0) return null

  return (
    <span className="ml-1 px-2 py-[2px] text-xs bg-red-500 text-white rounded-full">
      {count}
    </span>
  )
}