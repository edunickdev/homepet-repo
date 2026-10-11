import { useState } from 'react';
import { Plus, Store } from 'lucide-react';
import { proveedoresApi } from '../../api/proveedores';
import { serviciosApi } from '../../api/servicios';
import { useColeccion } from '../../hooks/useColeccion';
import { useAviso } from '../../context/AvisoContext';
import { ESTADOS_PROVEEDOR } from '../../utils/constantes';
import { coincide } from '../../utils/formato';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Buscador from '../../components/Buscador';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import EstadoVacio from '../../components/EstadoVacio';
import Modal from '../../components/Modal';
import ConfirmarEliminar from '../../components/ConfirmarEliminar';
import ProveedorFormulario from './ProveedorFormulario';
import TablaProveedores from './TablaProveedores';
import DetalleProveedor from './DetalleProveedor';

function textoServiciosAsociados(cantidad) {
  if (cantidad === 0) return null;
  if (cantidad === 1) return 'También se eliminará el servicio que tiene registrado.';
  return `También se eliminarán los ${cantidad} servicios que tiene registrados.`;
}

export default function Proveedores() {
  const mostrarAviso = useAviso();
  const { items: proveedores, cargando, error, crear, actualizar, eliminar, recargar } = useColeccion(proveedoresApi);
  const { items: servicios, recargar: recargarServicios } = useColeccion(serviciosApi);

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [enEdicion, setEnEdicion] = useState(null);
  const [enDetalle, setEnDetalle] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);

  const proveedoresFiltrados = proveedores.filter(
    (proveedor) =>
      (coincide(proveedor.nombre, busqueda) || coincide(proveedor.correo, busqueda) || coincide(proveedor.direccion, busqueda)) &&
      (estado === '' || proveedor.estado === estado)
  );

  function serviciosDe(idProveedor) {
    return servicios.filter((servicio) => servicio.proveedorId === idProveedor);
  }

  async function guardar(datos) {
    if (enEdicion.id) {
      await actualizar(enEdicion.id, datos);
      mostrarAviso(`El proveedor ${datos.nombre} fue actualizado.`);
    } else {
      await crear(datos);
      mostrarAviso(`El proveedor ${datos.nombre} fue registrado.`);
    }
    setEnEdicion(null);
  }

  async function confirmarEliminacion() {
    try {
      for (const servicio of serviciosDe(porEliminar.id)) {
        await serviciosApi.eliminar(servicio.id);
      }
      await eliminar(porEliminar.id);
      await recargarServicios();
      mostrarAviso(`El proveedor ${porEliminar.nombre} fue eliminado.`);
    } catch (err) {
      mostrarAviso(err.message, 'error');
    }
    setPorEliminar(null);
  }

  const cantidadServiciosPorEliminar = porEliminar ? serviciosDe(porEliminar.id).length : 0;

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina titulo="Proveedores aliados" descripcion="Prestadores de servicios de bienestar animal a domicilio.">
        <button className="boton" onClick={() => setEnEdicion({})}>
          <Plus size={18} />
          Nuevo proveedor
        </button>
      </EncabezadoPagina>

      <div className="filtros">
        <Buscador valor={busqueda} alCambiar={setBusqueda} placeholder="Buscar por nombre, correo o zona" />
        <select value={estado} onChange={(evento) => setEstado(evento.target.value)} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          {ESTADOS_PROVEEDOR.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </select>
      </div>

      <MensajeError mensaje={error} alReintentar={recargar} />

      {cargando ? (
        <Cargando />
      ) : proveedoresFiltrados.length === 0 ? (
        <EstadoVacio
          icono={Store}
          titulo={proveedores.length === 0 ? 'Aún no hay proveedores registrados' : 'No hay resultados'}
          descripcion={proveedores.length === 0 ? 'Registra el primer proveedor aliado.' : 'Prueba con otra búsqueda o estado.'}
        />
      ) : (
        <TablaProveedores
          proveedores={proveedoresFiltrados}
          contarServicios={(id) => serviciosDe(id).length}
          alVer={setEnDetalle}
          alEditar={setEnEdicion}
          alEliminar={setPorEliminar}
        />
      )}

      {enEdicion && (
        <Modal titulo={enEdicion.id ? 'Editar proveedor' : 'Nuevo proveedor'} alCerrar={() => setEnEdicion(null)}>
          <ProveedorFormulario proveedor={enEdicion} alGuardar={guardar} alCancelar={() => setEnEdicion(null)} />
        </Modal>
      )}

      {enDetalle && (
        <Modal titulo={enDetalle.nombre} alCerrar={() => setEnDetalle(null)}>
          <DetalleProveedor proveedor={enDetalle} servicios={serviciosDe(enDetalle.id)} />
        </Modal>
      )}

      {porEliminar && (
        <ConfirmarEliminar
          titulo="Eliminar proveedor"
          mensaje={`¿Seguro que deseas eliminar a ${porEliminar.nombre}?`}
          advertencia={textoServiciosAsociados(cantidadServiciosPorEliminar)}
          alConfirmar={confirmarEliminacion}
          alCerrar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}
