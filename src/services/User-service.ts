import { api } from "@/lib/axios.ts";
import type { AuthenticatedUser, IUserAuthorities, IUserLogin, IUserStatus } from "@/commons/types";

const userURL = "/users";

const updateStatusUser = async (user: IUserStatus): Promise<any> => {
  try {
    const response = await api.put(
      `${userURL}/status/${user.id}`,
      user
    );
    return {
      httpStatus: response.status,
      data: response.data
    };
  } catch (error: any) {
    return {
      httpStatus: error.response?.status || 500,
      data: null
    };
  }
};

const updatePermissionUser = async (user: IUserAuthorities): Promise<any> => {
  try {
    const response = await api.put(
      `${userURL}/permission/${user.id}`,
      user
    );
    return {
      httpStatus: response.status,
      data: response.data
    };
  } catch (error: any) {
    return {
      httpStatus: error.response?.status || 500,
      data: null
    };
  }
};

const getAllUsersClient = async (): Promise<AuthenticatedUser[] | undefined> => {
  try {
    const response = await api.get(`${userURL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return undefined;
  }
};


const getAllUsers = async (): Promise<AuthenticatedUser[] | undefined> => {
  try {
    const response = await api.get(userURL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return undefined;
  }
};

const UserService = {
  updateStatusUser,
  updatePermissionUser,
  getAllUsersClient,
  getAllUsers
};

export default UserService;