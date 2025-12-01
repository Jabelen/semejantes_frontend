import './FloatingButton.css'

export default function FloatingButton({ onClick, children }) {
  return (
    <a className="floating-button" href = '/base'>
      {children || "+"}
    </a>
  );
}
