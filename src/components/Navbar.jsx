import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <a href="#home" className="logo">Retaj.</a>
      <ul className="links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;