export type UserRole = 'citizen' | 'analyst' | 'admin';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = response.headers.get('content-type')?.includes('application/json')
      ? await response.json() as { error?: string }
      : null;
    throw new ApiError(body?.error || 'Não foi possível concluir a solicitação.', response.status);
  }
  return response;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await request('/api/auth/me');
  const body = await response.json() as { user: AuthUser | null };
  return body.user;
}

export async function signInRequest(email: string, password: string): Promise<AuthUser> {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json() as { user: AuthUser };
  return body.user;
}

export async function promoteCurrentUserToAdmin(adminSetupToken: string): Promise<AuthUser> {
  const response = await request('/api/auth/admin-setup', {
    method: 'POST',
    body: JSON.stringify({ adminSetupToken }),
  });
  const body = await response.json() as { user: AuthUser };
  return body.user;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
  adminSetupToken?: string,
): Promise<AuthUser> {
  const response = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
      ...(adminSetupToken ? { adminSetupToken } : {}),
    }),
  });
  const body = await response.json() as { user: AuthUser };
  return body.user;
}

export async function signOutRequest(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' });
}

export type AdminUsersResponse = {
  users: AuthUser[];
  summary: {
    total: number;
    common: number;
    analysts: number;
  };
  filteredTotal: number;
  page: number;
  pageSize: number;
};

export async function getAdminUsers(
  { query, role, page, signal }: {
    query: string;
    role: 'all' | UserRole;
    page: number;
    signal?: AbortSignal;
  },
): Promise<AdminUsersResponse> {
  const params = new URLSearchParams({
    q: query,
    role,
    page: String(page),
  });
  const response = await request(`/api/admin/users?${params}`, { signal });
  return await response.json() as AdminUsersResponse;
}

export async function createAdminUser(
  { name, email, password }: { name: string; email: string; password: string },
): Promise<AuthUser> {
  const response = await request('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  const body = await response.json() as { user: AuthUser };
  return body.user;
}

export async function grantAnalystRole(userId: number): Promise<AuthUser> {
  const response = await request(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role: 'analyst' }),
  });
  const body = await response.json() as { user: AuthUser };
  return body.user;
}
