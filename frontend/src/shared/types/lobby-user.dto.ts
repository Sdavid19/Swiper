import { UserDto } from "./generated";

export interface LobbyUserDto extends UserDto {
    ready: boolean
}