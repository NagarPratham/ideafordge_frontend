import { ChatInterface } from "@/components/chat/chat-interface"
import { Navbar } from "@/components/landing/navbar"

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 sm:pt-24 md:pt-28 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center px-2 sm:px-4 md:px-6">
        {/* Rectangle chat container in center */}
        <div className="w-full max-w-5xl h-full max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col">
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
