import { User } from "../../../shared/types/user.type";


export interface LoginResponseDto {
  access_token: string;
  user: User
}