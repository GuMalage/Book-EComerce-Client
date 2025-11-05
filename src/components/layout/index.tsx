import { Outlet } from "react-router-dom";
import TopMenu from "../top-menu";
import Footer from "../footer";

export function Layout() {
  return (
    <>
      <TopMenu />

        <main >
          <Outlet />
        </main>
 

      <Footer />   
    </>
  );
}
