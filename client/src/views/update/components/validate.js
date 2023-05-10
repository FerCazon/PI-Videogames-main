export const validate = (input, error) => {
    let errors = { ...error };
  
    // Validacion que el nombre no tenga simbolos
    if (!/^[\w\s]+$/.test(input.name)) {
      errors.name = 'Name should not contain symbols.';
    } else {
      errors.name = '';
    }
  
    // que el puntajeno llegue mas de 5
    if (input.rating > 5 || input.rating < 0) {
      errors.rating = 'Rating should be between 0 and 5.';
    } else {
      errors.rating = '';
    }
  
    return errors;
  };
  