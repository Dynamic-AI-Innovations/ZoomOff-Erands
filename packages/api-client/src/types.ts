// ─── Shared API response wrappers ────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  cursor?: string;
  nextCursor?: string | null;
}

// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole =
  | "customer"
  | "business_user"
  | "runner"
  | "business_admin"
  | "zo_admin"
  | "zo_super_admin";

export type UserStatus = "active" | "suspended" | "deleted";

export interface User {
  id: string;
  phone: string;
  email: string | null;
  name: string;
  role: UserRole;
  status: UserStatus;
  profilePhotoUrl: string | null;
  createdAt: string;
  lastLogin: string | null;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requiresMfa: boolean;
}

export interface RegisterResponse {
  userId: string;
  requiresPhoneVerification: boolean;
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export type TaskStatus =
  | "posted"
  | "assigned"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export type TaskCategory =
  | "grocery_shopping"
  | "document_pickup_delivery"
  | "pharmacy_run"
  | "bill_payment"
  | "banking_errand"
  | "queue_standing"
  | "parcel_delivery"
  | "administrative_errand"
  | "home_errand"
  | "other";

export type ScheduleType = "instant" | "today" | "scheduled";

export interface TaskWaypoint {
  id: string;
  sequence: number;
  address: string;
  lat: number;
  lng: number;
  status: "pending" | "reached";
}

export interface TaskRunner {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number;
  tier: RunnerTier;
  phone: string;
}

export interface Task {
  id: string;
  customerId: string;
  orgId: string | null;
  runner: TaskRunner | null;
  category: TaskCategory;
  status: TaskStatus;
  description: string;
  specialInstructions: string | null;
  isUrgent: boolean;
  pickup: { address: string; lat: number; lng: number };
  destination: { address: string; lat: number; lng: number };
  waypoints: TaskWaypoint[];
  scheduleType: ScheduleType;
  scheduledAt: string | null;
  price: number;
  priceBreakdown: PriceBreakdown;
  escrowStatus: "held" | "released" | "refunded";
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface PriceBreakdown {
  baseRate: number;
  distanceFee: number;
  complexityFee: number;
  surgePremium: number;
  total: number;
  hasSurge: boolean;
}

// ─── Runner ──────────────────────────────────────────────────────────────────

export type RunnerTier = "standard" | "verified" | "elite";
export type KycStatus = "pending" | "in_review" | "approved" | "rejected" | "suspended";

export interface RunnerProfile {
  userId: string;
  kycStatus: KycStatus;
  tier: RunnerTier;
  rating: number;
  completionRate: number;
  acceptanceRate: number;
  onTimeRate: number;
  disputeRate: number;
  categories: TaskCategory[];
  isOnline: boolean;
  totalTasksCompleted: number;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export type PaymentMethod = "card" | "wallet" | "bank_transfer";
export type PaymentStatus = "pending" | "successful" | "failed" | "refunded";

export interface Payment {
  id: string;
  taskId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  escrowStatus: "held" | "released" | "refunded";
  pspRef: string | null;
  createdAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  pendingBalance: number;
  currency: "NGN";
  lastUpdated: string;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType =
  | "task_update"
  | "payment"
  | "dispute"
  | "system"
  | "marketing";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}

// ─── Business ────────────────────────────────────────────────────────────────

export type OrgRole = "admin" | "manager" | "staff" | "view_only";
export type OrgStatus = "active" | "suspended" | "pending_verification";

export interface Organisation {
  id: string;
  name: string;
  rcNumber: string;
  status: OrgStatus;
  plan: "starter" | "growth" | "enterprise";
  adminUserId: string;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: OrgRole;
  department: string | null;
  joinedAt: string;
}
