const BASE_URL = "http://localhost:8000/api";

// Helper to get headers with JWT token if available
function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

// Custom request wrapper that handles dynamic fetch calls
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  const mergedOptions = {
    ...options,
    headers: getHeaders((options.headers || {}) as Record<string, string>),
  };

  const response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    // If the token is invalid or expired, clear localStorage and redirect to login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_initials");
    localStorage.removeItem("username");
    
    // Only redirect if we are not on the login page or home page
    const pathname = window.location.pathname;
    if (pathname !== "/" && pathname !== "/login") {
      window.location.href = "/login?expired=true";
    }
  }

  if (!response.ok) {
    let errorMessage = "An error occurred during the request.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData) || errorMessage;
    } catch {
      // JSON parsing failed
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Authentication services
  auth: {
    async login(username: string, password: string) {
      const res = await request<{ access: string; refresh: string }>("/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      
      localStorage.setItem("access_token", res.access);
      localStorage.setItem("refresh_token", res.refresh);
      localStorage.setItem("username", username);
      
      // Save initials for the navbar badge
      const initials = username.slice(0, 2).toUpperCase();
      localStorage.setItem("user_initials", initials);
      
      return res;
    },
    
    logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      localStorage.removeItem("user_initials");
    },
    
    isAuthenticated(): boolean {
      return !!localStorage.getItem("access_token");
    },
    
    getUserInitials(): string {
      return localStorage.getItem("user_initials") || "JD";
    },
    
    getUsername(): string {
      return localStorage.getItem("username") || "Guest";
    }
  },

  // Operations Dashboard
  dashboard: {
    async getAnalytics() {
      return request<any>("/dashboard/analytics/");
    }
  },

  // Trips Planning & Inspection
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
    }
  }
};
