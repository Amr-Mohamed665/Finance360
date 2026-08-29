import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 px-4 md:px-8 py-6 md:py-8 max-w-full">
        <Outlet />
      </main>
    </div>
  );
}
