import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
}

const Button: React.FC<ButtonProps> = ({ text, ...props }) => (
  <button
    {...props}
    style={{
      padding: '8px 16px',
      backgroundColor: '#0070f3',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    {text}
  </button>
)

export default Button
