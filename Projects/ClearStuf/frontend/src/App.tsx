import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './features/home/pages/Home';
import Products from './features/products/pages/Products';
import StockDashboard from './features/stock/pages/StockDashboard';
import Forecast from './features/forecast/pages/Forecast';
import AgentConsole from './features/agents/pages/AgentConsole';
import UploadPage from './features/upload/pages/UploadPage';
import Login from './features/auth/pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/stock"    element={<ProtectedRoute><StockDashboard /></ProtectedRoute>} />
        <Route path="/forecast" element={<ProtectedRoute><Forecast /></ProtectedRoute>} />
        <Route path="/agents"   element={<ProtectedRoute><AgentConsole /></ProtectedRoute>} />
        <Route path="/upload"   element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

