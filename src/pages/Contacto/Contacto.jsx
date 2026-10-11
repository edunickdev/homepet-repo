import { useState } from 'react';
import { CircleCheck, Clock, Mail, MapPin, Phone } from 'lucide-react';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import FormularioContacto from './FormularioContacto';

const DATOS_CONTACTO = [
  { icono: Phone, titulo: 'Teléfono', texto: '+57 300 000 0000' },
  { icono: Mail, titulo: 'Correo', texto: 'contacto@homepet.co' },
  { icono: MapPin, titulo: 'Ubicación', texto: 'Bogotá, Colombia' },
  { icono: Clock, titulo: 'Horario de atención', texto: 'Lunes a sábado, 8:00 a. m. a 6:00 p. m.' },
];

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina
        titulo="Contáctanos"
        descripcion="¿Tienes preguntas o quieres unirte como proveedor aliado? Escríbenos y te responderemos pronto."
      />

      <div className="contacto">
        <div className="tarjeta contacto__formulario">
          {enviado ? (
            <div className="confirmacion">
              <CircleCheck size={48} strokeWidth={1.5} />
              <h2>Mensaje enviado</h2>
              <p className="texto-suave">Gracias por escribirnos. Nuestro equipo te responderá al correo que registraste.</p>
              <button className="boton" onClick={() => setEnviado(false)}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <FormularioContacto alEnviar={() => setEnviado(true)} />
          )}
        </div>

        <aside className="tarjeta contacto__datos">
          <h3>Información de contacto</h3>
          <ul className="datos-contacto">
            {DATOS_CONTACTO.map(({ icono: Icono, titulo, texto }) => (
              <li key={titulo}>
                <span className="pilar__icono">
                  <Icono size={20} />
                </span>
                <span className="celda-doble">
                  <strong>{titulo}</strong>
                  <small>{texto}</small>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
