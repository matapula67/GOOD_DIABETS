import { User, Gender } from '../types';

const USERS_KEY = 'dra_users';
const SESSION_KEY = 'dra_session';

function readUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  age: number;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const auth = {
  register(data: RegisterInput): User {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('Barua pepe hii tayari imesajiliwa.');
    }
    const user: User = {
      id: 'u_' + Date.now().toString(36),
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      gender: data.gender,
      age: Number(data.age),
      password: data.password,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, user.id);
    return user;
  },

  login({ email, password }: LoginInput): User {
    const users = readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error('Barua pepe au nenosiri si sahihi.');
    localStorage.setItem(SESSION_KEY, user.id);
    return user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  currentUser(): User | null {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return readUsers().find((u) => u.id === id) || null;
  },

  updateCurrentUser(patch: Partial<User>): User | null {
    const current = auth.currentUser();
    if (!current) return null;
    const users = readUsers().map((u) => (u.id === current.id ? { ...u, ...patch } : u));
    writeUsers(users);
    return users.find((u) => u.id === current.id) || null;
  },
};
