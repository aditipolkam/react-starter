import React from 'react'

const Input = ({ value, setNewValue, placeholder }:{value:string, setNewValue:Function, placeholder:string}) => {
  return (
    <input
    value={value}
    onChange={(e) => setNewValue(e.target.value)}
    type="text"
    className="text-input"
    placeholder={placeholder}
  />
  )
}

export default Input