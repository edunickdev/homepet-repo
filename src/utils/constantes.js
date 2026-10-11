import { Bath, Flower2, GraduationCap, Sparkles, Stethoscope, Syringe } from 'lucide-react';

export const CATEGORIAS = [
  { id: 'salud', nombre: 'Salud veterinaria', icono: Stethoscope },
  { id: 'vacunacion', nombre: 'Vacunación', icono: Syringe },
  { id: 'estetica', nombre: 'Estética y baño', icono: Bath },
  { id: 'relajacion', nombre: 'Relajación y spa', icono: Sparkles },
  { id: 'entrenamiento', nombre: 'Entrenamiento', icono: GraduationCap },
  { id: 'funeraria', nombre: 'Servicios funerarios', icono: Flower2 },
];

export const ESPECIES = ['Perro', 'Gato', 'Ave', 'Conejo', 'Hámster', 'Pez', 'Reptil', 'Otro'];

export const ESTADOS_PROVEEDOR = [
  { id: 'pendiente', nombre: 'Pendiente' },
  { id: 'activo', nombre: 'Activo' },
  { id: 'suspendido', nombre: 'Suspendido' },
];

export const DISPONIBILIDAD_SERVICIO = [
  { id: 'disponible', nombre: 'Disponible' },
  { id: 'no_disponible', nombre: 'No disponible' },
];

export const ROLES_USUARIO = [
  { id: 'propietario', nombre: 'Propietario' },
  { id: 'administrador', nombre: 'Administrador' },
];

export const ROLES = {
  propietario: 'Propietario',
  proveedor: 'Proveedor aliado',
  administrador: 'Administrador',
};

export function buscarCategoria(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id) ?? CATEGORIAS[0];
}

export function nombreDe(lista, id) {
  return lista.find((item) => item.id === id)?.nombre ?? id;
}
