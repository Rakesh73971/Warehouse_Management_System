import React from "react";

export default function Pagination({ page, count, pageSize, onPage }) {
  if (!count || count <= pageSize) return null;
  const total = Math.ceil(count / pageSize);
  if (total <= 1) return null;

  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 2 && i <= page + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="pagination">
      <button className="pg-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>←</button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={i} className="pg-ellipsis">…</span>
          : <button key={p} className={`pg-btn ${p === page ? "active" : ""}`} onClick={() => onPage(p)}>{p}</button>
      )}
      <button className="pg-btn" disabled={page === total} onClick={() => onPage(page + 1)}>→</button>
      <span className="pg-count">{(page-1)*pageSize+1}–{Math.min(page*pageSize, count)} of {count}</span>
    </div>
  );
}