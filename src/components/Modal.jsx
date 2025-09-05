import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

function Modal({ isOpen, onClose, content, variant = 'dialog' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={clsx(
        "relative w-full max-w-md bg-surface rounded-lg shadow-2xl animate-slide-up",
        variant === 'sheet' ? "max-h-[80vh]" : "max-h-[90vh]",
        "overflow-hidden"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-text">
            {content?.title || 'Modal'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {content?.body}
        </div>
      </div>
    </div>
  )
}

export default Modal