import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarCheck, ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { serviciosApi } from '../../api/servicios';
import { proveedoresApi } from '../../api/proveedores';
import { useColeccion } from '../../hooks/useColeccion';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { CATEGORIAS, DISPONIBILIDAD_SERVICIO, nombreDe } from '../../utils/constantes';
import { coincide } from '../../utils/formato';
import { esProveedor, puedeGestionarServicios } from '../../utils/permisos';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Buscador from '../../components/Buscador';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import EstadoVacio from '../../components/EstadoVacio';
import Etiqueta from '../../components/Etiqueta';
import Modal from '../../components/Modal';
import ConfirmarEliminar from '../../components/ConfirmarEliminar';
import TarjetaServicio from '../../components/TarjetaServicio';
import FiltroCategorias from './FiltroCategorias';
import ServicioFormulario from './ServicioFormulario';
import ContratarServicio from './ContratarServicio';

function descripcionPagina(usuario) {
  if (esProveedor(usuario)) return 'Registra y administra los servicios que ofreces a domicilio.';
  if (puedeGestionarServicios(usuario)) return 'Administra el catálogo de servicios de bienestar animal.';
  return 'Elige el servicio que necesita tu mascota y contrátalo a domicilio.';
}

export default function Servicios() {
  const { usuario } = useSesion();
  const mostrarAviso = useAviso();
  const navegar = useNavigate();
  const [parametros, setParametros] = useSearchParams();
  const esGestor = puedeGestionarServicios(usuario);
  const soloPropios = esProveedor(usuario);
  const { items: servicios, cargando, error, crear, actualizar, eliminar, recargar } = useColeccion(
    serviciosApi,
    soloPropios ? { proveedorId: usuario.id } : {}
  );
  const { items: proveedores } = useColeccion(proveedoresApi);

  const [busqueda, setBusqueda] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [enEdicion, setEnEdicion] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [porContratar, setPorContratar] = useState(null);
  const categoria = parametros.get('categoria') ?? '';

  function cambiarCategoria(nuevaCategoria) {
    setParametros(nuevaCategoria ? { categoria: nuevaCategoria } : {});
  }

  function buscarProveedor(id) {
    return proveedores.find((proveedor) => proveedor.id === id);
  }

  function nombreProveedor(id) {
    return buscarProveedor(id)?.nombre ?? 'Proveedor no encontrado';
  }

  function estaALaVenta(servicio) {
    return servicio.disponibilidad === 'disponible' && buscarProveedor(servicio.proveedorId)?.estado === 'activo';
  }

  const serviciosVisibles = esGestor ? servicios : servicios.filter(estaALaVenta);

  const serviciosFiltrados = serviciosVisibles.filter(
    (servicio) =>
      (coincide(servicio.nombre, busqueda) || coincide(nombreProveedor(servicio.proveedorId), busqueda)) &&
      (categoria === '' || servicio.categoria === categoria) &&
      (disponibilidad === '' || servicio.disponibilidad === disponibilidad)
  );

  function contratar(servicio) {
    if (!usuario) {
      navegar('/login?tipo=usuario', { state: { desde: '/servicios' } });
      return;
    }
    setPorContratar(servicio);
  }

  function confirmarContratacion() {
    mostrarAviso(`Tu solicitud de ${porContratar.nombre} fue enviada. El proveedor la confirmará pronto.`);
    setPorContratar(null);
  }

  async function guardar(datos) {
    if (enEdicion.id) {
      await actualizar(enEdicion.id, datos);
      mostrarAviso(`El servicio ${datos.nombre} fue actualizado.`);
    } else {
      await crear(datos);
      mostrarAviso(`El servicio ${datos.nombre} fue registrado.`);
    }
    setEnEdicion(null);
  }

  async function confirmarEliminacion() {
    try {
      await eliminar(porEliminar.id);
      mostrarAviso(`El servicio ${porEliminar.nombre} fue eliminado.`);
    } catch (err) {
      mostrarAviso(err.message, 'error');
    }
    setPorEliminar(null);
  }

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina titulo={soloPropios ? 'Mis servicios' : 'Servicios'} descripcion={descripcionPagina(usuario)}>
        {esGestor && (
          <button className="boton" onClick={() => setEnEdicion({})}>
            <Plus size={18} />
            Nuevo servicio
          </button>
        )}
      </EncabezadoPagina>

      {soloPropios && usuario.estado !== 'activo' && (
        <p className="advertencia">
          Tu cuenta de proveedor está {usuario.estado === 'pendiente' ? 'pendiente de aprobación' : 'suspendida'}. Tus servicios no se
          muestran en el catálogo mientras tanto.
        </p>
      )}

      <FiltroCategorias seleccionada={categoria} alCambiar={cambiarCategoria} />

      <div className={`filtros ${esGestor ? '' : 'filtros--simple'}`}>
        <Buscador valor={busqueda} alCambiar={setBusqueda} placeholder="Buscar por servicio o proveedor" />
        {esGestor && (
          <select value={disponibilidad} onChange={(evento) => setDisponibilidad(evento.target.value)} aria-label="Filtrar por disponibilidad">
            <option value="">Todas las disponibilidades</option>
            {DISPONIBILIDAD_SERVICIO.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      <MensajeError mensaje={error} alReintentar={recargar} />

      {cargando ? (
        <Cargando />
      ) : serviciosFiltrados.length === 0 ? (
        <EstadoVacio
          icono={ClipboardList}
          titulo={serviciosVisibles.length > 0 ? 'No hay resultados' : soloPropios ? 'Aún no has registrado servicios' : 'Aún no hay servicios disponibles'}
          descripcion={
            serviciosVisibles.length > 0
              ? 'Prueba con otra búsqueda o categoría.'
              : soloPropios
                ? 'Pulsa Nuevo servicio para publicar el primero.'
                : 'Vuelve a consultar más tarde.'
          }
        />
      ) : (
        <>
          <p className="texto-suave conteo">
            {serviciosFiltrados.length} de {serviciosVisibles.length} servicios · Categoría:{' '}
            {categoria ? nombreDe(CATEGORIAS, categoria) : 'todas'}
          </p>
          <div className="rejilla">
            {serviciosFiltrados.map((servicio) => (
              <TarjetaServicio key={servicio.id} servicio={servicio} proveedor={nombreProveedor(servicio.proveedorId)}>
                {esGestor ? (
                  <>
                    <Etiqueta estado={servicio.disponibilidad}>
                      {nombreDe(DISPONIBILIDAD_SERVICIO, servicio.disponibilidad)}
                    </Etiqueta>
                    <div className="acciones">
                      <button className="boton boton--secundario boton--pequeno" onClick={() => setEnEdicion(servicio)}>
                        <Pencil size={15} />
                        Editar
                      </button>
                      <button className="boton boton--peligro boton--pequeno" onClick={() => setPorEliminar(servicio)}>
                        <Trash2 size={15} />
                        Eliminar
                      </button>
                    </div>
                  </>
                ) : (
                  <button className="boton boton--acento boton--pequeno" onClick={() => contratar(servicio)}>
                    <CalendarCheck size={15} />
                    Contratar
                  </button>
                )}
              </TarjetaServicio>
            ))}
          </div>
        </>
      )}

      {enEdicion && (
        <Modal titulo={enEdicion.id ? 'Editar servicio' : 'Nuevo servicio'} alCerrar={() => setEnEdicion(null)}>
          <ServicioFormulario
            servicio={enEdicion}
            proveedores={proveedores}
            proveedorFijo={soloPropios ? usuario : null}
            alGuardar={guardar}
            alCancelar={() => setEnEdicion(null)}
          />
        </Modal>
      )}

      {porEliminar && (
        <ConfirmarEliminar
          titulo="Eliminar servicio"
          mensaje={`¿Seguro que deseas eliminar el servicio ${porEliminar.nombre}?`}
          alConfirmar={confirmarEliminacion}
          alCerrar={() => setPorEliminar(null)}
        />
      )}

      {porContratar && (
        <Modal titulo="Contratar servicio" alCerrar={() => setPorContratar(null)}>
          <ContratarServicio
            servicio={porContratar}
            proveedor={nombreProveedor(porContratar.proveedorId)}
            usuario={usuario}
            alContratar={confirmarContratacion}
            alCancelar={() => setPorContratar(null)}
          />
        </Modal>
      )}
    </div>
  );
}
