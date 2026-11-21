
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001'
).replace(/\/$/, '')

// Fix escaped Markdown characters returned by Gemini
function cleanMarkdown(text) {
  return text.replace(/\\([*_`])/g, '$1')
}

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

          <div className="bg-[#F8FAF7] p-5 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
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
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-green-700 text-white'
                      : 'bg-white text-gray-700 border border-gray-100'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="space-y-2 break-words">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold mt-3 mb-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-bold mt-3 mb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="font-bold mt-3 mb-1">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-gray-900">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 mb-3 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 mb-3 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="pl-1">{children}</li>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 underline font-medium break-all"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {cleanMarkdown(message.text)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.text
                  )}
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
