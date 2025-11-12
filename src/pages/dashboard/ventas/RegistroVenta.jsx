
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { getClientes } from "../../../services/cliente.service.js";
import { getProductos } from "../../../services/catalogo.service.js";
import { createVenta } from "../../../services/venta.service.js";
import { FaTrash } from 'react-icons/fa';


export default function RegistroVentaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado para los catálogos
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estado del formulario de Venta
  const [clienteId, setClienteId] = useState("");
  const [metodoEntrada, setMetodoEntrada] = useState("Mostrador");
  const [items, setItems] = useState([]); // El "carrito" de esta venta

  // Estado para el selector de producto
  const [selectedProd, setSelectedProd] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [addError, setAddError] = useState("");

  // Carga inicial de Clientes y Productos
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getClientes(),
      getProductos()
    ])
    .then(([cliData, prodData]) => {
      setClientes(Array.isArray(cliData) ? cliData : []);
      // Filtramos solo productos disponibles
      setProductos(Array.isArray(prodData) ? prodData.filter(p => p.estado === 'Disponible') : []);
    })
    .catch(e => setError("Error al cargar clientes o productos: " + e.message))
    .finally(() => setLoading(false));
  }, []);

  // Lógica para añadir un item
  const handleAddItem = () => {
    setAddError("");
    if (!selectedProd || selectedQty <= 0) {
      setAddError("Seleccione un producto y cantidad válida.");
      return;
    }

    const producto = productos.find(p => p.id === parseInt(selectedProd));
    if (!producto) {
      setAddError("Producto no encontrado.");
      return;
    }
    
    // Validar stock
    if (producto.stock_actual < selectedQty) {
      setAddError(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock_actual}`);
      return;
    }
    
    // Validar si ya está en la lista
    const itemExistente = items.find(i => i.producto.id === producto.id);
    if (itemExistente) {
      // Actualizar cantidad (validando stock total)
      const nuevaCantidad = itemExistente.cantidad + selectedQty;
      if (producto.stock_actual < nuevaCantidad) {
        setAddError(`Stock insuficiente. Ya tiene ${itemExistente.cantidad} en el carrito. Disponible: ${producto.stock_actual}`);
        return;
      }
      setItems(items.map(i => 
        i.producto.id === producto.id ? { ...i, cantidad: nuevaCantidad, subtotal: producto.precio_venta * nuevaCantidad } : i
      ));
    } else {
      // Añadir nuevo item
      setItems([
        ...items,
        {
          producto: producto,
          cantidad: selectedQty,
          precio_unitario: producto.precio_venta,
          subtotal: producto.precio_venta * selectedQty
        }
      ]);
    }
    
    // Resetear selector
    setSelectedProd("");
    setSelectedQty(1);
  };

  // Lógica para quitar un item
  const handleRemoveItem = (productoId) => {
    setItems(items.filter(i => i.producto.id !== productoId));
  };

  // Calcular total
  const totalVenta = items.reduce((total, item) => total + parseFloat(item.subtotal), 0);

  // Lógica de Envío
  const handleSubmitVenta = async (e) => {
    e.preventDefault();
    setError("");

    if (!clienteId || items.length === 0) {
      setError("Debe seleccionar un cliente y añadir al menos un producto.");
      return;
    }

    setLoading(true);

    const payload = {
      cliente: parseInt(clienteId),
      metodo_entrada: metodoEntrada,
      tipo_venta: "Contado",
      detalles: items.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    try {
      await createVenta(payload);
      // ¡Éxito!
      toast.success("Venta registrada exitosamente!");
      // Resetear formulario
      setItems([]);
      setClienteId("");
      setMetodoEntrada("Mostrador");
      // (Opcional: recargar productos para ver stock actualizado)
    } catch (e) {
      const errorMsg = e.message || "Error al crear la Venta";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmitVenta}
        className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        
        {/* --- Cabecera y Botón de Guardar --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Registrar Venta
          </h2>
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow disabled:opacity-60"
          >
            {loading ? "Registrando..." : `Registrar Venta (Total: ${totalVenta.toFixed(2)} Bs)`}
          </button>
        </div>

        {/* --- Sección 1: Cliente y Método --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Cliente *"
            children={
              <select
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
                disabled={loading}
                required
                className="input-base"
              >
                <option value="">Seleccione un cliente...</option>
                {clientes.map(cli => (
                  <option key={cli.cliente_id} value={cli.cliente_id}>
                    {cli.nombre} {cli.apellido} ({cli.correo})
                  </option>
                ))}
              </select>
            }
          />
          <Field
            label="Método de Venta *"
            children={
              <select
                value={metodoEntrada}
                onChange={e => setMetodoEntrada(e.target.value)}
                disabled={loading}
                required
                className="input-base"
              >
                <option value="Mostrador">Mostrador (Efectivo)</option>
                <option value="Telefono">Teléfono</option>
              </select>
            }
          />
        </div>
        
        <hr />

        {/* --- Sección 2: Añadir Productos --- */}
        <h3 className="text-lg font-semibold text-gray-700 -mb-4">Añadir Productos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <Field
              label="Producto"
              children={
                <select
                  value={selectedProd}
                  onChange={e => setSelectedProd(e.target.value)}
                  disabled={loading}
                  className="input-base"
                >
                  <option value="">Seleccione un producto...</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Stock: {p.stock_actual}, Precio: {p.precio_venta} Bs)
                    </option>
                  ))}
                </select>
              }
            />
          </div>
          <Field
            label="Cantidad"
            children={
              <input
                type="number"
                value={selectedQty}
                onChange={e => setSelectedQty(parseInt(e.target.value) || 1)}
                disabled={loading}
                className="input-base"
                min="1"
              />
            }
          />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          disabled={loading || !selectedProd}
          className="w-full px-6 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition shadow disabled:opacity-60"
        >
          Añadir Producto a la Venta
        </button>
        {addError && <span className="text-sm text-red-500 text-center -mt-4">{addError}</span>}

        <hr />
        
        {/* --- Sección 3: Items de la Venta --- */}
        <h3 className="text-lg font-semibold text-gray-700 -mb-4">Items en la Venta</h3>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b">
                <th className="text-left text-sm font-medium text-gray-500 p-2">Producto</th>
                <th className="text-left text-sm font-medium text-gray-500 p-2">Precio</th>
                <th className="text-left text-sm font-medium text-gray-500 p-2">Cant.</th>
                <th className="text-left text-sm font-medium text-gray-500 p-2">Subtotal</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-6">
                    Aún no hay productos en la venta.
                  </td>
                </tr>
              )}
              {items.map(item => (
                <tr key={item.producto.id} className="border-b">
                  <td className="p-2 font-medium">{item.producto.nombre}</td>
                  <td className="p-2">{parseFloat(item.precio_unitario).toFixed(2)} Bs</td>
                  <td className="p-2">{item.cantidad}</td>
                  <td className="p-2 font-semibold">{parseFloat(item.subtotal).toFixed(2)} Bs</td>
                  <td className="p-2">
                    <button type="button" onClick={() => handleRemoveItem(item.producto.id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td colSpan="3" className="text-right p-2 font-bold text-lg">Total:</td>
                <td className="p-2 font-bold text-lg">{totalVenta.toFixed(2)} Bs</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* --- Error General --- */}
        {error && (
          <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-gray-600">
        {label}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}