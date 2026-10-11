import { Bird, Cat, Dog, Fish, PawPrint, Pencil, Rabbit, Trash2, Turtle } from 'lucide-react';

const ICONOS_ESPECIE = {
  Perro: Dog,
  Gato: Cat,
  Ave: Bird,
  Conejo: Rabbit,
  Pez: Fish,
  Reptil: Turtle,
};

function textoEdad(edad) {
  if (edad === null || edad === undefined || edad === '') return 'Edad sin registrar';
  return `${edad} ${Number(edad) === 1 ? 'año' : 'años'}`;
}

export default function TarjetaMascota({ mascota, alEditar, alEliminar }) {
  const Icono = ICONOS_ESPECIE[mascota.especie] ?? PawPrint;

  return (
    <article className="tarjeta tarjeta-item">
      <div className="tarjeta-item__cabeza">
        <span className="avatar">
          <Icono size={26} />
        </span>
        <div>
          <h3>{mascota.nombre}</h3>
          <span className="texto-suave">
            {mascota.especie}
            {mascota.raza && ` · ${mascota.raza}`}
          </span>
        </div>
      </div>

      <ul className="datos">
        <li>{textoEdad(mascota.edad)}</li>
      </ul>

      <div className="acciones">
        <button className="boton boton--secundario boton--pequeno" onClick={alEditar}>
          <Pencil size={15} />
          Editar
        </button>
        <button className="boton boton--peligro boton--pequeno" onClick={alEliminar}>
          <Trash2 size={15} />
          Eliminar
        </button>
      </div>
    </article>
  );
}
