import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar for authenticated users */}
        {user && <Sidebar />}
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          user && sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;