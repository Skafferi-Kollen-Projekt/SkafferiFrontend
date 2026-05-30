export type ApiFieldError = { path: string; message: string };

export type ApiError = {
  message?: string;
  details?: ApiFieldError[];
};

export type AuthUser = {
  id: number;
  firstname?: string;
  lastname?: string;
  email: string;
  role?: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  data?: AuthUser;
};

export type RegisterPayload = {
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
  } catch {
    return {};
  }
}

export function normalizeFieldPath(path: string) {
  return path.replace(/^body\./, "");
}

// ✅ REGISTER (cookie sätts i backend)
export async function registerAccount(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include", // ✅ VIKTIGT
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await parseJson(res)) as AuthResponse & ApiError;
  if (!res.ok) throw data as ApiError;
  return data;
}

// ✅ LOGIN (cookie sätts i backend)
export async function loginAccount(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await parseJson(res)) as AuthResponse & ApiError;
  if (!res.ok) throw data as ApiError;
  return data;
}

// ✅ LOGOUT (cookie rensas i backend)
export async function logoutAccount(): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = (await parseJson(res)) as AuthResponse & ApiError;
  if (!res.ok) throw data as ApiError;
  return data;
}
