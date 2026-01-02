import { LucideIcon } from 'lucide-react';

export interface Order {
  id: string;
  product: string;
  date: string;
  price: string;
  status: 'Shipped' | 'Pending' | 'Cancel' | 'Processing';
  color: string;
}

export interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  Icon: LucideIcon;
  iconColor: string;
  //   color: string;
  //   trend: string;
  //   bg: string;
}

export interface SaleItemProps {
  label: string;
  amount: string;
  percent: string;
  color: string;
}

export interface ProgressItemProps {
  label: string;
  value: string;
  percent: number;
  progress: number;
  color: string;
}

export interface NotificationCardProps {
  Icon: LucideIcon;
  iconColor: string;
  title: string;
  linkText: string;
}
