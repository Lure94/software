export interface JwtPayload extends Request {
  user: {
    sub: string;
    email: string;
    rol: string;
  };
}
