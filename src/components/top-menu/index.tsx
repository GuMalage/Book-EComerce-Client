import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube} from "@fortawesome/free-solid-svg-icons"; 


const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = "user@loyalty.com"; 
  const { authenticated, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const items: MenuItem[] = [
    { 
      label: "Home", 
      icon: "pi pi-home", 
      command: () => navigate("/") 
    }, 
    {
      label: "Catálogo",
      icon: "pi pi-tag",
      items: [
        {
          label: "Ver Produtos",
          icon: "pi pi-list",
          command: () => navigate("/products"),
        },
      ],
    },
    ...(authenticated ? [
        {
            label: "Minha Conta",
            icon: "pi pi-user",
            items: [
                {
                    label: "Meu Perfil",
                    icon: "pi pi-id-card",
                    command: () => navigate("/profile"),
                },
                {
                    label: "Meus Endereços",
                    icon: "pi pi-map-marker",
                    command: () => navigate("/address"),
                },
            ]
        },
    ] : []),
    {
        label: "Carrinho",
        icon: "pi pi-shopping-cart",
        command: () => navigate("/cart"),
    }, 
  ];

  const start = (
    <div
      className="flex align-items-center gap-2 cursor-pointer menu-brand"
      onClick={() => navigate("/")}
    >
        <FontAwesomeIcon icon={faCube} size="lg" style={{ color: "var(--color-accent-light)" }} />
        <span className="font-bold text-xl app-name" style={{ color: "var(--color-text-light)" }}>Loyalty Store</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      {authenticated ? (
        <>
          <span className="font-semibold hidden sm:block user-email-display">{userEmail}</span>
          
          <Button
            icon="pi pi-sign-out"
            className="p-button-text p-button-logout"
            onClick={handleLogoutClick}
            tooltip="Sair"
            tooltipOptions={{ position: 'bottom' }}
          />
        </>
      ) : (
         <Button
            label="Entrar"
            icon="pi pi-sign-in"
            className="p-button-text p-button-login"
            onClick={() => navigate("/login")}
        />
      )}
    </div>
  );

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 top-menu-container"
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default TopMenu;