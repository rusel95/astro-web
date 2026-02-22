'use client';

import { useState, useEffect } from 'react'
import { posthog } from '@/lib/posthog'

export function CookieConsent() {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    } else if (consent === 'accepted') {
      posthog.opt_in_capturing()
    }
  }, [])
  
  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    posthog.opt_in_capturing()
    setShow(false)
  }
  
  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    posthog.opt_out_capturing()
    setShow(false)
  }
  
  if (!show) return null
  
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg z-50">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
        Cookies & Analytics
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Ми використовуємо cookies та analytics для покращення вашого досвіду. 
        Всі дані анонімізовані та не передаються третім сторонам.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Прийняти
        </button>
        <button
          onClick={handleDecline}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors"
        >
          Відхилити
        </button>
      </div>
    </div>
  )
}
