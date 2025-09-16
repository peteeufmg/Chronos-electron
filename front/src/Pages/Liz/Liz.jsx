import React, { useState, useEffect, useRef } from "react";
import Button from "../../Components/Button";

function Cronometro() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(0);
  const [progress, setProgress] = useState(0);

  // Cronômetro suave
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(elapsed);

        // Barra de progresso entre 3s e 5s
        if (elapsed >= 0) {
          setProgress(Math.min(elapsed / 50, 100));
        } else {
          setProgress(0);
        }
      }, 50); // atualização a cada 50ms
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const onStart = () => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - time;
    setIsRunning(true);
  };

  const onStop = () => setIsRunning(false);

  const onReset = () => {
    onStop();
    setTime(0);
    setProgress(0);
  };

  // Formata MM:SS:CS (centésimos)
  const mlsToString = (time) => {
    const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
    const centiseconds = String(Math.floor((time % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${centiseconds}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {/* Cronômetro grande com fonte monoespaçada */}
      <h2 style={{width: 360,  marginTop: 0, fontSize: "5rem" }}>
        {mlsToString(time)}
      </h2>

      {/* Botões */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", marginBottom:"1.5rem"}}>
        <Button type="Play" text="Play" onClick={onStart} />
        <Button type="Pause" text="Pause" onClick={onStop} />
        <Button type="Restart" text="Reset" onClick={onReset} />
      </div>

      {/* Barra de progresso */}
      <div style={{ width: "70%", height: "20px", backgroundColor: "#ddd", borderRadius: "10px" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#ffcc00",
            borderRadius: "10px",
            transition: "width 0.05s linear"
          }}
        />
      </div>
    </div>
  );
}

export default Cronometro;
