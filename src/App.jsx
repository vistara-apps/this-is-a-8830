import React, { useState, useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import BottomNavigationBar from './components/BottomNavigationBar'
import HomePage from './pages/HomePage'
import ScriptsPage from './pages/ScriptsPage'
import RecordingPage from './pages/RecordingPage'
import ProfilePage from './pages/ProfilePage'
import Modal from './components/Modal'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'scripts':
        return <ScriptsPage />
      case 'recording':
        return <RecordingPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-bg flex flex-col">
        <Header />
        
        <main className="flex-1 pb-20">
          {renderPage()}
        </main>
        
        <BottomNavigationBar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
        
        {showModal && (
          <Modal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            content={modalContent}
          />
        )}
      </div>
    </AppProvider>
  )
}

export default App