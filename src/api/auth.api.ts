export type ApiFieldError = { path: string; message: string };

export type ApiError = {
  message?: string;
  details?: ApiFieldError[];
};

export type AuthResponse = {
  token: string;
  user?: {
    id: number;
    firstname?: string;
    lastname?: string;
    email: string;
    role?: string;
  };
};

export type RegisterPayLoad = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

const API_BASE = "http://localhost:4000/api";

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch (error) {
    return {};
  }
}

export function normalizeFieldPath(path: string) {
  return path.replace(/^body\./, "");
}

export async function registerAccount(
  payload: RegisterPayLoad,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await parseJson(res)) as AuthResponse & ApiError;
  if (!res.ok) throw data as ApiError;
  return data;
}

export async function loginAccount(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(res)) as AuthResponse & ApiError;

  if (!res.ok) throw data as ApiError;
  return data;
}
