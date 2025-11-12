import { useCarrito } from '../../pages/ecommerce/CarritoContext';
import { FaShoppingCart } from 'react-icons/fa';

export default function CarritoIcon({ onClick }) {
  const { state } = useCarrito();
  const cantidad = state.items.reduce((sum, i) => sum + i.cantidad, 0);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center p-2 rounded hover:bg-blue-50 transition"
      aria-label="Ver carrito"
    >
      <FaShoppingCart className="text-2xl text-blue-600" />
      {cantidad > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
          {cantidad}
        </span>
      )}
    </button>
  );
}
