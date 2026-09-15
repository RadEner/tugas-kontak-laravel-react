const COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-rose-500',
  'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-blue-500',
];

export default function Avatar({ name, size = 'md' }) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  const colorIndex = name?.charCodeAt(0) % COLORS.length || 0;
  const colorClass = COLORS[colorIndex];

  const sizeClass = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  }[size];

  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0`}>
      {initial}
    </div>
  );
}