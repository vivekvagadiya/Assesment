import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '../icons';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize = 20,
  onPageChange,
  className,
}) => {
  // GitHub limits search to first 1000 items
  const maxSearchItems = Math.min(totalCount, 1000);
  const totalPages = Math.max(1, Math.ceil(maxSearchItems / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, maxSearchItems);

  return (
    <nav
      aria-label="Pagination"
      className={`${styles.pagination} ${className || ''}`}
    >
      <div className={styles.summary}>
        Showing <strong>{startItem.toLocaleString()}</strong>–
        <strong>{endItem.toLocaleString()}</strong> of{' '}
        <strong>{totalCount.toLocaleString()}</strong> results
        {totalCount > 1000 && ' (capped at 1,000)'}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        {getPageNumbers().map((item, idx) => {
          if (item === '...') {
            return (
              <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                &hellip;
              </span>
            );
          }

          const isCurrent = item === currentPage;
          return (
            <button
              key={item}
              type="button"
              className={`${styles.pageButton} ${isCurrent ? styles.active : ''}`}
              onClick={() => onPageChange(item)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Page ${item}`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
