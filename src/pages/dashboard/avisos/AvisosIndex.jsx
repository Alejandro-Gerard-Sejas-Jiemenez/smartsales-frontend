import { useState, useEffect } from 'react';
import avisoService from '../../../services/avisoService';
import SmartTable from '../../../components/tabla/SmartTable';
import AvisoForm from './AvisoForm';

export default function AvisosIndex() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAviso, setSelectedAviso] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    cargarAvisos();
  }, []);

  const cargarAvisos = async () => {
    try {
      setLoading(true);
      const data = await avisoService.getAvisos();
      setAvisos(data);
    } catch (err) {
      console.error('Error al cargar avisos:', err);
      alert('Error al cargar los avisos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAviso(null);
    setShowForm(true);
  };

  const handleEdit = (aviso) => {
    setSelectedAviso(aviso);
    setShowForm(true);
  };

  const handleDelete = async (aviso) => {
    if (!confirm(`¿Eliminar el aviso "${aviso.titulo}"?`)) return;
    
    try {
      await avisoService.deleteAviso(aviso.id);
      alert('Aviso eliminado exitosamente');
      cargarAvisos();
    } catch (err) {
      console.error('Error al eliminar aviso:', err);
      alert('Error al eliminar el aviso');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      console.log('📤 Datos a enviar:', formData);
      
      if (formData.id) {
        const response = await avisoService.updateAviso(formData.id, formData);
        console.log('✅ Respuesta update:', response);
        alert('Aviso actualizado exitosamente');
      } else {
        const response = await avisoService.createAviso(formData);
        console.log('✅ Respuesta create:', response);
        alert('Aviso creado exitosamente');
      }
      setShowForm(false);
      setSelectedAviso(null);
      cargarAvisos();
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      
      // Mostrar error más detallado
      let errorMsg = 'Error al guardar el aviso';
      if (err.response?.data) {
        const errors = err.response.data;
        errorMsg = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
      }
      alert(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedAviso(null);
  };

  const getBadgeColor = (estado) => {
    const colors = {
      'Activo': 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold',
      'Inactivo': 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold',
      'Programado': 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold',
      'Enviado': 'bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold'
    };
    return colors[estado] || 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold';
  };

  const getTipoBadgeColor = (tipo) => {
    const colors = {
      'Promoción': 'bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-semibold',
      'Oferta': 'bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold',
      'Informativo': 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold',
      'Urgente': 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold',
      'Actualización': 'bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-semibold'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold';
  };

  const columns = [
    {
      key: 'titulo',
      label: 'Título',
      enableSort: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.titulo}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">{row.mensaje}</div>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      hideBelow: 'sm',
      enableSort: true,
      render: (row) => <span className={getTipoBadgeColor(row.tipo)}>{row.tipo}</span>
    },
    {
      key: 'estado',
      label: 'Estado',
      enableSort: true,
      render: (row) => <span className={getBadgeColor(row.estado)}>{row.estado}</span>
    },
    {
      key: 'destinatarios',
      label: 'Destinatarios',
      hideBelow: 'md',
      render: (row) => (
        row.enviar_a_todos ? (
          <span className="text-blue-600 font-medium">Todos</span>
        ) : (
          <span className="text-gray-700">{row.destinatarios?.length || 0} clientes</span>
        )
      )
    },
    {
      key: 'fecha_creacion',
      label: 'Fecha',
      hideBelow: 'lg',
      enableSort: true,
      render: (row) => new Date(row.fecha_creacion).toLocaleDateString('es-BO')
    }
  ];

  if (showForm) {
    return (
      <AvisoForm
        initialAviso={selectedAviso}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        loading={formLoading}
      />
    );
  }

  return (
    <div className="p-4 md:p-6">
      <SmartTable
        titulo="Gestión de Avisos"
        data={avisos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay avisos registrados"
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actionsLabel="Acciones"
        actionsRender={(row) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="px-3 py-1.5 text-[11px] sm:text-xs rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
              title="Editar"
            >
              <span className="hidden md:inline">Editar</span>
              <span className="md:hidden">✎</span>
            </button>
            <button
              onClick={() => handleDelete(row)}
              className="px-3 py-1.5 text-[11px] sm:text-xs rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-400"
              title="Eliminar"
            >
              <span className="hidden md:inline">Eliminar</span>
              <span className="md:hidden">🗑️</span>
            </button>
          </div>
        )}
      />
    </div>
  );
}
