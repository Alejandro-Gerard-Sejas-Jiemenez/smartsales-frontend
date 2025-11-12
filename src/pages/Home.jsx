import React from "react";
import home_img from '../assets/home_img.webp';
import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: 'Refrigeradores', count: 85 },
  { id: 2, name: 'Lavadoras', count: 62 },
  { id: 3, name: 'Microondas', count: 48 },
  { id: 4, name: 'Aire Acondicionado', count: 34 },
  { id: 5, name: 'Aspiradoras', count: 56 },
  { id: 6, name: 'Cafeteras', count: 41 }
];

const products = [
  { id: 1, title: 'Refrigerador Smart Pro 500L', price: 1299.99, oldPrice: 1599.99, rating: 4.8, reviews: 234, badge: 'Más vendido', img: home_img },
  { id: 2, title: 'Lavadora Automática 15kg', price: 899.99, oldPrice: 1099.99, rating: 4.6, reviews: 187, badge: 'Oferta', img: home_img },
  { id: 3, title: 'Microondas Digital 1200W', price: 249.99, oldPrice: 329.99, rating: 4.7, reviews: 312, badge: 'Nuevo', img: home_img }
];

export default function Home() {
  return (
    <div>

      <main style={{padding: '28px 16px'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          {/* Categories header */}
          <section style={{textAlign:'center', padding:'24px 0 8px'}}>
            <h2 style={{fontSize:28, margin:0}}>Explora por categorías</h2>
            <p style={{color:'#6b7280', marginTop:8}}>Encuentra exactamente lo que necesitas para tu hogar</p>
          </section>

          {/* Categories row */}
          <section style={{display:'flex', gap:16, marginTop:20, flexWrap:'wrap', justifyContent:'center'}}>
            {categories.map(cat => (
              <div key={cat.id} style={{background:'#fff', borderRadius:12, padding:18, width:170, boxShadow:'0 6px 18px rgba(15,23,42,0.04)', textAlign:'center'}}>
                <div style={{height:74, width:74, borderRadius:10, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px'}}>
                  <img src={home_img} alt={cat.name} style={{width:54, height:54, objectFit:'cover'}} />
                </div>
                <div style={{fontWeight:600}}>{cat.name}</div>
                <small style={{display:'block', color:'#6b7280', marginTop:6}}>{cat.count} productos</small>
              </div>
            ))}
          </section>

          {/* Products header */}
          <section style={{textAlign:'center', marginTop:44}}>
            <h2 style={{fontSize:26, margin:0}}>Productos destacados</h2>
            <p style={{color:'#6b7280', marginTop:8}}>Los electrodomésticos más populares con las mejores ofertas</p>
          </section>

          {/* Products grid */}
          <section style={{marginTop:20, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:18}}>
            {products.map(p => (
              <article key={p.id} style={{background:'#fff', borderRadius:10, overflow:'hidden', boxShadow:'0 10px 30px rgba(15,23,42,0.05)'}}>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute', left:12, top:12, background:'#0ea5a5', color:'#fff', padding:'6px 10px', borderRadius:999, fontWeight:700, fontSize:12}}>{p.badge}</span>
                  <div style={{height:240, overflow:'hidden'}}>
                    <img src={p.img} alt={p.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  </div>
                </div>

                <div style={{padding:14}}>
                  <h3 style={{margin:0, fontSize:16, fontWeight:700}}>{p.title}</h3>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
                    <div style={{color:'#f59e0b'}}>★ {p.rating}</div>
                    <small style={{color:'#6b7280'}}>({p.reviews} reseñas)</small>
                  </div>

                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12}}>
                    <div>
                      <div style={{fontSize:20, fontWeight:800, color:'#0A84FF'}}>${p.price.toFixed(2)}</div>
                      <div style={{color:'#9ca3af', textDecoration:'line-through'}}>${p.oldPrice.toFixed(2)}</div>
                    </div>

                    <div style={{display:'flex', gap:8}}>
                      <button style={{background:'#0A84FF', color:'#fff', border:'none', padding:'10px 14px', borderRadius:8, cursor:'pointer'}}>Agregar</button>
                      <Link to="#" style={{display:'inline-block', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(15,23,42,0.06)', textDecoration:'none', color:'#0f172a'}}>Ver más</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
