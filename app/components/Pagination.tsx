import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Calculate page range to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page, last page, and pages around current
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                startPage = 2;
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }

            pages.push(1);
            if (startPage > 2) pages.push('...');

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div
            className="pagination-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3rem',
                marginBottom: '2rem',
                width: '100%'
            }}
        >
            <nav
                role="navigation"
                aria-label="pagination"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: currentPage === 1 ? 'rgba(255,255,255,0.1)' : '#C5A265',
                        color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : '#C5A265',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentPage === 1 ? 'default' : 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    aria-label="Previous Page"
                >
                    <i className="ph ph-caret-left" style={{ fontSize: '18px' }}></i>
                </button>

                <ul style={{ display: 'flex', gap: '8px', margin: 0, padding: 0, listStyle: 'none', alignItems: 'center' }}>
                    {getPageNumbers().map((page, index) => (
                        <li key={index}>
                            {page === '...' ? (
                                <span style={{ color: '#aaa', padding: '0 5px' }}>&hellip;</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(Number(page))}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: String(page) === String(currentPage) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: String(page) === String(currentPage) ? '#C5A265' : 'transparent',
                                        color: String(page) === String(currentPage) ? '#fff' : '#aaa',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        fontWeight: 500
                                    }}
                                    onMouseEnter={(e) => {
                                        if (String(page) !== String(currentPage)) {
                                            e.currentTarget.style.borderColor = '#C5A265';
                                            e.currentTarget.style.color = '#C5A265';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (String(page) !== String(currentPage)) {
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.currentTarget.style.color = '#aaa';
                                        }
                                    }}
                                >
                                    {page}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : '#C5A265',
                        color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : '#C5A265',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentPage === totalPages ? 'default' : 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    aria-label="Next Page"
                >
                    <i className="ph ph-caret-right" style={{ fontSize: '18px' }}></i>
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
