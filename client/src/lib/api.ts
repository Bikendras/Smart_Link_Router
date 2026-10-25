import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type Platform = 'ios' | 'android' | 'desktop';

export interface LinkItem {
  _id: string;
  title: string;
  alias: string;
  iosUrl: string;
  androidUrl: string;
  fallbackUrl: string;
  isActive: boolean;
  clickCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  author: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  link: LinkItem;
  totalClicks: number;
  platformStats: { ios: number; android: number; desktop: number };
  timeSeries: { date: string; count: number }[];
  recentClicks: {
    timestamp: string;
    os: Platform;
    device?: 'mobile' | 'tablet' | 'desktop';
    ip: string;
    country: string;
    referrer: string;
  }[];
}

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
};

export type ChatMessageType = 'QUESTION' | 'AI_ANSWER';

export type ChatHistoryItem = {
  id: string;
  sessionId: string;
  content: string;
  type: ChatMessageType;
  createdAt: string;
};

export type ChatSessionStatus = {
  sessionId: string;
  status: 'pending' | 'done' | 'error';
  question: string;
  answer: string | null;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };
  if (auth) {
    const token = getToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: h,
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  apiUrl: API_URL,
  shortLinkUrl(alias: string) {
    return `${API_URL}/l/${alias}`;
  },

  loginWithEmail(email: string, password: string) {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  loginWithSecret(secret: string) {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ secret }),
    });
  },

  signup(email: string, password: string, name?: string) {
    return request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  me() {
    return request<{ success: boolean; data: AuthUser }>('/api/auth/me', { auth: true });
  },

  updateProfile(body: { name?: string; email?: string }) {
    return request<{ success: boolean; data: AuthUser }>('/api/auth/profile', {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(body),
    });
  },

  changePassword(currentPassword: string, newPassword: string) {
    return request<{ success: boolean; message: string }>('/api/auth/password', {
      method: 'PUT',
      auth: true,
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getLinks() {
    return request<{ success: boolean; data: LinkItem[] }>('/api/links', { auth: true });
  },

  getLink(id: string) {
    return request<{ success: boolean; data: LinkItem }>(`/api/links/${id}`, { auth: true });
  },

  createLink(body: Partial<LinkItem>) {
    return request<{ success: boolean; data: LinkItem }>('/api/links', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(body),
    });
  },

  updateLink(id: string, body: Partial<LinkItem>) {
    return request<{ success: boolean; data: LinkItem }>(`/api/links/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(body),
    });
  },

  deleteLink(id: string) {
    return request<{ success: boolean }>(`/api/links/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  getAnalytics(id: string, days = 30) {
    return request<{ success: boolean; data: AnalyticsData }>(
      `/api/links/${id}/analytics?days=${days}`,
      { auth: true }
    );
  },

  getPublishedPosts() {
    return request<{ success: boolean; data: BlogPost[] }>('/api/posts/public');
  },

  getPostBySlug(slug: string) {
    return request<{ success: boolean; data: BlogPost }>(`/api/posts/public/${slug}`);
  },

  getAdminPosts() {
    return request<{ success: boolean; data: BlogPost[] }>('/api/posts', { auth: true });
  },

  getAdminPost(id: string) {
    return request<{ success: boolean; data: BlogPost }>(`/api/posts/${id}`, { auth: true });
  },

  createPost(body: Partial<BlogPost>) {
    return request<{ success: boolean; data: BlogPost }>('/api/posts', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(body),
    });
  },

  updatePost(id: string, body: Partial<BlogPost>) {
    return request<{ success: boolean; data: BlogPost }>(`/api/posts/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(body),
    });
  },

  deletePost(id: string) {
    return request<{ success: boolean }>(`/api/posts/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  sendChatMessage(message: string, auth = false) {
    return request<{
      success: boolean;
      data: { sessionId: string; status: string; stored: boolean };
    }>('/api/chat/send', {
      method: 'POST',
      auth,
      body: JSON.stringify({ message }),
    });
  },

  getChatSession(sessionId: string) {
    return request<{ success: boolean; data: ChatSessionStatus }>(
      `/api/chat/session/${encodeURIComponent(sessionId)}`
    );
  },

  getChatHistory() {
    return request<{ success: boolean; data: ChatHistoryItem[] }>('/api/chat/history', {
      auth: true,
    });
  },
};
