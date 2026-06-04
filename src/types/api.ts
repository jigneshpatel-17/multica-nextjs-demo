export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TASK_STATUSES = ["Pending", "In Progress", "Completed"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskSort = "latest" | "oldest" | "dueDate" | "priority";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TaskListResponse {
  tasks: PublicTask[];
  pagination: Pagination;
}

export interface TaskListQuery {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  dueBefore?: string;
  q?: string;
  sort?: TaskSort;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface CompletionTrendPoint {
  date: string;
  count: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentActivity: PublicTask[];
  completionTrend: CompletionTrendPoint[];
}

export interface ApiErrorBody {
  error: string;
  fields?: Record<string, string>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: string | null;
  dueDate?: string | null;
}

export type TaskUpdatePayload = Partial<TaskCreatePayload>;

export interface ProfileUpdatePayload {
  name?: string;
  profileImage?: string | null;
  currentPassword?: string;
  newPassword?: string;
}
