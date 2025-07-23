export interface IAddress {
    _id: string;
    userId: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }


  export type ShippingAddress = {
    _id: string;
    userId: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

  