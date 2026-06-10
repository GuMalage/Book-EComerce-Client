import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser: AuthenticatedUser | undefined;
  handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<void>;
  handleLogout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | undefined>(undefined);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken);
        setAuthenticatedUser(JSON.parse(storedUser));
        setAuthenticated(true);
        
        
        api.defaults.headers.common["Authorization"] = `Bearer ${parsedToken}`;
      } catch (error) {
        console.error("Erro ao restaurar sessão", error);
        handleLogout(); 
      }
    }
  
  }, []);

 
  const handleLogin = async (authenticationResponse: AuthenticationResponse) => {
    try {
      localStorage.setItem("token", JSON.stringify(authenticationResponse.token));
      localStorage.setItem("user", JSON.stringify(authenticationResponse.user));
      
      api.defaults.headers.common["Authorization"] = `Bearer ${authenticationResponse.token}`;

      setAuthenticatedUser(authenticationResponse.user);
      setAuthenticated(true);
    } catch {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];

    setAuthenticated(false);
    setAuthenticatedUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, authenticatedUser, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};