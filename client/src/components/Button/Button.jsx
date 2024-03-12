export default function Button({ customClass, children }) {
  return <button className={`${customClass}`}>{children}</button>;
}
