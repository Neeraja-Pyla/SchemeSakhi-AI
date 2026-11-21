
import { useState } from 'react'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001'
).replace(/\/$/, '')

function AIChat() {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! 👋 I am SchemeSakhi. Ask me about government schemes in English or Telugu.',
    },
  ])

  async function handleSend(event) {
    event.preventDefault()

    if (!question.trim() || isLoading) return

    const userQuestion = question.trim()

    setMessages((previousMessages) => [
      ...previousMessages,
      { role: 'user', text: userQuestion },
    ])

    setQuestion('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userQuestion }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong.')
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: 'assistant',
          text: data.reply || 'Sorry, I could not generate a response.',
        },
      ])
    } catch (error) {
      console.error('Chat Error:', error)

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: 'assistant',
          text: `Sorry, something went wrong: ${error.message}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-white py-20 px-6" id="ai-assistant">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-green-700 font-semibold text-sm">
            YOUR AI-POWERED GUIDE
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Ask SchemeSakhi AI
          </h2>

          <p className="text-gray-500 mt-4">
            Ask questions about government schemes in your preferred language.
          </p>
        </div>

        <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-green-800 text-white p-5">
            <h3 className="font-semibold text-lg">
              💚 SchemeSakhi Assistant
            </h3>

            <p className="text-green-100 text-sm mt-1">
              English • తెలుగు
            </p>
          </div>

          <div className="bg-[#F8FAF7] p-5 space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-green-700 text-white'
                      : 'bg-white text-gray-700 border border-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-500">
                  SchemeSakhi is thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask in English or Telugu..."
              disabled={isLoading}
              className="flex-1 min-w-0 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-700 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white px-6 rounded-xl font-semibold transition"
            >
              {isLoading ? 'Wait...' : 'Send'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          AI-generated guidance should be checked against official scheme sources.
        </p>
      </div>
    </section>
  )
}

export default AIChat
