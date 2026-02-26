import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => (
  <div className="dashboard-root">
    <Navbar dashboard={true} />
    <div className="dashboard-body">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <Suspense
            fallback={
              <div className="dashboard-loader">
                <div className="spinner" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  </div>
);

export default DashboardLayout;
