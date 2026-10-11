import { useState } from 'react';
import { PawPrint, Plus } from 'lucide-react';
import { mascotasApi } from '../../api/mascotas';
import { useColeccion } from '../../hooks/useColeccion';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { ESPECIES } from '../../utils/constantes';
import { coincide } from '../../utils/formato';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Buscador from '../../components/Buscador';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import EstadoVacio from '../../components/EstadoVacio';
import Modal from '../../components/Modal';
import ConfirmarEliminar from '../../components/ConfirmarEliminar';
import MascotaFormulario from './MascotaFormulario';
import TarjetaMascota from './TarjetaMascota';

export default function Mascotas() {
  const { usuario } = useSesion();
  const mostrarAviso = useAviso();
  const { items: mascotas, cargando, error, crear, actualizar, eliminar, recargar } = useColeccion(mascotasApi, {
    usuarioId: usuario.id,
  });

  const [busqueda, setBusqueda] = useState('');
  const [especie, setEspecie] = useState('');
  const [enEdicion, setEnEdicion] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);

  const mascotasFiltradas = mascotas.filter(
    (mascota) =>
      (coincide(mascota.nombre, busqueda) || coincide(mascota.raza, busqueda)) &&
      (especie === '' || mascota.especie === especie)
  );

  async function guardar(datos) {
    if (enEdicion.id) {
      await actualizar(enEdicion.id, datos);
      mostrarAviso(`Los datos de ${datos.nombre} fueron actualizados.`);
    } else {
      await crear({ ...datos, usuarioId: usuario.id });
      mostrarAviso(`Se registró a ${datos.nombre}.`);
    }
    setEnEdicion(null);
  }

  async function confirmarEliminacion() {
    try {
      await eliminar(porEliminar.id);
      mostrarAviso(`Se eliminó a ${porEliminar.nombre}.`);
    } catch (err) {
      mostrarAviso(err.message, 'error');
    }
    setPorEliminar(null);
  }

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina titulo="Mis mascotas" descripcion="Registra a tus compañeros para poder agendar servicios a domicilio.">
        <button className="boton" onClick={() => setEnEdicion({})}>
          <Plus size={18} />
          Nueva mascota
        </button>
      </EncabezadoPagina>

      <div className="filtros">
        <Buscador valor={busqueda} alCambiar={setBusqueda} placeholder="Buscar por nombre o raza" />
        <select value={especie} onChange={(evento) => setEspecie(evento.target.value)} aria-label="Filtrar por especie">
          <option value="">Todas las especies</option>
          {ESPECIES.map((opcion) => (
            <option key={opcion}>{opcion}</option>
          ))}
        </select>
      </div>

      <MensajeError mensaje={error} alReintentar={recargar} />

      {cargando ? (
        <Cargando />
      ) : mascotasFiltradas.length === 0 ? (
        <EstadoVacio
          icono={PawPrint}
          titulo={mascotas.length === 0 ? 'Aún no hay mascotas registradas' : 'No hay resultados'}
          descripcion={mascotas.length === 0 ? 'Agrega tu primera mascota para empezar.' : 'Prueba con otra búsqueda o especie.'}
        />
      ) : (
        <div className="rejilla">
          {mascotasFiltradas.map((mascota) => (
            <TarjetaMascota
              key={mascota.id}
              mascota={mascota}
              alEditar={() => setEnEdicion(mascota)}
              alEliminar={() => setPorEliminar(mascota)}
            />
          ))}
        </div>
      )}

      {enEdicion && (
        <Modal titulo={enEdicion.id ? 'Editar mascota' : 'Nueva mascota'} alCerrar={() => setEnEdicion(null)}>
          <MascotaFormulario mascota={enEdicion} alGuardar={guardar} alCancelar={() => setEnEdicion(null)} />
        </Modal>
      )}

      {porEliminar && (
        <ConfirmarEliminar
          titulo="Eliminar mascota"
          mensaje={`¿Seguro que deseas eliminar a ${porEliminar.nombre}?`}
          alConfirmar={confirmarEliminacion}
          alCerrar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}
