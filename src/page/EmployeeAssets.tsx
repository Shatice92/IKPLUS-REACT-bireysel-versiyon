
import EmployeeSidebar from "../components/organisms/EmployeeSideBar";
import EmployeeAssetsTable from "../components/organisms/EmployeeAssetsTable";
import { useState } from "react";


const EmployeeAssets = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="deneme-container">
      <EmployeeSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="content">

          <EmployeeAssetsTable />
        </div>
      </main>
    </div>
  );
};

export default EmployeeAssets;