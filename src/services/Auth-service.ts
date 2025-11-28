import type { IUserRegister, IUserLogin, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const signup = async (user: IUserRegister): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/users", user);
    response = {
      status: 200,
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: 400,
      success: false,
      message: "Usuário não pode ser cadastrado",
      data: err.response?.data,
    };
  }
  return response;
};

const login = async (user: IUserLogin): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/login", user);

    const token = data.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    response = {
      status: 200,
      success: true,
      message: "Login bem-sucedido",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: 401,
      success: false,
      message: "Usuário ou senha inválidos",
      data: err.response?.data,
    };
  }
  return response;
};

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  } catch {
    return false;
  }
};


const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
};

const AuthService = {
  signup,
  login,
  isAuthenticated,
  logout,
};

export default AuthService;
