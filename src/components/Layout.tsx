import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-40 w-full border-b border-[#eaeaea] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              <NavLink 
                to="/events" 
                className={({ isActive }) => `nav-link ${isActive ? 'active text-black font-semibold' : ''}`}
              >
                Events
              </NavLink>
              <NavLink 
                to="/locations" 
                className={({ isActive }) => `nav-link ${isActive ? 'active text-black font-semibold' : ''}`}
              >
                Locations
              </NavLink>
              <NavLink 
                to="/speakers" 
                className={({ isActive }) => `nav-link ${isActive ? 'active text-black font-semibold' : ''}`}
              >
                Speakers
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
