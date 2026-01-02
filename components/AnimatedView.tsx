import { cn } from '@/lib/utils';

export function AnimatedView({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        active
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 translate-x-6 absolute pointer-events-none'
      )}>
      {children}
    </div>
  );
}
