import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  it('returns null if total pages is <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalCount={15} pageSize={20} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders pagination controls and triggers onPageChange', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={1}
        totalCount={60}
        pageSize={20}
        onPageChange={handlePageChange}
      />
    );

    // Current page is 1
    const page1Btn = screen.getByRole('button', { name: 'Page 1' });
    expect(page1Btn).toHaveAttribute('aria-current', 'page');

    // Click next page
    const nextBtn = screen.getByRole('button', { name: /next page/i });
    await user.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);

    // Click page 3
    const page3Btn = screen.getByRole('button', { name: 'Page 3' });
    await user.click(page3Btn);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});
