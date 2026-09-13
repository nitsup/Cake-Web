export interface Profile {
  id: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  bio: string | null;
  website: string | null;
  role: string | null;
  extendedFieldsAvailable: boolean;
  avatarPath: string | null;
  avatarUrl: string | null;
}
