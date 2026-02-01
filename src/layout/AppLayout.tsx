import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050B14] via-[#070F1E] to-[#050B14] text-white">
      {/* Global glow background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <Outlet />
    </div>
  );
}
