import type { ReactNode } from "react";
import Header from "../Header/Header";
import "./Layout.css";

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div className="Layout">
            <Header />
            <main className="MainContent">
                {children}
            </main>
        </div>
    );
}

export default Layout;
