import React from 'react';

function SelectField({ label, name, value, options, onChange }) {
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          multiple={true}
          className="form-control"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  

export default SelectField;
