export interface Product {
  id: number;
  name: string;
  case: string;
  strap: string;
  glasp: string;
  picUrl: string;
  gender: string;
}

export interface PagedProducts {
  items: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface LoginResponse {
  token: string;
  username: string;
}

const TOKEN_KEY = "violet_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    setToken(null);
    throw new ApiError(401, "unauthorized");
  }
  if (!response.ok) {
    let message = `request_failed_${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body
    }
    throw new ApiError(response.status, message);
  }
  return (await response.json()) as T;
}

export interface ProductQuery {
  name?: string;
  case_?: string;
  strap?: string;
  glasp?: string;
  gender?: string;
  page?: number;
  pageSize?: number;
}

export const api = {
  listProducts(query: ProductQuery = {}): Promise<PagedProducts> {
    const params = new URLSearchParams();
    if (query.name) params.set("name", query.name);
    if (query.case_) params.set("case_", query.case_);
    if (query.strap) params.set("strap", query.strap);
    if (query.glasp) params.set("glasp", query.glasp);
    if (query.gender) params.set("gender", query.gender);
    params.set("page", String(query.page ?? 1));
    params.set("pageSize", String(query.pageSize ?? 6));
    return request<PagedProducts>(`/api/products?${params}`);
  },

  getProduct(id: number): Promise<Product> {
    return request<Product>(`/api/products/${id}`);
  },

  createProduct(form: FormData): Promise<Product> {
    return request<Product>("/api/products", { method: "POST", body: form });
  },

  updateProduct(id: number, form: FormData): Promise<Product> {
    return request<Product>(`/api/products/${id}`, { method: "PUT", body: form });
  },

  deleteProduct(id: number): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>(`/api/products/${id}`, { method: "DELETE" });
  },

  login(username: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  },

  changePassword(oldPassword: string, newPassword: string, repeatedPassword: string): Promise<{ message: string }> {
    return request<{ message: string }>("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword, repeatedPassword }),
    });
  },
};
