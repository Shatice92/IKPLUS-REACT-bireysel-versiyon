import React, { useState } from 'react'
import EmployeeSidebar from '../components/organisms/EmployeeSideBar';
import EmployeeShiftAndBreakTable from '../components/organisms/EmployeeShiftAndBreakTable';

function EmployeeShiftAndBreakManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="deneme-container">
      <EmployeeSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="content">
          
          <EmployeeShiftAndBreakTable />
        </div>
      </main>
    </div>
  );
};

export default EmployeeShiftAndBreakManagement