import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Home } from './pages'
import './index.css'

const App = () => {
  return (
    <main className='bg-slate-300/20'>
        <Router>
            <Routes>
                <Route exact path='/' element={<Home />} />
            </Routes>
        </Router>
    </main>
  )
}

export default App
