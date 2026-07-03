import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './features/home/pages/Home';
import Products from './features/products/pages/Products';
import StockDashboard from './features/stock/pages/StockDashboard';
import Forecast from './features/forecast/pages/Forecast';
import AgentConsole from './features/agents/pages/AgentConsole';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/stock" element={<StockDashboard />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/agents" element={<AgentConsole />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg-color text-text-primary transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
