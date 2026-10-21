import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';

export default function ComponentsLayout() {
  return (
    <div
      data-components-layout=""
      className="grid min-h-[780px] grid-cols-[190px_minmax(0,1fr)] min-[581px]:max-[761px]:grid-cols-[155px_minmax(0,1fr)] max-[581px]:grid-cols-1"
    >
      <Sidebar />
      <Outlet />
    </div>
  );
}
