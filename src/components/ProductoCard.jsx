import React from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../pages/ecommerce/CarritoContext";

export default function ProductoCard({ producto }) {
  const { dispatch } = useCarrito ? useCarrito() : { dispatch: () => {} };

  function agregarAlCarrito() {
    if (producto.stock_actual > 0) {
      dispatch({ type: "AGREGAR", producto, cantidad: 1 });
    }
  }

  return (
    <article style={{background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'0 10px 30px rgba(15,23,42,0.05)'}}>
      <div style={{position:'relative'}}>
        <div style={{height:240, display:'flex', alignItems:'center', justifyContent:'center', background:'#fff'}}>
          <img src={producto.imagen_url || ''} alt={producto.nombre} style={{maxWidth:'100%', maxHeight:'100%', objectFit:'contain', background:'#fff'}} onError={e => {e.target.src = ''}} />
        </div>
      </div>
      <div style={{padding:14}}>
        <h3 style={{margin:0, fontSize:16, fontWeight:700}}>{producto.nombre}</h3>
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>

          <span
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: 13,
              background: producto.stock_actual > 0 ? '#22c55e1a' : '#ef44441a',
              color: producto.stock_actual > 0 ? '#22c55e' : '#ef4444',
              marginLeft: 4
            }}
          >
            {producto.stock_actual > 0 ? 'Stock' : 'No hay stock'}
          </span>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12}}>
          <div>
            <div style={{fontSize:20, fontWeight:800, color:'#0A84FF'}}>Bs. {(Number(producto.precio_venta)).toFixed(2)}</div>
            <div style={{color:'#0A84FF', fontSize:14, marginTop:4}}>
              Garantía: {producto.ano_garantia ? `${producto.ano_garantia} año(s)` : 'Sin garantía'}
            </div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button
              style={{background:'#0A84FF', color:'#fff', border:'none', padding:'10px 14px', borderRadius:8, cursor: producto.stock_actual > 0 ? 'pointer' : 'not-allowed', opacity: producto.stock_actual > 0 ? 1 : 0.5}}
              onClick={agregarAlCarrito}
              disabled={producto.stock_actual <= 0}
            >
              Agregar
            </button>
            <Link to="#" style={{display:'inline-block', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(15,23,42,0.06)', textDecoration:'none', color:'#0f172a'}}>Ver más</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
