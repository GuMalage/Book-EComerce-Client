import type { IAddress, IResponse} from "@/commons/types";
import { api } from "@/lib/axios";
import axios from "axios";

const addressURL = "/address";

export interface ShipmentRequest {
  fromZip: string;
  toZip: string;
  weight: number;
  length: number;
  height: number;
  width: number;
}

const save = async (address: IAddress): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(addressURL, address);
    response = {
      status: 200,
      success: true,
      message: "Endereço salvo com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao salvar endereço",
      data: err.response?.data,
    };
  }
  return response;
};

const remove = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.delete(`${addressURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Endereço removido com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao remover endereço",
      data: err.response?.data,
    };
  }
  return response;
};

const findById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${addressURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Endereço carregado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar endereço",
      data: err.response?.data,
    };
  }
  return response;
};


const getByUser = async (): Promise<IAddress[] | undefined> => {
  try {
    const response = await api.get(`${addressURL}/my-address`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar endereços do usuário:", error);
    return undefined;
  }
};

export default {
  save,
  remove,
  findById,
  getByUser,
};
