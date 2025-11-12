import { useState } from "react";
import { useCarrito } from "../pages/ecommerce/CarritoContext";
import Carrito from "../pages/ecommerce/Carrito";
import { ErrorBoundary } from "./routing/ErrorBoundary";
import { FaShoppingCart } from "react-icons/fa";

export default function CarritoFloatingButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CarritoButton onClick={() => setOpen(true)} />
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end items-end" style={{background:'rgba(0,0,0,0.15)'}} onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-white h-[90vh] shadow-xl p-4 overflow-y-auto rounded-t-2xl border-t border-gray-200 mr-4 mb-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Carrito</h2>
              <button onClick={() => setOpen(false)} className="text-2xl font-bold">&times;</button>
            </div>
            <ErrorBoundary>
              <Carrito onCheckout={() => setOpen(false)} />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </>
  );
}

function CarritoButton({ onClick }) {
  const { state } = useCarrito();
  const cantidad = state.items.reduce((sum, i) => sum + i.cantidad, 0);
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-blue-700 transition"
      aria-label="Ver carrito"
    >
      <FaShoppingCart className="text-2xl" />
      {cantidad > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
          {cantidad}
        </span>
      )}
    </button>
  );
}