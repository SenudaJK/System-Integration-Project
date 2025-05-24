import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerRegistration from './pages/OwnerRegistration';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<OwnerRegistration />} />
            </Routes>
        </Router>
    );
}

export default App;