import type { IUserRegister, IUserLogin, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

/**
 * Função para cadastrar um novo usuário
 * @param user - Dados do usuário que será cadastrado do tipo IUserRegister
 * @returns - Retorna a resposta da API
 */
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

/**
 * Função para realizar a autenticação do usuário
 * @param user - Dados do usuário que será autenticado do tipo IUserLogin
 * @returns - Retorna a resposta da API
 */
const login = async (user: IUserLogin): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/login", user);

    // Salva o token no localStorage
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

/**
 * Função que verifica se o usuário está autenticado
 * @returns true se existir um token válido no localStorage
 */
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  // Verifica se o token expirou (decodifica o JWT)
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp * 1000; // exp vem em segundos
    return Date.now() < exp;
  } catch {
    return false;
  }
};

/**
 * Função para realizar o logout do usuário
 */
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
