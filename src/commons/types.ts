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
  urlImage?: string;
  longDescription: string;
  autorName: string; 
}

export interface IAddress {
  id?: number;
  zip: string;
  street: string;
  city: string;
  houseNumber: string;
  complement: string;
  
}

export interface IOrder {
    id?: number;
    itemsList: {productId: number, quantity: number}[];
    totalPrice: number;
    paymentType: String ;
    shippingType: String ;
    addressId: number ;
}

export interface IOrderResponse {
    id?: number;
    dateOrder: Date;
    itemsList: {productId: number, productPrice: number, quantity: number, productName: String, totalPriceItems: number, urlImage: string}[];
    addressId: number,
    totalPrice: number;
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

