// components/products/ProductStatus.tsx
import { cn } from '@/lib/utils';

export default function ProductStatus({
  status,
}: {
  status: 'active' | 'draft' | 'deactive';
}) {
  const styles = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    deactive: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium',
        styles[status]
      )}>
      {status}
    </span>
  );
}
