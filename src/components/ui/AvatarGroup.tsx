import { cn } from '@/lib/cn';
import { Avatar } from './Avatar';

interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    name?: string | null;
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'ring-2 ring-white rounded-full',
            size === 'xs' && 'relative z-30',
            size === 'sm' && 'relative z-20',
            size === 'md' && 'relative z-10',
          )}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'ring-2 ring-white rounded-full bg-canvas flex items-center justify-center font-medium text-muted',
            size === 'xs' && 'w-7 h-7 text-[10px] z-0',
            size === 'sm' && 'w-8 h-8 text-xs z-0',
            size === 'md' && 'w-9 h-9 text-sm z-0',
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
