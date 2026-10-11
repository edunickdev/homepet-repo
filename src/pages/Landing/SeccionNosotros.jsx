import { CircleCheck, Eye, HeartHandshake, Target } from 'lucide-react';

const LO_QUE_HACEMOS = [
  'Reunimos en un solo lugar la oferta de proveedores aliados verificados.',
  'Facilitamos el agendamiento a domicilio según la disponibilidad de cada proveedor.',
  'Gestionamos el pago de cada servicio de forma organizada y segura.',
  'Damos a los proveedores una vitrina digital para llegar a más hogares.',
];

const PILARES = [
  {
    icono: Target,
    titulo: 'Misión',
    texto: 'Facilitar el acceso a servicios de bienestar animal confiables, sin que las familias tengan que salir de casa.',
  },
  {
    icono: Eye,
    titulo: 'Visión',
    texto: 'Ser la plataforma de referencia en Colombia para el cuidado de mascotas a domicilio.',
  },
  {
    icono: HeartHandshake,
    titulo: 'Valores',
    texto: 'Confianza, bienestar animal, transparencia y compromiso con nuestros proveedores aliados.',
  },
];

export default function SeccionNosotros() {
  return (
    <section className="contenedor seccion" id="nosotros">
      <div className="nosotros">
        <div>
          <span className="etiqueta-seccion">Quiénes somos</span>
          <h2>Conectamos a las mascotas con quienes mejor las cuidan</h2>
          <p>
            Home Pet es una plataforma digital que une a los dueños de mascotas con proveedores aliados de servicios de
            bienestar animal a domicilio: médicos veterinarios, esteticistas, entrenadores y servicios funerarios.
          </p>
          <p>
            Nacimos para resolver un problema común: estos servicios suelen prestarse de forma independiente, sin un canal
            confiable donde encontrarlos, agendarlos y pagarlos. Nosotros los reunimos en un solo lugar.
          </p>
        </div>

        <div className="tarjeta nosotros__hacemos">
          <h3>Lo que hacemos</h3>
          <ul className="lista-check">
            {LO_QUE_HACEMOS.map((texto) => (
              <li key={texto}>
                <CircleCheck size={20} />
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pilares">
        {PILARES.map(({ icono: Icono, titulo, texto }) => (
          <article key={titulo} className="tarjeta pilar">
            <span className="pilar__icono">
              <Icono size={24} />
            </span>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
