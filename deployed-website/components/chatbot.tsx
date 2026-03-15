"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-[calc(100vw-48px)] sm:w-[400px] mb-4"
            >
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold">Chat Assistant</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <iframe 
                  src="https://heho.vercel.app/deploy/9iei42ibl0fbr1kur6aqki" 
                  style={{ width: '100%', height: '600px', border: 'none' }} 
                  allow="microphone; camera"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-16 h-16 shadow-lg"
            aria-label="Toggle Chatbot"
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </Button>
        </motion.div>
      </div>
    </>
  )
}
