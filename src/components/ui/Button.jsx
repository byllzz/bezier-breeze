export function Button({ variant = 'default', size = 'default', className = '', ...props }) {
  const base =
    'rounded-lg font-medium cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-stone-900 text-white hover:bg-stone-800',
    ghost: 'bg-transparent hover:bg-stone-100 text-stone-600',
    outline: 'border border-stone-200 bg-white hover:bg-stone-50 text-stone-700',
  };
  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    icon: 'w-8 h-8 p-0',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
