'use client'

import { useChat } from 'ai/react'
import { useEffect, Dispatch, SetStateAction } from 'react'
import Message from './Message'

export default function Chat({ state, setState }: { state: MainState, setState: Dispatch<SetStateAction<MainState>> }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ body: { table: state.table } })
  const websiteBase = state.website.split('/')[2]

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto justify-center items-left">
      {(messages.length > 0) ? (
        <div className="mt-16 md:mt-0 mb-24 md:mb-0 w-full md:px-20 lg:px-32 ">
          {messages.map(m => (
            <Message key={m.id} role={m.role} content={m.content}></Message>
          ))}
        </div>
      ) : (
        <div className="mb-24 md:mb-0 text-center max-w-lg ml-auto mr-auto p-6 bg-white">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-700">Enter a message to learn more about <span className="text-lancedb">{websiteBase}</span></h5>
          <p className="font-normal text-gray-700 ">By using a vector store, we can retrieve relevant up-to-date information for use in chat completion. </p>
        </div>

      )}
      <div className="flex flex-row justify-center w-full">
        <form className="flex fixed bottom-20 md:bottom-14 w-full px-6 md:px-44 lg:px-56 flex-row justify-center space-x-2" onSubmit={e => {
          handleSubmit(e)
        }}>
          <input className="resize-y bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lancedb focus:border-lancedb block w-full p-2.5" placeholder="Say something..."
            value={input}
            onChange={handleInputChange}
          />
          <button className="inline-flex justify-center items-center h-10 w-10 text-sm font-medium text-center text-white bg-lancedb rounded-lg hover:bg-opacity-80 focus:ring-4 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>

          </button>
        </form>
      </div>
      <div className="flex flex-row justify-center w-full px-6">
        <div className="flex bg-white py-2 fixed bottom-3 w-full flex-col md:flex-row justify-center items-center mx-6 md:space-x-1">
          <p className="text-gray-500 text-md text-center">
            If the app ran out of tokens or you would like us to build you a similar app, please contact us at <a href="https://inovantech.com " target="_blank" className="ml-1 mr-1 inline-flex items-center font-medium text-lancedb hover:underline">inovantech.com</a>.
          </p>  
        </div>
      </div>
    </div>
  )
}