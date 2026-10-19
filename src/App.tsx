import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ATSProvider } from './context/ATSContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';

export default function App() {
  return (
    <ATSProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ATSProvider>
  );
}
