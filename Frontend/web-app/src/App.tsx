import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import VacationsPage from "./pages/VacationsPage/VacationsPage";
import AdminVacationsPage from "./pages/AdminVacationsPage/AdminVacationsPage";
import AddVacationPage from "./pages/AddVacationPage/AddVacationPage";
import EditVacationPage from "./pages/EditVacationPage/EditVacationPage";
import ReportsPage from "./pages/ReportsPage/ReportsPage";
import Page404 from "./pages/Page404/Page404";

function App() {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <Layout>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/vacations" />} />
                <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/vacations" />} />

                {/* User routes */}
                <Route path="/vacations" element={
                    !user ? <Navigate to="/login" /> :
                        user.role === "admin" ? <Navigate to="/admin/vacations" /> :
                            <VacationsPage />
                } />

                {/* Admin routes */}
                <Route path="/admin/vacations" element={
                    !user ? <Navigate to="/login" /> :
                        user.role !== "admin" ? <Navigate to="/vacations" /> :
                            <AdminVacationsPage />
                } />
                <Route path="/admin/vacations/add" element={
                    !user ? <Navigate to="/login" /> :
                        user.role !== "admin" ? <Navigate to="/vacations" /> :
                            <AddVacationPage />
                } />
                <Route path="/admin/vacations/edit/:id" element={
                    !user ? <Navigate to="/login" /> :
                        user.role !== "admin" ? <Navigate to="/vacations" /> :
                            <EditVacationPage />
                } />
                <Route path="/admin/reports" element={
                    !user ? <Navigate to="/login" /> :
                        user.role !== "admin" ? <Navigate to="/vacations" /> :
                            <ReportsPage />
                } />

                {/* Redirects */}
                <Route path="/" element={<Navigate to={user ? "/vacations" : "/login"} />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Layout>
    );
}

export default App;
