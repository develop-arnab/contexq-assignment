import { AddressModel } from "../models/AddressModel";
import { ProfileInput } from "../models/dto/AddressInput";
import { UserModel } from "../models/UserModel";
import { DBOperation } from "./dbOperation";

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async createAccount({ phone, email, password, salt, user_type }: UserModel) {
    const queryString =
      "INSERT INTO users(phone, email, password, salt, user_type) VALUES(?, ?, ?, ?, ?)";
    const values = [phone, email, password, salt, user_type];
    const result: any = await this.executeQuery(queryString, values);

    if (result && result.affectedRows > 0) {
      // fetch the newly inserted row
      const inserted = await this.executeQuery(
        "SELECT * FROM users WHERE user_id = ?",
        [result.insertId]
      );
      return (Array.isArray(inserted) && inserted[0]) as UserModel;
    }

    throw new Error("error while creating user!");
  }

  async findAccount(email: string) {
    const queryString =
      "SELECT user_id, email, password, phone, salt FROM users WHERE email = ?";
    const values = [email];
    const result: any = await this.executeQuery(queryString, values);

    if (!Array.isArray(result) || result.length < 1) {
      throw new Error("user does not exist with provided email id!");
    }
    return result[0] as UserModel;
  }

  async updateVerificationCode(userId: number, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code = ?, expiry = ? WHERE user_id = ? AND verified = FALSE";
    const values = [code, expiry, userId];
    const result: any = await this.executeQuery(queryString, values);

    if (result && result.affectedRows > 0) {
      const updated = await this.executeQuery(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
      );
      return (Array.isArray(updated) && updated[0]) as UserModel;
    }
    throw new Error("user already verified!");
  }

  async updateVerifyUser(userId: number) {
    const queryString =
      "UPDATE users SET verified = TRUE WHERE user_id = ? AND verified = FALSE";
    const values = [userId];
    const result: any = await this.executeQuery(queryString, values);

    if (result && result.affectedRows > 0) {
      const updated = await this.executeQuery(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
      );
      return (Array.isArray(updated) && updated[0]) as UserModel;
    }
    throw new Error("user already verified!");
  }

  async updateUser(
    user_id: number,
    firstName: string,
    lastName: string,
    user_type: string
  ) {
    const queryString =
      "UPDATE users SET first_name = ?, last_name = ?, user_type = ? WHERE user_id = ?";
    const values = [firstName, lastName, user_type, user_id];
    const result: any = await this.executeQuery(queryString, values);

    if (result && result.affectedRows > 0) {
      const updated = await this.executeQuery(
        "SELECT * FROM users WHERE user_id = ?",
        [user_id]
      );
      return (Array.isArray(updated) && updated[0]) as UserModel;
    }
    throw new Error("error while updating user!");
  }

  async createProfile(
    user_id: number,
    {
      firstName,
      lastName,
      user_type,
      address: { addressLine1, addressLine2, city, postCode, country },
    }: ProfileInput
  ) {
    await this.updateUser(user_id, firstName, lastName, user_type);

    const queryString =
      "INSERT INTO address(user_id, address_line1, address_line2, city, post_code, country) VALUES(?, ?, ?, ?, ?, ?)";
    const values = [
      user_id,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
    ];
    const result: any = await this.executeQuery(queryString, values);

    if (result && result.affectedRows > 0) {
      const inserted = await this.executeQuery(
        "SELECT * FROM address WHERE id = ?",
        [result.insertId]
      );
      return (Array.isArray(inserted) && inserted[0]) as AddressModel;
    }

    throw new Error("error while creating profile!");
  }

  async getUserProfile(user_id: number) {
    const profileQuery =
      "SELECT first_name, last_name, email, phone, user_type, verified FROM users WHERE user_id = ?";
    const profileValues = [user_id];

    const profileResult: any = await this.executeQuery(
      profileQuery,
      profileValues
    );
    if (!Array.isArray(profileResult) || profileResult.length < 1) {
      throw new Error("user profile does not exist!");
    }

    const userProfile = profileResult[0] as UserModel;

    const addressQuery =
      "SELECT id, address_line1, address_line2, city, post_code, country FROM address WHERE user_id = ?";
    const addressValues = [user_id];
    const addressResult: any = await this.executeQuery(addressQuery, addressValues);
    if (Array.isArray(addressResult) && addressResult.length > 0) {
      userProfile.address = addressResult as AddressModel[];
    }

    return userProfile;
  }

  async editProfile(
    user_id: number,
    {
      firstName,
      lastName,
      user_type,
      address: { addressLine1, addressLine2, city, postCode, country, id },
    }: ProfileInput
  ) {
    await this.updateUser(user_id, firstName, lastName, user_type);

    const addressQuery =
      "UPDATE address SET address_line1 = ?, address_line2 = ?, city = ?, post_code = ?, country = ? WHERE id = ?";
    const addressValues = [
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
      id,
    ];

    const addressResult: any = await this.executeQuery(addressQuery, addressValues);

    if (!addressResult || addressResult.affectedRows < 1) {
      throw new Error("error while updating profile!");
    }
    return true;
  }
}