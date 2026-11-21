import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'


import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Schemes from './sections/Schemes'
import Eligibility from './sections/Eligibility'
import AIChat from './sections/AIChat'

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Schemes />
      <Eligibility />
      <AIChat />
    </div>
  )
}

export default App

