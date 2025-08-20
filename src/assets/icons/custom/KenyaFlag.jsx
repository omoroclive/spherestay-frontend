// src/assets/icons/custom/KenyaFlag.jsx

// Named export (optional - choose one style)
export const KenyaFlag = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 60 30">
    <path d="M0 0h60v30H0z" fill="#000"/>
    <path d="M0 10h60v10H0z" fill="#fff"/>
    <path d="M0 12h60v6H0z" fill="#060"/>
    <path d="M30 15l-5.5-3.3-2.1 6.5 5.6-3.2 5.6 3.2-2.1-6.5z" fill="#b00"/>
    <path d="M24 15a6 6 0 1 0 12 0 6 6 0 0 0-12 0z" fill="#b00"/>
    <path d="M25 15a5 5 0 1 0 10 0 5 5 0 0 0-10 0z" fill="#fff"/>
    <path d="M27 15a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" fill="#b00"/>
    <path d="M0 0l20 15L0 30zm60 0L40 15l20 15z" fill="#000"/>
  </svg>
);

// Default export (recommended for consistency)
export default KenyaFlag;