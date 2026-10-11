import { useState } from 'react';

export function useFormulario(valoresIniciales, validar) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  function cambiar(evento) {
    const { name, value } = evento.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: '' }));
  }

  function esValido() {
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  return { valores, errores, cambiar, esValido, setValores };
}
