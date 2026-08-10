import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange, totalElements, size, label = "records" }) {
    if (totalPages <= 0) return null;

    const from = totalElements === 0 ? 0 : page * size + 1;
    const to = Math.min((page + 1) * size, totalElements);

    return (
        <div className="pagination-bar">
            <span className="pagination-info">
                Showing <strong>{from}–{to}</strong> of <strong>{totalElements.toLocaleString()}</strong> {label}
            </span>
            
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        className="pagination-text-btn"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 0}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    
                    <span className="pagination-pages">
                        Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
                    </span>
                    
                    <button
                        className="pagination-text-btn"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages - 1}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
