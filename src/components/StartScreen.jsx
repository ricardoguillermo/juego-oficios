import { useState, useEffect } from "react";
import "../../src/styles/startScreen.css";

const jugadoresBase = ["Brunita", "Thiaguito", "Máximo", "Abuela", "Abuelo"];

export default function StartScreen({ setJugadorSeleccionado, setFase }) {
  const [nombre, setNombre] = useState("");
  const [jugadoresExtras, setJugadoresExtras] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("jugadoresExtras")) || [];
    setJugadoresExtras(guardados);
  }, []);

  const todos = [...jugadoresBase, ...jugadoresExtras];

  const agregarJugador = () => {
    if (nombre.trim()) {
      const nuevo = [...jugadoresExtras, nombre.trim()];
      setJugadoresExtras(nuevo);
      setNombre("");
      localStorage.setItem("jugadoresExtras", JSON.stringify(nuevo));
    }
  };

  const comenzar = () => {
    if (seleccionado !== null) {
      setJugadorSeleccionado(todos[seleccionado]);
      setFase("game");
    }
  };

  return (
    <div className="start-container">
      <h1>🎮 Juego de Oficios</h1>
      <input
        type="text"
        placeholder="Agregar jugador"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={agregarJugador}>Agregar</button>

      <h2>Jugadores</h2>
      <div className="jugadores-lista">
        {todos.map((j, i) => (
          <div
            key={i}
            className={`jugador ${seleccionado === i ? "seleccionado" : ""}`}
            onClick={() => setSeleccionado(i)}
          >
            {j}
          </div>
        ))}
      </div>

      <button onClick={comenzar} disabled={seleccionado === null}>
        🚀 Comenzar
      </button>
      <footer class="footer-oficios">
        <p>👵🏼 Abuela Betty &nbsp; y &nbsp; 👴🏻 Abuelo Ricardo</p>
        <small>
          Con cariño para que los nietos y abuelos jueguen juntos ❤️
        </small>
      </footer>
    </div>
  );
}
