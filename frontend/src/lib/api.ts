const BASE_URL = "http://localhost:8000/api";

function getHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  const response = await fetch(url, {
    ...options,
    headers: getHeaders((options.headers || {}) as Record<string, string>),
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_initials");
    const pathname = window.location.pathname;
    if (pathname !== "/" && pathname !== "/login") {
      window.location.href = "/login?expired=true";
    }
  }

  if (!response.ok) {
    let errorMessage = "An error occurred.";
    try {
      const errorData = await response.json();
      // Try to extract a human-readable message from DRF error shapes
      if (typeof errorData === "object") {
        const firstKey = Object.keys(errorData)[0];
        const firstVal = errorData[firstKey];
        errorMessage = Array.isArray(firstVal) ? firstVal[0] : firstVal;
        if (errorData.detail) errorMessage = errorData.detail;
      }
    } catch { /* ignore parse errors */ }
    throw new Error(String(errorMessage));
  }

  if (response.status === 204) return {} as T;
  return response.json() as Promise<T>;
}

export const api = {
  auth: {
    /** Login with email + password */
    async login(email: string, password: string) {
      // Send email in the 'username' field — the backend resolves it by email
      const res = await request<{ access: string; refresh: string; user: any }>("/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      });
      localStorage.setItem("access_token", res.access);
      localStorage.setItem("refresh_token", res.refresh);
      localStorage.setItem("user_email", res.user?.email || email);
      const initials = (res.user?.email || email).slice(0, 2).toUpperCase();
      localStorage.setItem("user_initials", initials);
      return res;
    },

    /** Register a new account with email + password + optional company */
    async register(email: string, password: string, companyName?: string) {
      return request<{ user: any; message: string }>("/auth/register/", {
        method: "POST",
        body: JSON.stringify({ email, password, company_name: companyName || "" }),
      });
    },

    logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_initials");
    },

    isAuthenticated(): boolean {
      return !!localStorage.getItem("access_token");
    },

    getUserInitials(): string {
      return localStorage.getItem("user_initials") || "??";
    },

    getUserEmail(): string {
      return localStorage.getItem("user_email") || "";
    },
  },

  dashboard: {
    async getAnalytics() {
      return request<any>("/dashboard/analytics/");
    },
  },

  trips: {
    async list() {
      return request<any[]>("/trips/");
    },

    async get(id: string | number) {
      return request<any>(`/trips/${id}/`);
    },

    async create(tripData: any) {
      return request<any>("/trips/create/", {
        method: "POST",
        body: JSON.stringify(tripData),
      });
    },

    async getStops(id: string | number) {
      return request<any[]>(`/trips/${id}/stops/`);
    },

    async getLogs(id: string | number) {
      return request<any[]>(`/trips/${id}/logs/`);
    },
  },
};
