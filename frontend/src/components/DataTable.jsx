import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Inbox } from 'lucide-react';

/**
 * Reusable DataTable Component
 * Supports search, column sorting, pagination, empty state, and custom cell renders.
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  pageSize = 10,
  emptyMessage = 'No records found matching your criteria.'
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter Data
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();

    return data.filter((item) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = item[k];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
        });
      }
      // Default: inspect all column keys
      return columns.some((col) => {
        const val = item[col.key];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, search, searchKeys, columns]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="card-modern">
      {/* Top Search Controls */}
      <div className="p-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div className="position-relative" style={{ minWidth: '240px', maxWidth: '360px' }}>
          <Search
            size={16}
            className="position-absolute top-50 translate-middle-y text-muted"
            style={{ left: '12px' }}
          />
          <input
            type="text"
            className="form-control form-control-sm ps-5"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              paddingLeft: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-color, #e2e8f0)',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <div className="text-muted fs-7">
          Showing <strong>{sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
          <strong>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of <strong>{sortedData.length}</strong>{' '}
          entries
        </div>
      </div>

      {/* Table Content */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{ minWidth: '600px' }}>
          <thead style={{ backgroundColor: 'var(--bg-canvas, #f8fafc)', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748b',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                >
                  <div className="d-flex align-items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown size={13} className="text-muted opacity-75" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <div className="spinner-border text-primary spinner-border-sm me-2" role="status" />
                  <span className="text-muted fs-7">Loading records from database...</span>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                    <Inbox size={40} className="mb-2 opacity-50" />
                    <p className="mb-0 fw-medium fs-6">{emptyMessage}</p>
                    {search && (
                      <button
                        className="btn btn-sm btn-link text-decoration-none mt-1"
                        onClick={() => setSearch('')}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={row._id || row.id || idx}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: '14px 16px', fontSize: '0.875rem' }}>
                      {col.render ? col.render(row[col.key], row, idx) : row[col.key] || '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-top d-flex justify-content-between align-items-center">
          <span className="text-muted fs-7">
            Page {currentPage} of {totalPages}
          </span>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
