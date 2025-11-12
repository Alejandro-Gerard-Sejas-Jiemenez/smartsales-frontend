import { useEffect, useState, useMemo } from "react";
import { getPredicciones } from "../../../services/analisis.service.js";
// --- CAMBIO: Importamos el nuevo servicio ---
import { getAnalisisTendencias } from "../../../services/venta.service.js";
import { getCategorias } from "../../../services/catalogo.service.js";
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';

// ... (Componente Field sin cambios) ...

// Opciones para el filtro de meses
const opcionesMeses = [
  { label: 'Próximos 3 Meses', value: 3 },
  { label: 'Próximos 6 Meses', value: 6 },
  { label: 'Próximos 12 Meses', value: 12 },
];

export default function DashboardIAPage() {
  const [loadingPredicciones, setLoadingPredicciones] = useState(false);
  const [loadingTendencias, setLoadingTendencias] = useState(false);
  const [predicciones, setPredicciones] = useState([]);
  const [tendencias, setTendencias] = useState([]); // <-- AÑADIDO: Estado para tendencias
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [mesesAMostrar, setMesesAMostrar] = useState(3);
  const [error, setError] = useState("");

  // Cargar las categorías (sin cambios)
  useEffect(() => {
    getCategorias()
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(e => toast.error("Error al cargar categorías"));
  }, []);

  // Cargar datos (ahora carga ambas APIs)
  useEffect(() => {
    // 1. Cargar Predicciones (depende del filtro)
    setLoadingPredicciones(true);
    setError("");
    const params = {};
    if (selectedCategoria) params.categoria = selectedCategoria;

    getPredicciones(params)
      .then(data => setPredicciones(Array.isArray(data) ? data : [])) 
      .catch(e => setError("Error al cargar predicciones: " + e.message))
      .finally(() => setLoadingPredicciones(false));

    // 2. Cargar Tendencias Históricas (solo se carga una vez)
    setLoadingTendencias(true);
    getAnalisisTendencias()
      .then(data => setTendencias(Array.isArray(data) ? data : []))
      .catch(e => setError("Error al cargar tendencias: " + e.message))
      .finally(() => setLoadingTendencias(false));

  }, [selectedCategoria]); // Solo se recarga si la categoría cambia

  // --- Datos para Gráfica de PREDICCIONES ---
  const prediccionesChartData = useMemo(() => {
    let dataParaGrafico = [];
    const prediccionesOrdenadas = [...predicciones].reverse(); 

    if (!selectedCategoria && prediccionesOrdenadas.length > 0) {
      const grouped = prediccionesOrdenadas.reduce((acc, p) => {
        const monthYear = new Date(p.periodo_inicio).toLocaleString('es-BO', { month: 'short', year: 'numeric' });
        
        if (!acc[monthYear]) {
          acc[monthYear] = {
            name: monthYear,
            "Venta Predicha (Bs)": 0,
            _date: new Date(p.periodo_inicio) 
          };
        }
        acc[monthYear]["Venta Predicha (Bs)"] += parseFloat(p.venta_predicha);
        return acc;
      }, {});
      dataParaGrafico = Object.values(grouped).sort((a, b) => a._date - b._date);
      
    } else {
      dataParaGrafico = prediccionesOrdenadas.map(p => ({
          name: new Date(p.periodo_inicio).toLocaleString('es-BO', { month: 'short', year: 'numeric' }),
          "Venta Predicha (Bs)": parseFloat(p.venta_predicha),
      }));
    }
    return dataParaGrafico.slice(0, mesesAMostrar);
  }, [predicciones, mesesAMostrar, selectedCategoria]);

  // --- Datos para Gráfica de TENDENCIAS (Historial) ---
  const tendenciasChartData = useMemo(() => {
    return tendencias.map(t => ({
      name: new Date(t.mes + '-02').toLocaleString('es-BO', { month: 'short', year: 'numeric' }), // '-02' para evitar zonas horarias
      "Cantidad de Ventas": t.cantidad_ventas,
      "Monto Total (Bs)": parseFloat(t.monto_total),
    }));
  }, [tendencias]);
  
  // --- Total Predicho ---
  const totalPredicho = useMemo(() => {
     return prediccionesChartData.reduce((sum, item) => sum + item["Venta Predicha (Bs)"], 0);
  }, [prediccionesChartData]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Análisis y Predicción de Ventas
      </h1>

      {/* --- Barra de Filtros --- */}
      <div className="p-6 space-y-4 border rounded-3xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Filtros del Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Field label="Categoría">
            <select
              name="categoria"
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="input-base"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </Field>
          
          <Field label="Período de Predicción">
            <select
              name="meses"
              value={mesesAMostrar}
              onChange={(e) => setMesesAMostrar(parseInt(e.target.value))}
              className="input-base"
            >
              {opcionesMeses.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>
      
      {error && (
        <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* --- Tarjeta de Total --- */}
      <div className="p-6 border rounded-3xl bg-indigo-600 text-white shadow">
         <h3 className="text-lg font-medium text-indigo-100">Total Predicho ({mesesAMostrar} Meses)</h3>
         <p className="text-4xl font-bold">
           {totalPredicho.toFixed(2)} Bs
         </p>
         <p className="text-sm text-indigo-200 mt-1">
           {selectedCategoria 
             ? `Para: ${categorias.find(c => c.id === parseInt(selectedCategoria))?.nombre}`
             : "Para: Todas las categorías (Sumatoria)"
           }
         </p>
      </div>

      {/* --- GRÁFICA DE LÍNEAS --- */}
      <div className="w-full h-96 p-6 border rounded-3xl bg-white shadow-sm flex flex-col"> {/* <-- 1. Añadido 'flex flex-col' */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex-shrink-0"> {/* <-- 2. Añadido 'flex-shrink-0' */}
          Predicción de Ventas (Gráfico de Líneas)
        </h3>
        {loadingPredicciones ? (
          <div className="flex-grow flex justify-center items-center h-full text-gray-500">Cargando gráfica...</div>
        ) : prediccionesChartData.length === 0 ? (
           <div className="flex-grow flex justify-center items-center h-full text-gray-500">No hay datos de predicción para mostrar.</div>
        ) : (
          <div className="flex-grow w-full h-full"> {/* <-- 3. Contenedor 'flex-grow' */}
            <ResponsiveContainer width="100%" height="100%"> {/* <-- 4. Cambiado height a "100%" */}
              <LineChart data={prediccionesChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value} Bs`} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} Bs`, "Venta Predicha"]}/>
                <Legend />
                <Line type="monotone" dataKey="Venta Predicha (Bs)" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* --- GRÁFICA DE BARRAS --- */}
      <div className="w-full h-96 p-6 border rounded-3xl bg-white shadow-sm flex flex-col"> {/* <-- 1. Añadido 'flex flex-col' */}
         <h3 className="text-lg font-semibold text-gray-700 mb-4 flex-shrink-0"> {/* <-- 2. Añadido 'flex-shrink-0' */}
          Predicción de Ventas (Gráfico de Barras)
        </h3>
        {loadingPredicciones ? (
          <div className="flex-grow flex justify-center items-center h-full text-gray-500">Cargando gráfica...</div>
        ) : prediccionesChartData.length === 0 ? (
           <div className="flex-grow flex justify-center items-center h-full text-gray-500">No hay datos de predicción para mostrar.</div>
        ) : (
          <div className="flex-grow w-full h-full"> {/* <-- 3. Contenedor 'flex-grow' */}
            <ResponsiveContainer width="100%" height="100%"> {/* <-- 4. Cambiado height a "100%" */}
              <BarChart data={prediccionesChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value} Bs`} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} Bs`, "Venta Predicha"]}/>
                <Legend />
                <Bar dataKey="Venta Predicha (Bs)" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* --- GRÁFICA DE TENDENCIAS (CORREGIDA) --- */}
      <div className="w-full h-96 p-6 border rounded-3xl bg-white shadow-sm flex flex-col"> {/* <-- 1. Añadido 'flex flex-col' */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex-shrink-0"> {/* <-- 2. Añadido 'flex-shrink-0' */}
          Tendencias Históricas (Últimos 12 Meses)
        </h3>
        {loadingTendencias ? (
          <div className="flex-grow flex justify-center items-center h-full text-gray-500">Cargando tendencias...</div>
        ) : tendenciasChartData.length === 0 ? (
           <div className="flex-grow flex justify-center items-center h-full text-gray-500">No hay datos históricos para mostrar.</div>
        ) : (
          <div className="flex-grow w-full h-full"> {/* <-- 3. Contenedor 'flex-grow' */}
            <ResponsiveContainer width="100%" height="100%"> {/* <-- 4. Cambiado height a "100%" */}
              <BarChart data={tendenciasChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" tickFormatter={(value) => `${value}`}/>
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tickFormatter={(value) => `${value} Bs`}/>
                <Tooltip formatter={(value, name) => {
                  return name === "Monto Total (Bs)" ? [`${parseFloat(value).toFixed(2)} Bs`, name] : [value, name];
                }}/>
                <Legend />
                <Bar yAxisId="left" dataKey="Cantidad de Ventas" fill="#8b5cf6" opacity={0.7} />
                <Bar yAxisId="right" dataKey="Monto Total (Bs)" fill="#f59e0b" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

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