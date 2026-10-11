import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ESTADOS_PROVEEDOR, nombreDe } from '../../utils/constantes';
import Etiqueta from '../../components/Etiqueta';

export default function TablaProveedores({ proveedores, contarServicios, alVer, alEditar, alEliminar }) {
  return (
    <div className="tarjeta tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Contacto</th>
            <th>Zona</th>
            <th className="numero">Servicios</th>
            <th>Estado</th>
            <th>
              <span className="solo-lector">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id}>
              <td data-titulo="Proveedor">
                <strong>{proveedor.nombre}</strong>
              </td>
              <td data-titulo="Contacto">
                <span className="celda-doble">
                  {proveedor.correo}
                  <small>{proveedor.telefono}</small>
                </span>
              </td>
              <td data-titulo="Zona">{proveedor.direccion || 'Sin registrar'}</td>
              <td data-titulo="Servicios" className="numero">
                {contarServicios(proveedor.id)}
              </td>
              <td data-titulo="Estado">
                <Etiqueta estado={proveedor.estado}>{nombreDe(ESTADOS_PROVEEDOR, proveedor.estado)}</Etiqueta>
              </td>
              <td data-titulo="Acciones">
                <div className="acciones acciones--tabla">
                  <button className="boton-icono" onClick={() => alVer(proveedor)} aria-label={`Ver ${proveedor.nombre}`} title="Ver detalle">
                    <Eye size={18} />
                  </button>
                  <button className="boton-icono" onClick={() => alEditar(proveedor)} aria-label={`Editar ${proveedor.nombre}`} title="Editar">
                    <Pencil size={18} />
                  </button>
                  <button
                    className="boton-icono boton-icono--peligro"
                    onClick={() => alEliminar(proveedor)}
                    aria-label={`Eliminar ${proveedor.nombre}`}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
