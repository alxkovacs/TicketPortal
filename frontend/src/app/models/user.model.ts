export interface User {
  _id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  token?: string; // A bejelentkezéskor kapott JWT token
} 