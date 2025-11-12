import { useEffect, useState } from "react";
import { useCarrito } from "./CarritoContext";
import { api } from "../../services/apiClient";
import ProductoCard from "../../components/ProductoCard";

export default function ProductosTienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useCarrito();

  useEffect(() => {
    setLoading(true);
    api.get("/api/productos/")
      .then((res) => setProductos(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, []);



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {productos.map((p) => (
        <ProductoCard key={p.id} producto={p} />
      ))}
      {loading && <div className="col-span-full text-center">Cargando productos...</div>}
    </div>
  );
}
