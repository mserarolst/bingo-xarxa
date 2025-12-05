export interface Pack {
  id: string;
  name: string;
  description: string;
  sponsor: string;
  imageUrl?: string;
  available: boolean;
  order: number;
  createdAt: Date;
}
