import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { usuariosApi } from '../../api/usuarios';
import { mascotasApi } from '../../api/mascotas';
import { reservasApi } from '../../api/reservas';
import { useColeccion } from '../../hooks/useColeccion';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { ROLES_USUARIO } from '../../utils/constantes';
import { coincide } from '../../utils/formato';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Buscador from '../../components/Buscador';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import EstadoVacio from '../../components/EstadoVacio';
import Modal from '../../components/Modal';
import ConfirmarEliminar from '../../components/ConfirmarEliminar';
import UsuarioFormulario from './UsuarioFormulario';
import TablaUsuarios from './TablaUsuarios';

function textoMascotasAsociadas(cantidad) {
  if (cantidad === 0) return null;
  if (cantidad === 1) return 'También se eliminará la mascota que tiene registrada y sus solicitudes de servicio.';
  return `También se eliminarán las ${cantidad} mascotas que tiene registradas y sus solicitudes de servicio.`;
}

export default function Usuarios() {
  const { usuario: sesion } = useSesion();
  const mostrarAviso = useAviso();
  const { items: usuarios, cargando, error, crear, actualizar, eliminar, recargar } = useColeccion(usuariosApi);
  const { items: mascotas, recargar: recargarMascotas } = useColeccion(mascotasApi);

  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('');
  const [enEdicion, setEnEdicion] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      (coincide(usuario.nombre, busqueda) || coincide(usuario.correo, busqueda)) && (rol === '' || usuario.rol === rol)
  );

  function mascotasDe(idUsuario) {
    return mascotas.filter((mascota) => mascota.usuarioId === idUsuario);
  }

  async function guardar(datos) {
    if (enEdicion.id) {
      await actualizar(enEdicion.id, datos);
      mostrarAviso(`Los datos de ${datos.nombre} fueron actualizados.`);
    } else {
      await crear(datos);
      mostrarAviso(`El usuario ${datos.nombre} fue registrado.`);
    }
    setEnEdicion(null);
  }

  async function confirmarEliminacion() {
    try {
      const reservas = await reservasApi.listar({ usuarioId: porEliminar.id });
      for (const reserva of reservas) {
        await reservasApi.eliminar(reserva.id);
      }
      for (const mascota of mascotasDe(porEliminar.id)) {
        await mascotasApi.eliminar(mascota.id);
      }
      await eliminar(porEliminar.id);
      await recargarMascotas();
      mostrarAviso(`El usuario ${porEliminar.nombre} fue eliminado.`);
    } catch (err) {
      mostrarAviso(err.message, 'error');
    }
    setPorEliminar(null);
  }

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina titulo="Usuarios" descripcion="Cuentas de clientes y administradores registradas en la plataforma.">
        <button className="boton" onClick={() => setEnEdicion({})}>
          <Plus size={18} />
          Nuevo usuario
        </button>
      </EncabezadoPagina>

      <div className="filtros">
        <Buscador valor={busqueda} alCambiar={setBusqueda} placeholder="Buscar por nombre o correo" />
        <select value={rol} onChange={(evento) => setRol(evento.target.value)} aria-label="Filtrar por rol">
          <option value="">Todos los roles</option>
          {ROLES_USUARIO.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </select>
      </div>

      <MensajeError mensaje={error} alReintentar={recargar} />

      {cargando ? (
        <Cargando />
      ) : usuariosFiltrados.length === 0 ? (
        <EstadoVacio icono={Users} titulo="No hay resultados" descripcion="Prueba con otra búsqueda o rol." />
      ) : (
        <TablaUsuarios
          usuarios={usuariosFiltrados}
          idSesion={sesion.id}
          contarMascotas={(id) => mascotasDe(id).length}
          alEditar={setEnEdicion}
          alEliminar={setPorEliminar}
        />
      )}

      {enEdicion && (
        <Modal titulo={enEdicion.id ? 'Editar usuario' : 'Nuevo usuario'} alCerrar={() => setEnEdicion(null)}>
          <UsuarioFormulario
            usuario={enEdicion}
            esCuentaPropia={enEdicion.id === sesion.id}
            alGuardar={guardar}
            alCancelar={() => setEnEdicion(null)}
          />
        </Modal>
      )}

      {porEliminar && (
        <ConfirmarEliminar
          titulo="Eliminar usuario"
          mensaje={`¿Seguro que deseas eliminar la cuenta de ${porEliminar.nombre}?`}
          advertencia={textoMascotasAsociadas(mascotasDe(porEliminar.id).length)}
          alConfirmar={confirmarEliminacion}
          alCerrar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}
