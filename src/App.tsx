import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { StateFullLoginForm } from './pages/StateFullLoginForm';
import { Home } from './pages/Home';
import BentoGrid from './pages/BentoGrid'; // Changed to default import
import HomePage from './pages/HomePage';


function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<StateFullLoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/bento" element={<BentoGrid />} />
                <Route path="/homePage" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
