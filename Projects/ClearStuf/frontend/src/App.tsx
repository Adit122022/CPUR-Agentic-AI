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
import UploadGuard from './components/UploadGuard';
import Documentation from './features/documentation/pages/Documentation';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<Home />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/products" element={<ProtectedRoute><UploadGuard><Products /></UploadGuard></ProtectedRoute>} />

        <Route path="/stock"    element={<ProtectedRoute><UploadGuard><StockDashboard /></UploadGuard></ProtectedRoute>} />
        <Route path="/forecast" element={<ProtectedRoute><UploadGuard><Forecast /></UploadGuard></ProtectedRoute>} />
        <Route path="/agents"   element={<ProtectedRoute><UploadGuard><AgentConsole /></UploadGuard></ProtectedRoute>} />
        <Route path="/upload"   element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/login"    element={<Login />} />

      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavAndFooter = location.pathname !== '/login';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {showNavAndFooter && <Navbar />}
      <main className="grow">
        <AnimatedRoutes />
      </main>
      {showNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;

