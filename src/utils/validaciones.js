const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATRON_TELEFONO = /^[0-9+\s-]{7,15}$/;

export function esCorreoValido(correo) {
  return PATRON_CORREO.test(String(correo).trim());
}

export function esTelefonoValido(telefono) {
  return PATRON_TELEFONO.test(String(telefono).trim());
}

export function esContrasenaSegura(contrasena) {
  return contrasena.length >= 8 && /[A-Za-z]/.test(contrasena) && /\d/.test(contrasena);
}

export function estaVacio(valor) {
  return String(valor ?? '').trim() === '';
}
