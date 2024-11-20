import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar'
import ExpenseTracker from './ExpenseTracker'
import Statistics from './pages/Statistics'

function App() {

  return (
    <Router>
      <div className="bg-white min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<ExpenseTracker />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
