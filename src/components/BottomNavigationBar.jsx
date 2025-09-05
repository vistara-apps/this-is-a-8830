import React from 'react'
import { Home, FileText, Mic, User } from 'lucide-react'
import { clsx } from 'clsx'

function BottomNavigationBar({ currentPage, onPageChange }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scripts', label: 'Scripts', icon: FileText },
    { id: 'recording', label: 'Record', icon: Mic },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 z-50">
      <div className="container">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onPageChange(id)}
              className={clsx(
                "flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors min-w-0",
                currentPage === id 
                  ? "text-primary bg-primary/10" 
                  : "text-muted hover:text-text hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default BottomNavigationBar