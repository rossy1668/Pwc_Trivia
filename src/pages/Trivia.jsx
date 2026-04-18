import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import "../assets/css/trivia.css";
import { saveTriviaResult } from "../firebase";
import AnalyticsDashboard from "./AnalyticsDashboard";

const preguntas = [
  {
    pregunta: "¿Los mensajes de tu jefe fuera del horario laboral comentando tu apariencia constituyen hostigamiento sexual laboral?",
    opciones: ["A) Sí, siempre", "B) No, porque es fuera del trabajo", "C) Solo si se repiten varias veces"],
    correcta: 0
  },
  {
    pregunta: "Si tu jefe te asigna tareas difíciles porque no respondiste sus mensajes personales, ¿eso forma parte del hostigamiento?",
    opciones: ["A) No, es una decisión laboral normal", "B) Sí, es una represalia y agrava el hostigamiento", "C) Solo si lo hace más de una vez"],
    correcta: 1
  },
  {
    pregunta: "Un compañero manda memes con contenido sexual al grupo del trabajo. ¿Es hostigamiento aunque diga que es un chiste?",
    opciones: ["A) No, si era una broma no cuenta", "B) Depende de si alguien se queja", "C) Sí, el contenido sexual no deseado siempre está tipificado"],
    correcta: 2
  },
  {
    pregunta: "Tu compañera te dice que los memes le incomodan y él responde 'no seas tan sensible'. ¿Eso es parte del hostigamiento?",
    opciones: ["A) No, solo es una opinión", "B) Sí, invalidar la incomodidad de la víctima refuerza el hostigamiento", "C) Depende del tipo de meme"],
    correcta: 1
  },
  {
    pregunta: "Tu supervisor abraza a todas sus colaboradoras al llegar. A algunas no les molesta pero a otras sí. ¿Es hostigamiento?",
    opciones: ["A) No, porque lo hace con todas por igual", "B) Solo si alguien se queja formalmente", "C) Sí, el contacto físico no solicitado puede ser hostigamiento"],
    correcta: 2
  },
  {
    pregunta: "Nadie ha dicho nada sobre los abrazos por miedo a represalias. ¿El silencio significa que no hay hostigamiento?",
    opciones: ["A) Sí, si nadie se queja no hay problema", "B) No, el silencio por miedo no es consentimiento", "C) Depende de cuánto tiempo lleva pasando"],
    correcta: 1
  },
  {
    pregunta: "En una reunión el gerente le dice a María 'con esa sonrisa consigues cualquier cliente'. ¿Es hostigamiento?",
    opciones: ["A) No, es un cumplido profesional", "B) Sí, reducir el valor profesional al físico es una conducta tipificada", "C) Solo si María se siente mal"],
    correcta: 1
  },
  {
    pregunta: "¿El hecho de que el comentario sea en público frente a colegas lo hace menos grave?",
    opciones: ["A) Sí, en público no puede ser hostigamiento", "B) No cambia nada, el hostigamiento ocurre en público o en privado", "C) Depende de la reacción de los colegas"],
    correcta: 1
  },
  {
    pregunta: "Jorge le da palmadas en el hombro a Luis como gesto de amistad y a Luis no le molesta. ¿Es hostigamiento?",
    opciones: ["A) Sí, cualquier contacto físico es hostigamiento", "B) No, el contacto aceptado entre pares sin connotación sexual no lo es", "C) Depende de la frecuencia"],
    correcta: 1
  },
  {
    pregunta: "Luis le dice a Jorge que ya no quiere ese contacto pero Jorge continúa. ¿Cambia la situación?",
    opciones: ["A) No, si antes era aceptado no puede cambiar", "B) Solo cambia si hay testigos", "C) Sí, ignorar el límite expresado puede constituir hostigamiento"],
    correcta: 2
  }
];

