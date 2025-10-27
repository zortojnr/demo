import { Outlet } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import ClientChatAssistant from './ClientChatAssistant'

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f14] to-[#0b0f14] text-white">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ClientChatAssistant />
    </div>
  )
}