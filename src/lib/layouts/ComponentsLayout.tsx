import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';

export default function ComponentsLayout() {
  const location = useLocation();
  return (
    <div
      data-components-layout=""
      className="grid min-h-[780px] grid-cols-[190px_minmax(0,1fr)] max-[768px]:grid-cols-1 max-[768px]:content-start"
    >
      <Sidebar key={location.key} />
      <Outlet />
    </div>
  );
}
