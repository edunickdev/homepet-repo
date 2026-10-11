import { Pencil, Trash2 } from 'lucide-react';
import { ROLES_USUARIO, nombreDe } from '../../utils/constantes';
import Etiqueta from '../../components/Etiqueta';

export default function TablaUsuarios({ usuarios, idSesion, contarMascotas, alEditar, alEliminar }) {
  return (
    <div className="tarjeta tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Contacto</th>
            <th>Rol</th>
            <th className="numero">Mascotas</th>
            <th>
              <span className="solo-lector">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => {
            const esCuentaPropia = usuario.id === idSesion;

            return (
              <tr key={usuario.id}>
                <td data-titulo="Usuario">
                  <span className="celda-doble">
                    <strong>
                      {usuario.nombre}
                      {esCuentaPropia && ' (tú)'}
                    </strong>
                    <small>{usuario.direccion || 'Sin dirección'}</small>
                  </span>
                </td>
                <td data-titulo="Contacto">
                  <span className="celda-doble">
                    {usuario.correo}
                    <small>{usuario.telefono || 'Sin teléfono'}</small>
                  </span>
                </td>
                <td data-titulo="Rol">
                  <Etiqueta estado={usuario.rol}>{nombreDe(ROLES_USUARIO, usuario.rol)}</Etiqueta>
                </td>
                <td data-titulo="Mascotas" className="numero">
                  {contarMascotas(usuario.id)}
                </td>
                <td data-titulo="Acciones">
                  <div className="acciones acciones--tabla">
                    <button className="boton-icono" onClick={() => alEditar(usuario)} aria-label={`Editar ${usuario.nombre}`} title="Editar">
                      <Pencil size={18} />
                    </button>
                    <button
                      className="boton-icono boton-icono--peligro"
                      onClick={() => alEliminar(usuario)}
                      disabled={esCuentaPropia}
                      aria-label={`Eliminar ${usuario.nombre}`}
                      title={esCuentaPropia ? 'No puedes eliminar tu propia cuenta' : 'Eliminar'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