export default function Trivia() {
  const [user] = useAuthState(auth);

  // Lista de emails de RH autorizados
  const approvedHrEmails = [
    "rrhh@pwc.com",
    "rh@pwc.com",
    "rh@empresa.com"
  ];

  const isHrUser = user?.email ? approvedHrEmails.includes(user.email.toLowerCase()) : false;

  // Si es usuario de RH, mostrar dashboard analítico
  if (isHrUser) {
    return <AnalyticsDashboard user={user} />;
  }

  // Componente de trivia normal para usuarios regulares
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answerState, setAnswerState] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saved, setSaved] = useState(false);

  const currentQuestion = preguntas[currentIndex];
  const answered = selectedIndex !== null;
  const progress = Math.round(((currentIndex + 1) / preguntas.length) * 100);
  const resultLink = score < 5 ? "/leyes" : "/guia";
  const resultButtonText = score < 5 ? "Revisar leyes" : "Ver guía de acción";
  const resultDescription = score > 7
    ? "Has demostrado un buen entendimiento de los derechos y los límites en el ámbito laboral."
    : score > 4
      ? "La prevención comienza con la información; revisa la guía y la sección de leyes para reforzar lo aprendido."
      : "La prevención comienza con la información; revisa la sección de leyes para reforzar lo aprendido.";

  useEffect(() => {
    if (!showResult || saved) return;

    saveTriviaResult(score, preguntas.length)
      .then(() => {
        setSaveMessage('Resultado guardado en Firebase.');
        setSaved(true);
      })
      .catch(() => {
        setSaveMessage('No se pudo guardar el resultado. Inicia sesión para registrar.');
      });
  }, [showResult, saved, score]);

  const responder = (index) => {
    if (answered) return;

    setSelectedIndex(index);
    const isCorrect = index === currentQuestion.correcta;

    if (isCorrect) {
      setScore(score + 1);
      setAnswerState("correct");
    } else {
      setAnswerState("wrong");
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < preguntas.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
      setAnswerState("");
    } else {
      setShowResult(true);
    }
  };

  const reiniciarTrivia = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedIndex(null);
    setAnswerState("");
    setShowResult(false);
    setSaveMessage('');
    setSaved(false);
  };

  return (
    <div id="trivia-wrapper">
      <section id="trivia-section" className={showResult ? "blurred" : ""}>
        <div id="trivia-bg" />

        <div id="progress-bar-wrap">
          <div id="progress-bar">
            <div id="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div id="trivia-card">
          <p id="trivia-label">Pregunta {currentIndex + 1} de {preguntas.length}</p>
          <h2 id="trivia-question">{currentQuestion.pregunta}</h2>

          <div className="trivia-options">
            {currentQuestion.opciones.map((option, index) => {
              const isCorrect = index === currentQuestion.correcta;
              const isSelected = index === selectedIndex;
              const classes = ["trivia-option"];

              if (answered) {
                if (isCorrect) classes.push("correct");
                else if (isSelected) classes.push("wrong");
                else classes.push("disabled");
              }

              return (
                <button
                  key={index}
                  type="button"
                  className={classes.join(" ")}
                  onClick={() => responder(index)}
                  disabled={answered}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              );
            })}
          </div>

          <div id="trivia-feedback" className={answerState}>
            {answerState === "correct" && "¡Muy bien! Has seleccionado la respuesta correcta."}
            {answerState === "wrong" && "Esa no es la respuesta correcta. Sigue aprendiendo para avanzar."}
          </div>

          <button
            id="btn-siguiente"
            type="button"
            onClick={handleNext}
            style={{ display: answered ? "block" : "none" }}
          >
            {currentIndex + 1 < preguntas.length ? "Siguiente pregunta →" : "Ver resultados"}
          </button>
        </div>
      </section>

      <section id="resultado-section" className={showResult ? "visible" : ""}>
        <div className="resultado-card">
          <div className="resultado-emoji">{score > 7 ? "🏆" : "💪"}</div>
          <div className="resultado-puntaje">{score} / {preguntas.length}</div>
          <div className="resultado-perfil">
            {score > 7 ? "¡Excelente desempeño!" : score > 4 ? "Buen esfuerzo, sigue informándote." : "Te invitamos a revisar más recursos y leyes."}
          </div>
          <p className="resultado-desc">
            {score > 7
              ? "Has demostrado un buen entendimiento de los derechos y los límites en el ámbito laboral."
              : "La prevención comienza con la información; revisa la guía y la sección de leyes para reforzar lo aprendido."}
          </p>
          {saveMessage && <p className="resultado-desc">{saveMessage}</p>}
          <div className="resultado-btns">
            <button className="btn btn-primary" type="button" onClick={reiniciarTrivia}>
              Jugar de nuevo
            </button>
            <Link to={resultLink} className="btn btn-outline">{resultButtonText}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
