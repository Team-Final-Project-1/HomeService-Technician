import { io, Socket } from "socket.io-client"

const SOCKET_URL =
  (process.env.NEXT_PUBLIC_SOCKET_URL as string)
    .toString()
    .replace(/\/$/, "")

let _socket: Socket | null = null

// ==============================
// GET SOCKET INSTANCE
// ==============================
export const getSocket = (): Socket => {

  if (!_socket) {

    _socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000,
      autoConnect: false
    })

    if (process.env.NODE_ENV === "development") {

      _socket.on("connect", () => {
        console.log("🟢 Socket connected:", _socket?.id)
      })

      _socket.on("disconnect", (reason: string) => {
        console.log("🔴 Socket disconnected:", reason)
      })

      _socket.on("reconnect", (attempt: number) => {
        console.log("🟡 Reconnected after", attempt)
      })

      _socket.on("connect_error", (err: unknown) => {
        console.error("❌ Socket error:", err)
      })
    }
  }

  return _socket
}

// ==============================
// CONNECT
// ==============================
export const connectSocket = () => {

  const s = getSocket()

  if (s.connected || s.active) return

  s.connect()
}