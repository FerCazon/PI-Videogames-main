import React from 'react';

const InputField = ({ label, name, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input name={name} value={value} onChange={onChange} />
    </div>
  );
};

export default InputField;
