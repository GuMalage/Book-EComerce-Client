export interface IUserRegister {
    displayName: string;
    username: string;
    password: string;
}

export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: object
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export  interface  ICategory {
    id?:  number;
    name:  string;
}

export interface IProduct {
  cartQuantity: number;
  id: number;
  name: string;
  description: string;
  price: number;
  category: ICategory;
  img: String;
}

export interface IAddress {
  id?: number;
  zip: String;
  street: string;
  city: string;
  houseNumber: string;
  complement: string;
  cep: string;
}

export interface IOrder {
    id?: number;
    itemsList: {productId: number, quantity: number}[];
    total: number;
    paymentType: String ;
    shippingType: String ;
    addressId: number ;
    shipping: number;
}

export interface IResponseOrder {
    id?: number;
    orderDate: string;
    itemsList: {productId: number, productPrice: number, quantity: number, productName: String, totalPriceItems: number}[];
    total: number;
}

export interface ICartItem {
    id?: number;
    name: string;
    brand: string;
    description: string;
    price: number;
    details: string;
    quantity: number;
    ingredients: string;
    image: string;
    category: ICategory;
}

export interface ICartItem {
    id?: number;
    name: string;
    brand: string;
    description: string;
    price: number;
    details: string;
    quantity: number;
    ingredients: string;
    image: string;
    category: ICategory;
}

export interface ShippingOption {
    id: number;
    name: string;
    price: string;
    custom_price: string;
    discount: string;
    currency: string;
    delivery_time: number;
}