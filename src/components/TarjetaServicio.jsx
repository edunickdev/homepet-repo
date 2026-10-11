import { Store } from 'lucide-react';
import { buscarCategoria } from '../utils/constantes';
import { pesos } from '../utils/formato';

export default function TarjetaServicio({ servicio, proveedor, children }) {
  const { nombre: categoria, icono: Icono } = buscarCategoria(servicio.categoria);

  return (
    <article className="tarjeta tarjeta-servicio">
      <div className="tarjeta-servicio__icono">
        <Icono size={32} />
      </div>
      <div className="tarjeta-servicio__cuerpo">
        <span className="texto-suave">{categoria}</span>
        <h3>{servicio.nombre}</h3>
        <p className="tarjeta-servicio__proveedor">
          <Store size={14} />
          {proveedor}
        </p>
        <p className="tarjeta-servicio__descripcion">{servicio.descripcion}</p>
        <strong className="precio">{pesos(servicio.precio)}</strong>
        {children}
      </div>
    </article>
  );
}
