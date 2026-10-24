import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/about";
import Projects from "./pages/Projects";
import Contact from "./pages/contact";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Projects />
            <Contact />
    </>
  );
}

export default App;