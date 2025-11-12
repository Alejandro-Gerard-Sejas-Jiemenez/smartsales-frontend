import React from "react";

export default function Paginacion({
  page = 1,
  totalPages = 1,
  onPageChange,
  disabled = false,
  className = ""
}) {
  if (totalPages <= 1) return null;

  function goTo(p) {
    if (p >= 1 && p <= totalPages && p !== page && onPageChange) {
      onPageChange(p);
    }
  }

  return (
    <div className={`flex items-center gap-2 mt-4 ${className}`}>
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1 || disabled}
        className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm font-medium">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages || disabled}
        className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
