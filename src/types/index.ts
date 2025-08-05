export interface Court {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  review?: string;
  imageUrl?: string;
  isIndoor: boolean;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  courtId: string;
  userId: string;
  voteType: "approve" | "reject";
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CourtFormData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  review?: string;
  imageUrl?: string;
  isIndoor: boolean;
}
