import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CreditCard, HeartHandshake, Search, ShieldCheck } from 'lucide-react';
import { serviciosApi } from '../../api/servicios';
import { proveedoresApi } from '../../api/proveedores';
import { useColeccion } from '../../hooks/useColeccion';
import { CATEGORIAS } from '../../utils/constantes';
import TarjetaServicio from '../../components/TarjetaServicio';
import SeccionNosotros from './SeccionNosotros';

const PASOS = [
  { icono: Search, titulo: 'Elige el servicio', texto: 'Explora el catálogo y revisa la información de cada proveedor.' },
  { icono: CalendarCheck, titulo: 'Agenda a domicilio', texto: 'Selecciona la fecha, la hora y la mascota que recibirá el servicio.' },
  { icono: CreditCard, titulo: 'Paga con seguridad', texto: 'Cuando el proveedor confirme, realiza el pago desde la plataforma.' },
  { icono: HeartHandshake, titulo: 'Recibe el servicio', texto: 'El proveedor llega a tu casa y tú recibes cada novedad.' },
];

export default function Landing() {
  const servicios = useColeccion(serviciosApi, { disponibilidad: 'disponible' });
  const proveedores = useColeccion(proveedoresApi, { estado: 'activo' });

  function nombreProveedor(id) {
    return proveedores.items.find((proveedor) => proveedor.id === id)?.nombre;
  }

  const serviciosVisibles = servicios.items.filter((servicio) => nombreProveedor(servicio.proveedorId));

  return (
    <>
      <section className="hero">
        <div className="contenedor hero__contenido">
          <div>
            <span className="hero__etiqueta">
              <ShieldCheck size={16} />
              Proveedores verificados
            </span>
            <h1>
              El cuidado que tu mascota merece, <span>en la puerta de tu casa</span>
            </h1>
            <p>
              Veterinarios, esteticistas, entrenadores y más, reunidos en un solo lugar. Agenda, paga y recibe el
              servicio sin salir de casa.
            </p>
            <div className="acciones">
              <Link to="/servicios" className="boton boton--acento boton--grande">
                Ver servicios
                <ArrowRight size={18} />
              </Link>
              <Link to="/registro" className="boton boton--secundario boton--grande">
                Crear cuenta gratis
              </Link>
            </div>
          </div>

          <div className="hero__cifras">
            <div className="cifra">
              <strong>{proveedores.items.length}</strong>
              <span>Proveedores activos</span>
            </div>
            <div className="cifra">
              <strong>{serviciosVisibles.length}</strong>
              <span>Servicios disponibles</span>
            </div>
            <div className="cifra">
              <strong>{CATEGORIAS.length}</strong>
              <span>Categorías</span>
            </div>
          </div>
        </div>
      </section>

      <SeccionNosotros />

      <section className="contenedor seccion">
        <h2>Categorías</h2>
        <div className="categorias">
          {CATEGORIAS.map(({ id, nombre, icono: Icono }) => (
            <Link key={id} to={`/servicios?categoria=${id}`} className="categoria">
              <Icono size={28} />
              <span>{nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="seccion__cabeza">
          <h2>Servicios destacados</h2>
          <Link to="/servicios" className="enlace-flecha">
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="rejilla">
          {serviciosVisibles.slice(0, 6).map((servicio) => (
            <TarjetaServicio key={servicio.id} servicio={servicio} proveedor={nombreProveedor(servicio.proveedorId)} />
          ))}
        </div>
      </section>

      <section className="contenedor seccion">
        <h2>¿Cómo funciona?</h2>
        <div className="pasos">
          {PASOS.map(({ icono: Icono, titulo, texto }, indice) => (
            <article key={titulo} className="tarjeta paso">
              <span className="paso__numero">{indice + 1}</span>
              <Icono size={28} className="paso__icono" />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="llamado">
          <div>
            <h2>¿Ofreces servicios para mascotas?</h2>
            <p>Únete como proveedor aliado y llega a más hogares de tu ciudad.</p>
          </div>
          <Link to="/registro" className="boton boton--acento boton--grande">
            Quiero ser proveedor aliado
          </Link>
        </div>
      </section>
    </>
  );
}
