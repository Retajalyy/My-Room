import Room3D from "../components/Room3D";
import "./Home.css";

function Home() {
  return (
    <section id="home" className="home">
      <div className="room-wrap">
        <Room3D />
      </div>
    </section>
  );
}

export default Home;