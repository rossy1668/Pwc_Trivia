import { useState } from "react";
import "../assets/css/leyes.css";

const basePath = import.meta.env.BASE_URL;

const cards = [
  { tag: "Art. 4", title: "¿Qué es hostigamiento sexual?", text: "Conducta de naturaleza sexual o sexista no deseada que afecta la dignidad de la persona y crea un entorno intimidatorio, hostil o humillante." },
  { tag: "Art. 5", title: "Conductas tipificadas", text: "Promesas de beneficios laborales, amenazas, uso de lenguaje con contenido sexual, gestos, contacto físico no deseado y cualquier conducta de connotación sexual no solicitada." },
  { tag: "Art. 7", title: "Derechos de la víctima", text: "Ser escuchada con reserva, recibir orientación legal, no sufrir represalias y acceder a un proceso justo e imparcial dentro de la institución." },
  { tag: "Art. 8", title: "Obligaciones del empleador", text: "Investigar toda denuncia, sancionar al agresor, implementar políticas de prevención y garantizar un entorno laboral seguro para todos los colaboradores." },
  { tag: "Art. 9", title: "Plazos del proceso", text: "El empleador tiene 30 días hábiles para investigar y resolver desde la presentación formal de la denuncia. La víctima puede impugnar la decisión." },
  { tag: "Art. 10", title: "Sanciones al agresor", text: "Según la gravedad: amonestación, suspensión sin goce de haber o despido justificado. En casos graves puede derivarse a la vía penal." }
];

const faqs = [
  { question: "¿Necesito pruebas para denunciar?", answer: "No necesariamente. La ley reconoce que muchas situaciones de hostigamiento no dejan evidencia física. Tu testimonio es válido y el empleador tiene la obligación de investigar aunque no cuentes con pruebas materiales. Sin embargo, guardar capturas de mensajes, correos o registros de llamadas puede fortalecer tu caso." },
  { question: "¿Puedo denunciar de forma anónima?", answer: "Sí. PwC cuenta con el canal Ethics Helpline System donde puedes reportar de manera confidencial. Sin embargo, para iniciar un proceso formal de investigación se requiere identificación de la víctima o denunciante. Tu identidad estará protegida durante todo el proceso." },
  { question: "¿Qué pasa si el agresor es mi jefe directo?", answer: "Puedes denunciar directamente al área de Human Capital o usar el canal Ethics Helpline System, sin necesidad de pasar por tu jefe. La ley protege al denunciante de cualquier represalia laboral, y el empleador está obligado a investigar independientemente del cargo del denunciado." },
  { question: "¿El hostigamiento entre compañeros del mismo nivel también aplica?", answer: "Sí. La Ley N° 27942 no requiere que exista una relación de jerarquía. El hostigamiento sexual puede ocurrir entre compañeros del mismo nivel, de un subordinado hacia un superior, o incluso de personas externas a la empresa como clientes o proveedores." },
  { question: "¿Puedo ser sancionada por hacer una denuncia falsa?", answer: "La ley protege a quienes denuncian de buena fe, incluso si la investigación no resulta en sanción. Solo en casos de denuncia comprobadamente maliciosa y con intención de perjudicar a alguien podrían aplicarse consecuencias. Si crees que viviste una situación de hostigamiento, tienes el derecho de reportarla." }
];

export default function Leyes() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <section id="leyes-hero">
        <img src={`${basePath}assets/img/leyes-hero.jpg`} alt="Personas en una reunión profesional revisando documentos legales" />
        <div className="hero-overlay" />
        <h1 className="hero-title">Lo que dice la Ley</h1>
      </section>

      <section id="leyes-content">
        <p>
          En concordancia con la Ley N° 27942 de Prevención y Sanción del Hostigamiento Sexual,
          los empleadores públicos y privados tienen el deber de implementar medidas preventivas,
          investigar denuncias y sancionar a los agresores en entornos con o sin relación de
          subordinación. En casos de incumplimiento de estas normas por parte de la empresa,
          la víctima o un testigo puede denunciar en el área de RR.HH., Comité de Intervención
          frente al Hostigamiento Sexual, o a la autoridad designada en la institución. Después,
          se abrirá un proceso de investigación para recoger la versión de la víctima, del
          denunciado y de testigos, así como pruebas (mensajes, correos, videos, etc.).
        </p>
      </section>

      <div id="leyes-highlight">
        <p>
          Si el empleador no investiga o no sanciona, puede ser sancionado por la autoridad
          de trabajo (SUNAFIL) con multas administrativas.
        </p>
      </div>

      <section id="leyes-cards">
        <h2>Artículos clave de la Ley N° 27942</h2>
        <div className="cards-grid">
          {cards.map((card) => (
            <article key={card.tag} className="card">
              <span className="card-tag">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="leyes-accordion">
        <h2>Preguntas frecuentes</h2>
        {faqs.map((item, index) => (
          <div key={item.question} className="accordion-item">
            <button
              type="button"
              className={`accordion-btn ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              {item.question}
              <span className="icon">+</span>
            </button>
            <div className="accordion-body" style={{ maxHeight: openIndex === index ? "300px" : "0" }}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
