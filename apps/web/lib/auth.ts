export type AuthUser = {
  id: string;
  email: string;
  token: string;
};

let authUser: AuthUser | null = null;

export function setAuthUser(user: AuthUser) {
  authUser = user;
}

export function getAuthUser() {
  return authUser;
}

export function clearAuthUser() {
  authUser = null;
}
