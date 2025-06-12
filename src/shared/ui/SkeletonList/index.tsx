export const SkeletonList = () => (
  <>
    {[1, 2, 3].map(i => (
      <div key={i} style={{ marginBottom: '32px' }}>
        <div
          style={{
            height: '24px',
            backgroundColor: '#f0f0f0',
            width: '100px',
            marginBottom: '12px'
          }}
        />
        <div
          style={{
            height: '20px',
            backgroundColor: '#f0f0f0',
            width: '60%',
            marginBottom: '6px'
          }}
        />
        <div
          style={{ height: '20px', backgroundColor: '#f0f0f0', width: '40%' }}
        />
      </div>
    ))}
  </>
);
