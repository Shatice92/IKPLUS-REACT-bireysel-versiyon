import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/Footer";
import Header from "./components/Header";
import { HomeStyles, DefaultStyles } from "./styles/styles"; // Import yaptık
import ForgotPassword from "./page/ForgotPassword";
import UserProfile from "./page/UserProfile";
import CompanyManagerPermissions from "./page/CompanyManagerPermissions";
import Permissions from "./page/Permissions"; // Çalışanlar için İzinler Sayfası
import ResetPassword from "./page/ResetPassword";

import ShiftManagement from "./page/ShiftManagement";

import EmployeeAssets from "./page/EmployeeAssets";
import AssetsTable from "./components/organisms/EmployeeAssetsTable";
import CompanyManagerAssetManagement from "./page/CompanyManagerAssetManagement";
import AdminCompanyManagement from "./page/AdminCompanyManagement";


import Notifications from "./page/Notifications";
import PersonalManagementPage from "./page/PersonalManagementPage";
import ExpensesPage from "./page/ExpensesPage";
import Comments from "./page/Comments";
import EmployeeShiftAndBreakManagement from "./page/EmployeeShiftAndBreakManagement";
import AdminDefinitions from "./page/AdminDefinitions";
import CompanyManagerExpenses from "./page/CompanyManagerExpenses";
import CompanyManagerComments from "./page/CompanyManagerComments";



// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./page/Login"))
const Register = lazy(() => import("./page/Register"));

const RouterPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // Eğer bölüm yoksa (başka sayfadaysa), ana sayfaya gidip o bölüme scroll yap
      navigate(`/#${sectionId}`, { replace: true });
    }
  };


  const handleSave = (updatedData: any) => {
    // API'ye güncellenmiş veriyi göndermek için burada bir işlem yapılabilir
    console.log("Updated user data:", updatedData);
  };

  return (
    <>
      {/* Default styles tüm sayfalarda geçerli olacak */}
      <DefaultStyles />

      {/* Home sayfasına özel stil */}
      <Routes>
        <Route path="/homepage" element={<HomeStyles />} />
      </Routes>

      <Header
        scrollToAbout={() => scrollToSection("about")}
        scrollToMission={() => scrollToSection("mission")}
        scrollToProduct={() => scrollToSection("product")}
        scrollToContact={() => scrollToSection("contact")}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/homepage" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/employee-assets" element={<EmployeeAssets />} />
          <Route path="/companymanager-assets" element={<CompanyManagerAssetManagement />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/companymanager-leaves" element={<CompanyManagerPermissions />} />
          <Route path="/company-management" element={<AdminCompanyManagement />} />
          <Route path="/companymanager-shifts" element={<ShiftManagement />} />
          <Route path="/employee-leaves" element={<Permissions />} />
          <Route path="/companymanager-personal-management" element={<PersonalManagementPage />} />
          <Route path="/employee-expenses" element={<ExpensesPage />} />
          <Route path="/comments" element={<Comments />} /> 
          <Route path="/employee-shiftsandbreaks" element={<EmployeeShiftAndBreakManagement />} /> 
          <Route path="/definition-management" element={<AdminDefinitions />} />
          <Route path="/companymanager-expenses" element={<CompanyManagerExpenses />} />
          <Route path="/companymanager-comments" element={<CompanyManagerComments />} />
          <Route
            path="/profile"
            element={
              <UserProfile
              />
            }
          />

        </Routes>
      </Suspense>

      <Footer />
    </>
  );
};

export default RouterPage;