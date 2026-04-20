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
    correcta: 0,
    explicacion: "Según la Ley contra el Hostigamiento Sexual, el hostigamiento NO se limita al horario laboral. Los comentarios sobre apariencia fuera del horario pueden constituir acoso porque crean un ambiente intimidante y afectan el desempeño laboral. La intención es controlar o discriminar a la persona, sin importar cuándo ocurra."
  },
  {
    pregunta: "Si tu jefe te asigna tareas difíciles porque no respondiste sus mensajes personales, ¿eso forma parte del hostigamiento?",
    opciones: ["A) No, es una decisión laboral normal", "B) Sí, es una represalia y agrava el hostigamiento", "C) Solo si lo hace más de una vez"],
    correcta: 1,
    explicacion: "Las represalias por rechazar avances son un componente grave del hostigamiento. Si el jefe castiga profesionalmente a quien no responde a sus mensajes personales, viola el Código Laboral que protege contra represalias. Las consecuencias laborales negativas por rechazar conductas inapropiadas constituyen abuso de poder."
  },
  {
    pregunta: "Un compañero manda memes con contenido sexual al grupo del trabajo. ¿Es hostigamiento aunque diga que es un chiste?",
    opciones: ["A) No, si era una broma no cuenta", "B) Depende de si alguien se queja", "C) Sí, el contenido sexual no deseado siempre está tipificado"],
    correcta: 2,
    explicacion: "La intención de bromear NO exime de responsabilidad. La Ley protege contra conductas de naturaleza sexual no deseadas, independientemente de si se presenta como broma. El contenido sexual en espacios laborales crea un ambiente hostil y puede afectar a todos los miembros del grupo."
  },
  {
    pregunta: "Tu compañera te dice que los memes le incomodan y él responde 'no seas tan sensible'. ¿Eso es parte del hostigamiento?",
    opciones: ["A) No, solo es una opinión", "B) Sí, invalidar la incomodidad de la víctima refuerza el hostigamiento", "C) Depende del tipo de meme"],
    correcta: 1,
    explicacion: "Continuar la conducta después de que se expresó incomodidad, y además minimizar los sentimientos de la persona, constituye una escalada del hostigamiento. La Ley considera tanto la conducta original como la respuesta invalidante como parte del patrón abusivo. Ignorar los límites expresados agrava la situación."
  },
  {
    pregunta: "Tu supervisor abraza a todas sus colaboradoras al llegar. A algunas no les molesta pero a otras sí. ¿Es hostigamiento?",
    opciones: ["A) No, porque lo hace con todas por igual", "B) Solo si alguien se queja formalmente", "C) Sí, el contacto físico no solicitado puede ser hostigamiento"],
    correcta: 2,
    explicacion: "El contacto físico sin consentimiento es hostigamiento, sin importar que sea 'igual para todas'. La Ley se centra en la percepción de la víctima y su derecho a la integridad personal. El hecho de que afecte a unas sí y a otras no prueba que es inapropiado para quienes lo rechacen. No es necesario consentimiento formal previo."
  },
  {
    pregunta: "Nadie ha dicho nada sobre los abrazos por miedo a represalias. ¿El silencio significa que no hay hostigamiento?",
    opciones: ["A) Sí, si nadie se queja no hay problema", "B) No, el silencio por miedo no es consentimiento", "C) Depende de cuánto tiempo lleva pasando"],
    correcta: 1,
    explicacion: "El silencio por temor a represalias NO indica consentimiento. Las víctimas de hostigamiento frecuentemente guardan silencio por miedo a perder el trabajo o enfrentar consecuencias. La Ley reconoce que el silencio puede ser una respuesta de supervivencia, no aceptación. La empresa tiene el deber de vigilar y prevenir, no solo de esperar denuncias."
  },
  {
    pregunta: "En una reunión el gerente le dice a María 'con esa sonrisa consigues cualquier cliente'. ¿Es hostigamiento?",
    opciones: ["A) No, es un cumplido profesional", "B) Sí, reducir el valor profesional al físico es una conducta tipificada", "C) Solo si María se siente mal"],
    correcta: 1,
    explicacion: "Reducir el valor o desempeño de una trabajadora a su apariencia física, especialmente en público, es una conducta típica de hostigamiento sexual. Aunque se presente como 'cumplido', la Ley reconoce que estos comentarios crean un ambiente donde la persona es valorada por su cuerpo, no su trabajo. Es discriminación de género."
  },
  {
    pregunta: "¿El hecho de que el comentario sea en público frente a colegas lo hace menos grave?",
    opciones: ["A) Sí, en público no puede ser hostigamiento", "B) No cambia nada, el hostigamiento ocurre en público o en privado", "C) Depende de la reacción de los colegas"],
    correcta: 1,
    explicacion: "El hostigamiento en público puede ser IGUAL O MÁS grave porque humilla a la víctima frente a colegas, afectando su reputación profesional y aislándola. El lugar es irrelevante; lo que importa es si la conducta es no deseada y crea un ambiente intimidante. De hecho, el público amplifica el daño psicológico."
  },
  {
    pregunta: "Jorge le da palmadas en el hombro a Luis como gesto de amistad y a Luis no le molesta. ¿Es hostigamiento?",
    opciones: ["A) Sí, cualquier contacto físico es hostigamiento", "B) No, el contacto aceptado entre pares sin connotación sexual no lo es", "C) Depende de la frecuencia"],
    correcta: 1,
    explicacion: "El contacto físico consensuado entre compañeros que aceptan y disfrutan mutuamente NO es hostigamiento. La Ley se enfoca en conductas NO DESEADAS. Un abrazo de amistad aceptado es diferente de uno impuesto. El hostigamiento requiere que sea rechazado o que cause incomodidad."
  },
  {
    pregunta: "Luis le dice a Jorge que ya no quiere ese contacto pero Jorge continúa. ¿Cambia la situación?",
    opciones: ["A) No, si antes era aceptado no puede cambiar", "B) Solo cambia si hay testigos", "C) Sí, ignorar el límite expresado puede constituir hostigamiento"],
    correcta: 2,
    explicacion: "Una vez que se establece un límite verbal, continuar viola ese derecho. Aunque antes fuera aceptado, el NO explícito debe ser respetado. La Ley protege el derecho a cambiar de opinión. Ignorar un límite establecido constituye acoso intencional y puede escalar hacia represalias si el infractor tiene poder sobre el otro."
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

  if (isHrUser) {
    return <AnalyticsDashboard />;
  }

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
            <div className="feedback-header">
              {answerState === "correct" && "✅ ¡Muy bien! Has seleccionado la respuesta correcta."}
              {answerState === "wrong" && "❌ Esa no es la respuesta correcta."}
            </div>
            {answered && (
              <div className="feedback-explanation">
                <h4>📋 Explicación basada en la ley:</h4>
                <p>{currentQuestion.explicacion}</p>
              </div>
            )}
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
