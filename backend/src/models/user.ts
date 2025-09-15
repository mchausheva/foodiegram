export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  bio?: string;
  location?: string;
  joinedAt?: string;
  avatar: string; // URL to avatar image
  role?: 'user' | 'admin';
  active?: boolean;
}