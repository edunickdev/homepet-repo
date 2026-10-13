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

export const ESTADOS_RESERVA = [
  { id: 'pendiente', nombre: 'Pendiente' },
  { id: 'confirmada', nombre: 'Confirmada' },
  { id: 'pagada', nombre: 'Pagada' },
  { id: 'completada', nombre: 'Completada' },
  { id: 'cancelada', nombre: 'Cancelada' },
];

export const ESTADOS_PAGO = [
  { id: 'aprobado', nombre: 'Aprobado' },
  { id: 'pendiente', nombre: 'Pendiente' },
  { id: 'rechazado', nombre: 'Rechazado' },
];

export const TIPOS_REPORTE = [
  { id: 'ingresos_comisiones', nombre: 'Ingresos y comisiones' },
  { id: 'servicios_demandados', nombre: 'Servicios más demandados' },
  { id: 'rendimiento_proveedores', nombre: 'Rendimiento de proveedores' },
  { id: 'estado_reservas', nombre: 'Estado de reservas' },
];

export const METODOS_PAGO = [
  'Tarjeta de crédito',
  'Tarjeta débito',
  'PSE (Transferencia bancaria)',
  'Nequi / Daviplata',
];

export function buscarCategoria(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id) ?? CATEGORIAS[0];
}

export function nombreDe(lista, id) {
  return lista.find((item) => item.id === id)?.nombre ?? id;
}
