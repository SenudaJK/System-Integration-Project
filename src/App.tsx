import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerRegistration from './pages/OwnerRegistration';
import './App.css';
import OrderPage from "./pages/OrderPage.tsx";
import OwnerLogin from "./pages/OwnerLogin";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<OwnerLogin />} />
                <Route path="/login" element={<OwnerLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<OwnerRegistration />} />
                <Route path="/orders" element={<OrderPage />} />
            </Routes>
        </Router>
    );
}

export default App;