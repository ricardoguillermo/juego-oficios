import { useEffect, useState, useRef } from "react";
import datos from "../datos.json";
import "../../src/styles/game.css";
// import { useEffect, useRef } from "react";
const TOTAL_RONDAS = 10;

export default function Game({ jugador, setFase }) {
  const [ronda, setRonda] = useState(1);
  const [aciertos, setAciertos] = useState(0);
  const [actual, setActual] = useState(null);
  const [seleccion, setSeleccion] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);

  const yaHablo = useRef(false); // Solo habla una vez

  useEffect(() => {
    if (!yaHablo.current) {
      hablar("Relaciona la imagen con el oficio");
      yaHablo.current = true;
    }
  }, []);

  /*  const elegirAleatorio = () => {
    const random = datos[Math.floor(Math.random() * datos.length)];
    setActual(random);
  }; */

  const elegirAleatorio = () => {
    const random = datos[Math.floor(Math.random() * datos.length)];

    const opciones = [...random.opciones]; // Suponiendo que es un array
    const opcionesMezcladas = mezclarArray(opciones);
    console.log(opcionesMezcladas);

    setActual({
      ...random,
      opciones: opcionesMezcladas,
    });
  };

  useEffect(() => {
    elegirAleatorio();
  }, []);

  function mezclarArray(array) {
    return array
      .map((valor) => ({ valor, orden: Math.random() }))
      .sort((a, b) => a.orden - b.orden)
      .map(({ valor }) => valor);
  }

  const hablar = (texto, callback) => {
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-ES";
    setBloqueado(true);
    voz.onend = () => {
      setBloqueado(false);
      if (callback) callback();
    };
    window.speechSynthesis.speak(voz);
  };

  /*  useEffect(() => {
    hablar("¿Qué imagen relacionas con este oficio?");
  }, []); */

  const verificar = (herramienta) => {
    if (bloqueado) return;

    setSeleccion(herramienta);
    const esCorrecto = herramienta === actual.herramientaCorrecta;
    if (esCorrecto) setAciertos((a) => a + 1);

    const texto = esCorrecto ? "¡Correcto!" : actual.textoExplicacion;
    hablar(texto, () => {
      setTimeout(() => {
        if (ronda < TOTAL_RONDAS) {
          setRonda(ronda + 1);
          setSeleccion(null);
          elegirAleatorio();
        } else {
          finalizarJuego();
        }
      }, 500);
    });
  };

  const finalizarJuego = () => {
    const porcentaje = Math.round((aciertos / (TOTAL_RONDAS - 1)) * 100);
    let mensaje = "";
    let vozTexto = "";

    if (porcentaje > 90) {
      mensaje = "🏆 ¡Excelente trabajo!";
      vozTexto = "¡Sos un crack, lo hiciste genial!";
    } else if (porcentaje > 70) {
      mensaje = "👏 ¡Muy bien!";
      vozTexto = "¡Muy bien, lo hiciste genial!";
    } else if (porcentaje > 50) {
      mensaje = "👍 ¡Bien hecho!";
      vozTexto = "¡Bien hecho, seguilo intentando!";
    } else {
      mensaje = "💪 ¡Ánimo!";
      vozTexto = "Vamos muy bien, no te detengas";
    }

    hablar(vozTexto, () => {
      setResultadoFinal({ porcentaje, mensaje });
      setMostrarResultado(true);
    });
  };

  if (mostrarResultado && resultadoFinal) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>{resultadoFinal.mensaje}</h2>
        <p>Obtuviste {resultadoFinal.porcentaje}% de respuestas correctas</p>
        <button onClick={() => setFase("start")}>🏠 Volver al inicio</button>
      </div>
    );
  }

  if (!actual) return <p>Cargando...</p>;

  return (
    <div className="game-container" style={{ textAlign: "center" }}>
      <h2>Turno de: {jugador}</h2>
      <p>
        Ronda {ronda} de {TOTAL_RONDAS}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <img
          src={actual.imagenOficio}
          alt={actual.oficio}
          style={{ width: "80px", height: "80px" }}
        />
        <h3>{actual.oficio}</h3>
      </div>
      <p>¿Que imagen relacionas con este oficio?</p>
      <div>
        {actual.opciones.map((herramienta, i) => (
          <div
            key={i}
            onClick={() => verificar(herramienta)}
            style={{
              cursor: bloqueado ? "not-allowed" : "pointer",
              opacity: bloqueado ? 0.5 : 1,
              display: "inline-block",
              margin: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={"/img/" + herramienta.toLowerCase() + ".png"}
              alt={herramienta}
              style={{ width: "100px", height: "100px" }}
            />
            <div>{herramienta}</div>
          </div>
        ))}
        <button onClick={() => setFase("start")}>🏠 Volver al inicio</button>
      </div>
      {bloqueado && (
        <p style={{ color: "gray", marginTop: "1rem" }}>
          ⏳ Espera a que termine la explicación...
        </p>
      )}
    </div>
  );
}
