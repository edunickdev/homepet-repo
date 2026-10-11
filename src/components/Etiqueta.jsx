export default function Etiqueta({ estado, children }) {
  return <span className={`etiqueta etiqueta--${estado}`}>{children}</span>;
}
