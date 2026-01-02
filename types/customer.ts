export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  spent: number;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
}
