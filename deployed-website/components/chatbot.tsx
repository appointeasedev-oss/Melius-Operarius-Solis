"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-[420px] md:w-[500px] h-[100dvh] sm:h-[600px] max-h-[100dvh] sm:max-h-[calc(100vh-120px)]"
            >
              <div className="bg-white sm:rounded-lg shadow-2xl overflow-hidden border-t sm:border border-gray-200 flex flex-col h-full">
                <div className="absolute top-4 right-4 z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-gray-200/50 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <iframe 
                    src="https://heho.vercel.app/deploy/d8w4i13x097qg38quoch6" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      border: 'none',
                      display: 'block'
                    }} 
                    allow="microphone; camera"
                    title="Chat Assistant"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Toggle Chatbot"
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </Button>
        </motion.div>
      </div>
    </>
  )
}
