import { useState } from "react";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import "./index.css";

export default function App() {
  const [fase, setFase] = useState("start");
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

  return (
    <div>
      {fase === "start" && (
        <StartScreen
          setJugadorSeleccionado={setJugadorSeleccionado}
          setFase={setFase}
        />
      )}
      {fase === "game" && (
        <Game jugador={jugadorSeleccionado} setFase={setFase} />
      )}
    </div>
  );
}
