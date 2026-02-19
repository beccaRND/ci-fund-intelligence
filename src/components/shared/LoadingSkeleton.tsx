export default function LoadingSkeleton({ height = 'h-48', label }: { height?: string; label?: string }) {
  return (
    <div className={`${height} skeleton rounded-[var(--radius-sm)] flex items-center justify-center`}>
      {label && <span className="text-ci-gray-500 text-xs">{label}</span>}
    </div>
  );
}
