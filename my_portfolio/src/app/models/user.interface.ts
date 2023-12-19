export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserTable {
  id: number;
  username: string;
  email: string;
  role: string;
  image_url: string;
}

export interface UsersData {
  message: string;
  result: UserTable[];
}
