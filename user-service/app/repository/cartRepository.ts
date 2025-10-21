import { ShoppingCartModel } from "../models/ShoppingCartModel";
import { DBOperation } from "./dbOperation";
import { CartItemModel } from "../models/CartItemsModel";

export class CartRepository extends DBOperation {
  constructor() {
    super();
  }

  async findShoppingCart(userId: number) {
    const queryString = "SELECT cart_id, user_id FROM shopping_carts WHERE user_id = ?";
    const values = [userId];
    const result: any = await this.executeQuery(queryString, values);
    return Array.isArray(result) && result.length > 0
      ? (result[0] as ShoppingCartModel)
      : false;
  }

  async createShoppingCart(userId: number) {
    const queryString = "INSERT INTO shopping_carts(user_id) VALUES(?)";
    const values = [userId];
    const result: any = await this.executeQuery(queryString, values);
    if (result && result.affectedRows > 0) {
      const inserted = await this.executeQuery(
        "SELECT cart_id, user_id FROM shopping_carts WHERE cart_id = ?",
        [result.insertId]
      );
      return Array.isArray(inserted) && inserted.length > 0
        ? (inserted[0] as ShoppingCartModel)
        : false;
    }
    return false;
  }

  async findCartItemById(itemId: number) {
    const queryString =
      "SELECT item_id, cart_id, product_id, name, image_url, price, item_qty, created_at FROM cart_items WHERE item_id = ?";
    const values = [itemId];
    const result: any = await this.executeQuery(queryString, values);
    return Array.isArray(result) && result.length > 0
      ? (result[0] as CartItemModel)
      : false;
  }

  async findCartItemByProductId(productId: string) {
    const queryString =
      "SELECT item_id, product_id, price, item_qty FROM cart_items WHERE product_id = ?";
    const values = [productId];
    const result: any = await this.executeQuery(queryString, values);
    return Array.isArray(result) && result.length > 0
      ? (result[0] as CartItemModel)
      : false;
  }

  async findCartItems(userId: number) {
    const queryString = `SELECT 
    ci.cart_id,
    ci.item_id,
    ci.product_id,
    ci.name,
    ci.price,
    ci.item_qty,
    ci.image_url,
    ci.created_at FROM shopping_carts sc INNER JOIN cart_items ci ON sc.cart_id=ci.cart_id WHERE sc.user_id=?`;
    const values = [userId];
    const result: any = await this.executeQuery(queryString, values);
    return Array.isArray(result) && result.length > 0 ? (result as CartItemModel[]) : [];
  }

  async findCartItemsByCartId(cartId: number) {
    const queryString =
      "SELECT product_id, name, image_url, price, item_qty FROM cart_items WHERE cart_id = ?";
    const values = [cartId];
    const result: any = await this.executeQuery(queryString, values);
    return Array.isArray(result) && result.length > 0 ? (result as CartItemModel[]) : [];
  }

  async createCartItem({
    cart_id,
    product_id,
    name,
    image_url,
    price,
    item_qty,
  }: CartItemModel) {
    const queryString =
      "INSERT INTO cart_items(cart_id, product_id, name, image_url, price, item_qty) VALUES(?,?,?,?,?,?)";
    const values = [cart_id, product_id, name, image_url, price, item_qty];
    const result: any = await this.executeQuery(queryString, values);
    if (result && result.affectedRows > 0) {
      const inserted = await this.executeQuery(
        "SELECT item_id, cart_id, product_id, name, image_url, price, item_qty, created_at FROM cart_items WHERE item_id = ?",
        [result.insertId]
      );
      return Array.isArray(inserted) && inserted.length > 0 ? (inserted[0] as CartItemModel) : false;
    }
    return false;
  }

  async updateCartItemById(itemId: number, qty: number) {
    const queryString = "UPDATE cart_items SET item_qty = ? WHERE item_id = ?";
    const values = [qty, itemId];
    const result: any = await this.executeQuery(queryString, values);
    if (result && result.affectedRows > 0) {
      const updated = await this.executeQuery(
        "SELECT item_id, cart_id, product_id, name, image_url, price, item_qty, created_at FROM cart_items WHERE item_id = ?",
        [itemId]
      );
      return Array.isArray(updated) && updated.length > 0 ? (updated[0] as CartItemModel) : false;
    }
    return false;
  }

  async updateCartItemByProductId(productId: string, qty: number) {
    const queryString = "UPDATE cart_items SET item_qty = ? WHERE product_id = ?";
    const values = [qty, productId];
    const result: any = await this.executeQuery(queryString, values);
    if (result && result.affectedRows > 0) {
      const updated = await this.executeQuery(
        "SELECT item_id, cart_id, product_id, name, image_url, price, item_qty, created_at FROM cart_items WHERE product_id = ?",
        [productId]
      );
      return Array.isArray(updated) && updated.length > 0 ? (updated[0] as CartItemModel) : false;
    }
    return false;
  }

  async deleteCartItem(id: number) {
    const queryString = "DELETE FROM cart_items WHERE item_id = ?";
    const values = [id];
    return this.executeQuery(queryString, values);
  }
}