import { useState } from "react";
import { useCarrito } from "./CarritoContext";
import { api } from "../../services/apiClient";

export default function CheckoutForm({ onFinish }) {
  const { state } = useCarrito();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    direccion: "",
    telefono: ""
  });
  const [touched, setTouched] = useState({});
  const [enviado, setEnviado] = useState(false);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ nombre: true, correo: true, direccion: true, telefono: true });
    if (!form.nombre || !form.correo || !form.direccion || !form.telefono) return;

    try {
      // 1. Crear el cliente si es necesario (aquí solo simulado, normalmente deberías buscarlo o crearlo)
      // 2. Crear el carrito
      const total = state.items.reduce((sum, i) => sum + i.producto.precio_venta * i.cantidad, 0);
      // Aquí deberías obtener el id del cliente real, pero para demo lo dejamos en null
      const carrito = await api.post("/api/carritos/", {
        // cliente: cliente_id, // Si tienes el id del cliente logueado
        total: total
      });

      // 3. Crear los detalles del carrito
      for (const item of state.items) {
        await api.post("/api/detallecarritos/", {
          carrito: carrito.id,
          producto: item.producto.id,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio_venta,
          subtotal: item.producto.precio_venta * item.cantidad
        });
      }

      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
        onFinish();
      }, 2000);
    } catch (err) {
      alert("Error al procesar el pedido: " + err.message);
    }
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    correo: touched.correo && !form.correo,
    direccion: touched.direccion && !form.direccion,
    telefono: touched.telefono && !form.telefono
  };

  if (enviado) {
    return <div className="p-6 text-center text-green-600 font-bold">¡Pedido realizado con éxito!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Datos para la compra</h2>
      <Field label="Nombre *" error={invalid.nombre && "Requerido"}>
        <input value={form.nombre} onChange={e => setField("nombre", e.target.value)} onBlur={() => setTouched(t => ({ ...t, nombre: true }))} className={`input-base ${invalid.nombre ? "input-error" : ""}`} required />
      </Field>
      <Field label="Correo *" error={invalid.correo && "Requerido"}>
        <input type="email" value={form.correo} onChange={e => setField("correo", e.target.value)} onBlur={() => setTouched(t => ({ ...t, correo: true }))} className={`input-base ${invalid.correo ? "input-error" : ""}`} required />
      </Field>
      <Field label="Dirección *" error={invalid.direccion && "Requerido"}>
        <input value={form.direccion} onChange={e => setField("direccion", e.target.value)} onBlur={() => setTouched(t => ({ ...t, direccion: true }))} className={`input-base ${invalid.direccion ? "input-error" : ""}`} required />
      </Field>
      <Field label="Teléfono *" error={invalid.telefono && "Requerido"}>
        <input value={form.telefono} onChange={e => setField("telefono", e.target.value)} onBlur={() => setTouched(t => ({ ...t, telefono: true }))} className={`input-base ${invalid.telefono ? "input-error" : ""}`} required />
      </Field>
      <button type="submit" className="py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition mt-2">Finalizar Pedido</button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-gray-600">{label}</label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
