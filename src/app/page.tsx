'use client'

import { useState } from "react";

type Message = {
  sender: String
  text: String
}

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input }
    setMessages([...messages, userMessage])
    setInput('')

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    })

    const data = await response.json()
    const botMessage = { sender: 'bot', text: data.text }
    setMessages((prevMessages) => [...prevMessages, botMessage])
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            <div className="flex items-center mb-4">
              <img
                src={msg.sender === 'user' ? '/user.png' : '/bot.png'}
                alt="profile"
                className="w-8 h-8 rounded-full mr-2" />
              <div className={`p-4 rounded-lg ${msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white flex">
        <input type="text"
          className="flex-1 border border-gray-300 rounded-l-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600">Send</button>
      </div>
    </div>
  )
}