import { CATEGORIAS } from '../../utils/constantes';

export default function FiltroCategorias({ seleccionada, alCambiar }) {
  return (
    <div className="chips" role="group" aria-label="Filtrar por categoría">
      <button className={`chip ${seleccionada === '' ? 'chip--activo' : ''}`} onClick={() => alCambiar('')}>
        Todas
      </button>
      {CATEGORIAS.map(({ id, nombre, icono: Icono }) => (
        <button key={id} className={`chip ${seleccionada === id ? 'chip--activo' : ''}`} onClick={() => alCambiar(id)}>
          <Icono size={16} />
          {nombre}
        </button>
      ))}
    </div>
  );
}
