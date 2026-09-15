export type PartnerStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface PublicProfile {
  id: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  website: string | null;
}

export interface PartnerRelationship {
  id: string;
  requesterId: string;
  recipientId: string;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
  otherProfile: PublicProfile | null;
}
