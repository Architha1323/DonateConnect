// ─── Enums ────────────────────────────────────────────────────────────────────

export enum UserRole {
  DONOR = 'DONOR',
  NGO = 'NGO',
  BENEFICIARY = 'BENEFICIARY',
  ADMIN = 'ADMIN',
}

export enum DonationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  COLLECTED = 'COLLECTED',
  RECEIVED = 'RECEIVED',
  DISTRIBUTED = 'DISTRIBUTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ItemCategory {
  CLOTHES = 'CLOTHES',
  BOOKS = 'BOOKS',
  TOYS = 'TOYS',
  FURNITURE = 'FURNITURE',
  KITCHEN = 'KITCHEN',
  ELECTRONICS = 'ELECTRONICS',
  STATIONERY = 'STATIONERY',
  HOUSEHOLD = 'HOUSEHOLD',
  OTHER = 'OTHER',
}

export enum ItemCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  WORN = 'WORN',
}

export enum NgoVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  authId?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ngo?: { id: string; ngoName: string; verificationStatus: NgoVerificationStatus };
  beneficiary?: { id: string; isVerified: boolean; needCategory: ItemCategory[] };
}

export interface Ngo {
  id: string;
  userId: string;
  ngoName: string;
  registrationNumber: string;
  description?: string;
  website?: string;
  logo?: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  verificationStatus: NgoVerificationStatus;
  verifiedAt?: string;
  categories: ItemCategory[];
  capacity: number;
  currentLoad: number;
  createdAt: string;
  user: { id: string; name: string; email: string; phone?: string; avatar?: string };
  _count?: { acceptedDonations: number; beneficiaries: number };
}

export interface DonationItem {
  id: string;
  donationId: string;
  itemName: string;
  category: ItemCategory;
  quantity: number;
  condition: ItemCondition;
  description?: string;
  imageUrl?: string;
}

export interface PickupRequest {
  id: string;
  donationId: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  landmark?: string;
  scheduledDate: string;
  scheduledTime?: string;
  contactPhone: string;
  status: string;
  notes?: string;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus?: DonationStatus;
  toStatus: DonationStatus;
  notes?: string;
  changedBy?: string;
  changedAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  ngoId?: string;
  status: DonationStatus;
  notes?: string;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  items: DonationItem[];
  pickupRequest?: PickupRequest;
  donor: { id: string; name: string; email: string; avatar?: string; city?: string };
  ngo?: { id: string; ngoName: string; city?: string };
  statusHistory: StatusHistoryEntry[];
}

export interface DonorStats {
  totalDonations: number;
  activeDonations: number;
  completedDonations: number;
  cancelledDonations: number;
  totalItemsDonated: number;
}

export interface NgoStats {
  pendingDonations: number;
  acceptedDonations: number;
  completedDonations: number;
  totalBeneficiaries: number;
  totalItemsDistributed: number;
}

export interface AdminStats {
  totalUsers: number;
  totalNgos: number;
  totalDonations: number;
  pendingNgos: number;
  totalBeneficiaries: number;
  completedDonations: number;
  totalItemsDonated: number;
  donationsByStatus: { status: string; count: number }[];
  donationsByMonth: { month: string; count: number }[];
}

export interface Beneficiary {
  id: string;
  userId: string;
  ngoId?: string;
  needCategory: ItemCategory[];
  householdSize?: number;
  description?: string;
  isVerified: boolean;
  user: { id: string; name: string; email: string; phone?: string };
  ngo?: { id: string; ngoName: string };
  requests?: BeneficiaryRequest[];
  _count?: { requests: number };
}

export interface BeneficiaryRequest {
  id: string;
  beneficiaryId: string;
  category: ItemCategory;
  quantity: number;
  description?: string;
  status: string;
  fulfilledAt?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ComplaintItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  response?: string;
  createdAt: string;
}
