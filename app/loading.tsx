export default function Loading() {
    return (
        <div className="w-full">
            {/* Hero Skeleton - Full height to push footer down */}
            <div
                style={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: '#0D1625',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                <div style={{ textAlign: 'center', width: '100%', padding: '0 20px' }}>
                    {/* Title Skeleton */}
                    <div
                        className="skeleton-pulse"
                        style={{
                            height: '60px',
                            maxWidth: '600px',
                            margin: '0 auto 20px',
                            backgroundColor: '#1a2b42',
                            borderRadius: '8px'
                        }}
                    />
                    {/* Subtitle Skeleton */}
                    <div
                        className="skeleton-pulse"
                        style={{
                            height: '30px',
                            maxWidth: '400px',
                            margin: '0 auto',
                            backgroundColor: '#1a2b42',
                            borderRadius: '8px'
                        }}
                    />
                </div>
            </div>

            {/* Featured Properties Skeleton */}
            <div style={{ padding: '80px 20px', backgroundColor: '#f5f5f5' }}>
                <div
                    className="skeleton-pulse"
                    style={{
                        height: '40px',
                        width: '200px',
                        margin: '0 auto 40px',
                        backgroundColor: '#ddd',
                        borderRadius: '4px'
                    }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ height: '400px', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="skeleton-pulse" style={{ height: '250px', backgroundColor: '#ddd' }} />
                            <div style={{ padding: '20px' }}>
                                <div className="skeleton-pulse" style={{ height: '20px', width: '80%', marginBottom: '10px', backgroundColor: '#eee' }} />
                                <div className="skeleton-pulse" style={{ height: '20px', width: '60%', backgroundColor: '#eee' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .skeleton-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
        </div>
    );
}
