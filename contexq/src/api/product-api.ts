import { BASE_URL, PRODUCT_URL } from "../utils/AppConst";
import { ResponseModel } from "../types";
import { axiosAuth, handleResponse } from "./common";
export const FetchProductsApi = async (
  token: string
): Promise<ResponseModel> => {
  try {
    const auth = axiosAuth(token);
    const response = await auth.get(
      `${PRODUCT_URL}/product`
    );
    return handleResponse(response);
  } catch (error) {
    console.log(error);
    return {
      msg: "error occured",
    };
  }
};

/**
 * Add product to cart (creates cart item via local user-service cart endpoint)
 * payload should match the backend expectation: product_id, name, image_url, price, item_qty, (optional cart_id)
 */
export const AddToCartApi = async (
  token: string,
  payload: {
    product_id: string;
    name: string;
    image_url?: string;
    price: number;
    item_qty: number;
    cart_id?: number;
  }
): Promise<ResponseModel> => {
  try {
    const auth = axiosAuth(token);
    const response = await auth.post(`${PRODUCT_URL}/cart`, payload);
    return handleResponse(response);
  } catch (error) {
    console.log(error);
    return {
      msg: "error occured",
    };
  }
};
export const FetchCartItemsApi = async (
  token: string
): Promise<ResponseModel> => {
  try {
    const auth = axiosAuth(token);
    const response = await auth.get(`${BASE_URL}/cart`);
    return handleResponse(response);
  } catch (error) {
    console.log(error);
    return {
      msg: "error occured",
    };
  }
};
