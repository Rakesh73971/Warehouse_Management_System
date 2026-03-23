import React from "react";


export default function Pagination({ page, count, pageSize, onPage }) {
  if (!count || count <= pageSize) return null;

  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  
  const getPages = () => {
    const pages = [];
    const delta = 2; 

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..."
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      {/* Prev */}
      <button
        type="button"
        className="pg-btn pg-arrow"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        ←
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="pg-ellipsis">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pg-btn ${p === page ? "pg-active" : ""}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        className="pg-btn pg-arrow"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
      >
        →
      </button>

      {/* Count label */}
      <span className="pg-label">
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, count)} of {count}
      </span>
    </div>
  );
}