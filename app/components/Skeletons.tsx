export function HeroSkeleton() {
    return (
        <div className="at-hero" style={{ backgroundColor: '#0D1625', position: 'relative' }}>
            <div className="hero-content">
                <div className="hero-header">
                    <div className="hsub-container">
                        <div 
                            className="skeleton-pulse" 
                            style={{ 
                                height: '24px', 
                                width: '280px', 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                borderRadius: '4px',
                                margin: '0 auto'
                            }} 
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div 
                            className="skeleton-pulse" 
                            style={{ 
                                height: '80px', 
                                maxWidth: '500px', 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                borderRadius: '8px',
                                margin: '0 auto 20px'
                            }} 
                        />
                        <div 
                            className="skeleton-pulse" 
                            style={{ 
                                height: '50px', 
                                maxWidth: '400px', 
                                backgroundColor: 'rgba(255,255,255,0.08)', 
                                borderRadius: '6px',
                                margin: '0 auto'
                            }} 
                        />
                    </div>
                    <div className="hero-subtxt-width" style={{ marginTop: '30px' }}>
                        <div 
                            className="skeleton-pulse" 
                            style={{ 
                                height: '50px', 
                                maxWidth: '500px', 
                                backgroundColor: 'rgba(255,255,255,0.06)', 
                                borderRadius: '4px',
                                margin: '0 auto'
                            }} 
                        />
                    </div>
                </div>
                {/* Search Bar Skeleton */}
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                    <div 
                        className="skeleton-pulse" 
                        style={{ 
                            height: '70px', 
                            width: '100%',
                            maxWidth: '900px', 
                            backgroundColor: 'rgba(255,255,255,0.08)', 
                            borderRadius: '12px'
                        }} 
                    />
                </div>
            </div>
        </div>
    );
}

export function FeaturedSkeleton() {
    return (
        <div className="at-featured" id="listings-anchor">
            <div className="atf-header">
                <div className="atfh-shc">
                    <div 
                        className="skeleton-pulse" 
                        style={{ 
                            height: '20px', 
                            width: '150px', 
                            backgroundColor: '#e0e0e0', 
                            borderRadius: '4px',
                            margin: '0 auto'
                        }} 
                    />
                </div>
                <div 
                    className="skeleton-pulse" 
                    style={{ 
                        height: '40px', 
                        width: '300px', 
                        backgroundColor: '#ddd', 
                        borderRadius: '6px',
                        margin: '20px auto'
                    }} 
                />
                <div className="atfh-hl"></div>
                <div 
                    className="skeleton-pulse" 
                    style={{ 
                        height: '60px', 
                        maxWidth: '600px', 
                        backgroundColor: '#eee', 
                        borderRadius: '4px',
                        margin: '20px auto'
                    }} 
                />
            </div>
            {/* Property Cards Skeleton */}
            <div style={{ 
                display: 'flex', 
                gap: '24px', 
                padding: '0 40px', 
                overflow: 'hidden',
                justifyContent: 'center'
            }}>
                {[1, 2, 3, 4].map((i) => (
                    <div 
                        key={i} 
                        style={{ 
                            minWidth: '300px',
                            height: '420px', 
                            backgroundColor: '#fff', 
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            overflow: 'hidden'
                        }}
                    >
                        <div 
                            className="skeleton-pulse" 
                            style={{ height: '220px', backgroundColor: '#e8e8e8' }} 
                        />
                        <div style={{ padding: '20px' }}>
                            <div 
                                className="skeleton-pulse" 
                                style={{ 
                                    height: '24px', 
                                    width: '70%', 
                                    marginBottom: '12px', 
                                    backgroundColor: '#eee',
                                    borderRadius: '4px'
                                }} 
                            />
                            <div 
                                className="skeleton-pulse" 
                                style={{ 
                                    height: '20px', 
                                    width: '50%', 
                                    marginBottom: '16px', 
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '4px'
                                }} 
                            />
                            <div 
                                className="skeleton-pulse" 
                                style={{ 
                                    height: '32px', 
                                    width: '60%', 
                                    backgroundColor: '#e8e8e8',
                                    borderRadius: '4px'
                                }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ServicesSkeleton() {
    return (
        <div className="at-services" id="about-us-anchor">
            <div className="fixed-grid has-6-cols">
                <div style={{ padding: '60px 40px' }}>
                    <div 
                        className="skeleton-pulse" 
                        style={{ 
                            height: '30px', 
                            width: '200px', 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            borderRadius: '4px',
                            marginBottom: '20px'
                        }} 
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[1, 2, 3].map((i) => (
                            <div 
                                key={i}
                                className="skeleton-pulse" 
                                style={{ 
                                    height: '100px', 
                                    backgroundColor: 'rgba(255,255,255,0.08)', 
                                    borderRadius: '8px'
                                }} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

