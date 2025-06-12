// shared/ui/SkeletonBox.tsx
export function SkeletonBox({
  width,
  height
}: {
  width: string;
  height: string;
}) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#eee',
        borderRadius: '4px',
        animation: 'pulse 1.5s infinite ease-in-out'
      }}
    />
  );
}
