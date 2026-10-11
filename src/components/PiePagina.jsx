import { Link } from 'react-router-dom';

export default function PiePagina() {
  return (
    <footer className="pie">
      <div className="contenedor pie__fila">
        <div>
          <strong>Home Pet</strong>
          <p>Bienestar animal a domicilio</p>
          <small>Proyecto HP-2026-01 · Politécnico Grancolombiano · Ingeniería de Software</small>
        </div>
        <nav className="pie__enlaces">
          <Link to="/servicios">Servicios</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/registro">Crear cuenta</Link>
        </nav>
      </div>
    </footer>
  );
}
