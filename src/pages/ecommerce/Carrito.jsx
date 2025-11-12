import { useCarrito } from "./CarritoContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { getToken } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Carrito({ onCheckout }) {
  const { state, dispatch } = useCarrito();
  const total = state.items.reduce((sum, i) => sum + i.producto.precio_venta * i.cantidad, 0);
  const navigate = useNavigate();
  const location = useLocation();
  function handleCheckout() {
    if (!getToken()) {
      alert("Para realizar una compra debes iniciar sesión como cliente. Por favor ingresa con tu cuenta o regístrate.");
      navigate("/login", { state: { from: "/carrito" } });
      return;
    }
    if (onCheckout) onCheckout();
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaShoppingCart className="text-blue-600 text-2xl" /> Carrito de Compras
        </h2>
        <span className="text-gray-500 text-sm">{state.items.length} producto{state.items.length !== 1 ? 's' : ''}</span>
      </div>
      {state.items.length === 0 ? (
        <div className="text-gray-500">El carrito está vacío.</div>
      ) : (
        <div className="flex flex-col gap-4 mb-4">
          {state.items.map(({ producto, cantidad }) => (
            <div key={producto.id} className="flex items-center bg-white rounded-lg shadow-sm p-3 gap-4">
              <img src={producto.imagen_url ? producto.imagen_url : undefined} alt={producto.nombre} className="w-16 h-16 object-cover rounded-md" onError={e => {e.target.src = 'https://via.placeholder.com/64'}} />
              <div className="flex-1">
                <div className="font-semibold text-base">{producto.nombre}</div>
                <div className="text-blue-600 text-sm font-bold">Bs. {(Number(producto.precio_venta)).toFixed(2)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-base font-bold"
                    onClick={() => dispatch({ type: "AGREGAR", producto, cantidad: -1 })}
                    disabled={cantidad <= 1}
                  >-</button>
                  <span className="px-3 text-lg font-semibold">{cantidad}</span>
                  <button
                    className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-base font-bold"
                    onClick={() => dispatch({ type: "AGREGAR", producto, cantidad: 1 })}
                    disabled={cantidad >= producto.stock_actual}
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-base font-bold">Bs. {(Number(producto.precio_venta) * cantidad).toFixed(2)}</div>
                <button
                  className="text-red-500 hover:bg-red-100 rounded-full p-2"
                  onClick={() => dispatch({ type: "QUITAR", id: producto.id })}
                  title="Quitar"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
  <div className="flex justify-between items-center font-semibold text-lg" style={{borderTop:'1px solid #e5e7eb', paddingTop: '1rem'}}>
        <span>Total:</span>
  <span className="text-blue-600 font-bold">Bs. {(Number(total)).toFixed(2)}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          disabled={state.items.length === 0}
          onClick={handleCheckout}
        >
          Finalizar Compra
        </button>
        <button
          className="py-2 px-4 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
          onClick={() => dispatch({ type: "VACIAR" })}
          disabled={state.items.length === 0}
        >
          Vaciar
        </button>
      </div>
    </div>
  );
}
