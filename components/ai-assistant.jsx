"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { API_BASE_URL } from "@/lib/config"

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [history, setHistory] = useState([
    { role: "assistant", content: "Hi! I'm your Kolhapur Travel Assistant. 🏝️ How can I help you plan your trip today?" }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const userMsg = { role: "user", content: message }
    setHistory(prev => [...prev, userMsg])
    setMessage("")
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history })
      })
      const data = await res.json()
      
      if (data.response) {
        setHistory(prev => [...prev, { role: "assistant", content: data.response }])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (err) {
      setHistory(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later! 😅" }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-orange-600 hover:bg-orange-700 shadow-2xl flex items-center justify-center p-0 group overflow-hidden transition-all duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <MessageSquare className="h-8 w-8 text-white relative z-10" />
        </Button>
      ) : (
        <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col border-orange-100 animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-orange-600 text-white p-4 rounded-t-xl shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Kolhapur AI Guide</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent 
            className="flex-grow p-0 overflow-hidden flex flex-col"
          >
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {history.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`mt-1 p-1 rounded-full ${msg.role === 'user' ? 'bg-gray-100' : 'bg-orange-100'}`}>
                      {msg.role === 'user' ? <User className="h-3 w-3 text-gray-600" /> : <Bot className="h-3 w-3 text-orange-600" />}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-orange-600 text-white rounded-tr-none' 
                        : 'bg-white border rounded-tl-none text-gray-800'
                    }`}>
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-3 border-t bg-gray-50 rounded-b-xl shrink-0">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Ask about Kolhapur..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="bg-white"
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
                className="bg-orange-600 hover:bg-orange-700 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
