import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SucessResponse, ErrorResponse } from "../utility/response";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/errors";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
  VerifyToken,
} from "../utility/password";
import { LoginInput } from "../models/dto/LoginInput";
import { TimeDifference } from "../utility/dateHelper";
import { ProfileInput } from "../models/dto/AddressInput";

@autoInjectable()
export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "requested method is not supported!");
  }

  // User Creation, Validation & Login
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const salt = await GetSalt();
      const hashedPassword = await GetHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        user_type: "BUYER",
        salt: salt,
      });

      return SucessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);
      const data = await this.repository.findAccount(input.email);
      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );
      if (!verified) {
        throw new Error("password does not match!");
      }
      const token = GetToken(data);

      return SucessResponse({ token });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  // User profile
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const result = await this.repository.createProfile(
        payload.user_id,
        input
      );
      return SucessResponse({ message: "profile created!" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");
      const result = await this.repository.getUserProfile(payload.user_id);
      return SucessResponse(result);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }
  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      await this.repository.editProfile(payload.user_id, input);
      return SucessResponse({ message: "profile updated!" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  // Payment Section
  async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Create Payment Method" });
  }

  async GetPaymentMethod(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Get Payment Method" });
  }

  async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Update Payment Method" });
  }
}
