export const validate = (input, error) => {
    let errors = { ...error };
  
    // Check if the name contains any symbols
    if (!/^[\w\s]+$/.test(input.name)) {
      errors.name = 'Name should not contain symbols.';
    } else {
      errors.name = '';
    }
  
    // Ensure the rating value is between 0 and 5
    if (input.rating > 5 || input.rating < 0) {
      errors.rating = 'Rating should be between 0 and 5.';
    } else {
      errors.rating = '';
    }
  
    return errors;
  };
  