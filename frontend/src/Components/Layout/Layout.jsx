import React from 'react';
import {Header} from '../Header/Header';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex flex-col w-full">
        <header className="flex items-center justify-center">
          <Header />
        </header>
        <div className="md:flex-grow overflow-y-auto dashboard-1-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
  };

export default Layout;