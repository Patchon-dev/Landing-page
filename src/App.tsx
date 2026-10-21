import InternalServerErrorPage from './pages/error/InternalServerErrorPage';
import NotFoundPage from "./pages/error/NotFoundPage";
import Index from "./pages/Index";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./lib/layouts/SiteLayout";
import ComponentsLayout from "./lib/layouts/ComponentsLayout";
import ButtonPage from "./pages/components/button/ButtonPage";
import InputPage from "./pages/components/input/InputPage";
import CardPage from "./pages/components/card/CardPage";
import SwitchPage from "./pages/components/switch/SwitchPage";
import DropdownPage from "./pages/components/dropdown/DropdownPage";
import ToastPage from "./pages/components/toast/ToastPage";
import MapPage from "./pages/components/map/MapPage";
import DatePickerPage from "./pages/components/date-picker/DatePickerPage";
import DataViewPage from "./pages/components/data-view/DataViewPage";
import FormsPage from "./pages/components/forms/FormsPage";
import ModalPage from "./pages/components/modal/ModalPage";
import { lazy, Suspense } from 'react';

const ChartsPage = lazy(() => import('./pages/components/charts/ChartsPage'));

const SchedulerPage = lazy(() => import('./pages/components/scheduler/SchedulerPage'));

export default function App() {

  return (
    <BrowserRouter>
      <div
        className="mx-auto w-full overflow-clip bg-site-bg font-sans leading-[1.55] text-site-ink"
      >
        <Routes>
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<Index />} />
            <Route path="500" element={<InternalServerErrorPage />} />
            <Route path="components" element={<ComponentsLayout />}>
              <Route index element={<Navigate to="button" replace />} />
              <Route path="button" element={<ButtonPage />} />
              <Route path="input" element={<InputPage />} />
              <Route path="card" element={<CardPage />} />
              <Route path="switch" element={<SwitchPage />} />
              <Route path="dropdown" element={<DropdownPage />} />
              <Route path="toast" element={<ToastPage />} />
              <Route path="modal" element={<ModalPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="date-picker" element={<DatePickerPage />} />
              <Route path="forms" element={<FormsPage />} />
              <Route path="charts" element={<Suspense fallback={<main className="min-h-[600px]" aria-busy="true" />}><ChartsPage /></Suspense>} />
              <Route path="data-view" element={<DataViewPage />} />
              <Route path="scheduler" element={<Suspense fallback={<main className="min-h-[600px]" aria-busy="true" />}><SchedulerPage /></Suspense>} />
            </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </div>
    </BrowserRouter>
  );
}
