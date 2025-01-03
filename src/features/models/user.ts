export enum Role {
  admin = "admin",
  client = "client",
}

export type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type UserTokenProps = {
  user_id: string;
  token: string;
};

export type TokenProps = {
  access_token: string;
  refresh_token: string;
};
