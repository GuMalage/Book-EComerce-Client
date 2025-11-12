import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const user = "user@email.com";
  const { authenticated, handleLogout } = useAuth();


  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const items: MenuItem[] =  [
        { label: "Home", command: () => navigate("/") },
        {
          label: "Categorias",
          items: [
            {
              label: "Listar",
              icon: "pi pi-list",
              command: () => navigate("/categories"),
            },
            {
              label: "Novo",
              icon: "pi pi-plus",
              command: () => navigate("/categories/new"),
            },            
          ],
        },    
         {
          label: "Produtos",
          items: [
            {
              label: "Listar",
              icon: "pi pi-list",
              command: () => navigate("/products"),
            },
            {
              label: "Novo",
              icon: "pi pi-plus",
              command: () => navigate("/products/new"),
            },
          ],
        },      
        {
          label: "Endereço",
          command: () => navigate("/address"),
        }, 
         {
          label: "Cart",
          command: () => navigate("/cart"),
        }, 
      ]

  const start = (
    <div
      className="flex align-items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">

      {authenticated && (
        <>
          <span className="font-semibold hidden sm:block">{user}</span>
         
          <Button
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={handleLogoutClick}
          />
        </>
      )}
    </div>
  );

  
  return (

    
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: "#ccc", height: "60px" }}

      className="fixed top-0 left-0 w-full z-50"
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default TopMenu;