export interface JwtPayload {
  sub: number;
  user: string;
  email?: string;
}