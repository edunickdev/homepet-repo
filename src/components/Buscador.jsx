import { Search } from 'lucide-react';

export default function Buscador({ valor, alCambiar, placeholder = 'Buscar...' }) {
  return (
    <label className="buscador">
      <Search size={18} />
      <input
        type="search"
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </label>
  );
}
