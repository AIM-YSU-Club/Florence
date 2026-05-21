import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PharmacyInfo from './pages/PharmacyInfo';
import DrugList from './pages/DrugList';
import DrugDetail from './pages/DrugDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<PharmacyInfo />} />
          <Route path="drugs" element={<DrugList />} />
          <Route path="drugs/:id" element={<DrugDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
