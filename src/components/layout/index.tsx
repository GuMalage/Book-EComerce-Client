import { Outlet } from "react-router-dom";
import TopMenu from "../top-menu";
import Footer from "../footer";
import "./layout.css"

export function Layout() {
  return (
    <>
    <div className="layout-container">
      <TopMenu />

        <main >
          <Outlet />
        </main>
 
      <Footer />   
    </div>
      
    </>
  );
}
