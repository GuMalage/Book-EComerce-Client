import { api } from "@/lib/axios.ts";
import type { IUserLogin } from "@/commons/types";

const userURL = "/user";


const updateUser = async (user: IUserLogin): Promise<any> => {
    try {
        return await api.put(`${userURL}`, user);
    } catch (error: any) {
        return error.response;
    }
};

const UserService = {
    updateUser,
};

export default UserService;