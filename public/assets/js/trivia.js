    // ── Preguntas ──
    const preguntas = [
      {
        pregunta: "¿Los mensajes de tu jefe fuera del horario laboral comentando tu apariencia constituyen hostigamiento sexual laboral?",
        opciones: ["Sí, siempre", "No, porque es fuera del trabajo", "Solo si se repiten varias veces"],
        correcta: 0,
        feedback: "✅ Correcto. Los mensajes de contenido sexual o personal no solicitados son una conducta tipificada en la Ley 27942, sin importar el horario.",
        feedbackWrong: "❌ Incorrecto. Aunque sea fuera del horario, los mensajes de contenido sexual no solicitados sí constituyen hostigamiento según la Ley 27942."
      },
      {
        pregunta: "Si tu jefe te asigna las tareas más difíciles porque no respondiste sus mensajes personales, ¿eso forma parte del hostigamiento?",
        opciones: ["No, es una decisión laboral normal", "Sí, es una represalia que agrava el hostigamiento", "Solo si lo hace más de una vez"],
        correcta: 1,
        feedback: "✅ Correcto. Las represalias laborales por no ceder ante conductas de hostigamiento agravan la situación y también están tipificadas.",
        feedbackWrong: "❌ Incorrecto. Usar el poder laboral para castigar a quien no responde a insinuaciones es una represalia, lo cual agrava el hostigamiento."
      },
      {
        pregunta: "Un compañero manda memes con contenido sexual al grupo de trabajo. ¿Es hostigamiento aunque diga que es un chiste?",
        opciones: ["No, si era una broma no cuenta", "Depende de si alguien se queja formalmente", "Sí, el contenido sexual no deseado siempre está tipificado"],
        correcta: 2,
        feedback: "✅ Correcto. La intención no define si es hostigamiento. El contenido sexual no deseado en el entorno laboral está tipificado independientemente del tono.",
        feedbackWrong: "❌ Incorrecto. Que sea una broma no lo hace aceptable. La Ley 27942 tipifica el contenido sexual no deseado sin importar la intención."
      },
      {
        pregunta: "Tu compañera le dice que los memes le incomodan y él responde 'no seas tan sensible'. ¿Eso es parte del hostigamiento?",
        opciones: ["No, solo es una opinión personal", "Sí, invalidar la incomodidad de la víctima refuerza el hostigamiento", "Depende del tipo de meme"],
        correcta: 1,
        feedback: "✅ Correcto. Minimizar o invalidar la reacción de quien se siente hostigada es una conducta que refuerza el hostigamiento.",
        feedbackWrong: "❌ Incorrecto. Decirle a alguien que 'no sea sensible' cuando expresa incomodidad ante conductas sexuales refuerza el hostigamiento."
      },
      {
        pregunta: "Tu supervisor abraza a todas sus colaboradoras al llegar. A algunas no les molesta pero a otras sí. ¿Puede ser hostigamiento?",
        opciones: ["No, porque lo hace con todas por igual", "Solo si alguien se queja formalmente", "Sí, el contacto físico no solicitado puede ser hostigamiento"],
        correcta: 2,
        feedback: "✅ Correcto. El contacto físico no solicitado puede ser hostigamiento, especialmente cuando genera incomodidad en quien lo recibe.",
        feedbackWrong: "❌ Incorrecto. Que sea un hábito con todos no lo hace aceptable. El contacto físico no solicitado puede constituir hostigamiento."
      },
      {
        pregunta: "Nadie ha dicho nada sobre los abrazos del supervisor por miedo a represalias. ¿El silencio significa que no hay hostigamiento?",
        opciones: ["Sí, si nadie se queja no hay problema", "No, el silencio por miedo no es consentimiento", "Depende de cuánto tiempo lleva pasando"],
        correcta: 1,
        feedback: "✅ Correcto. El silencio motivado por miedo no equivale a consentimiento. La víctima no está obligada a quejarse para que exista hostigamiento.",
        feedbackWrong: "❌ Incorrecto. El miedo a represalias es una de las razones por las que muchas víctimas no hablan. El silencio no implica aceptación."
      },
      {
        pregunta: "En una reunión, el gerente le dice a María 'con esa sonrisa consigues cualquier cliente'. ¿Es hostigamiento sexual laboral?",
        opciones: ["No, es un cumplido profesional", "Sí, reducir el valor profesional al físico es una conducta tipificada", "Solo si María se siente mal"],
        correcta: 1,
        feedback: "✅ Correcto. Reducir el valor profesional de una persona a su apariencia o atractivo físico es una conducta de contenido sexista tipificada por la ley.",
        feedbackWrong: "❌ Incorrecto. Aunque parezca un cumplido, vincular el éxito profesional de alguien a su atractivo físico es una conducta tipificada."
      },
      {
        pregunta: "¿El hecho de que el comentario sobre el físico de María sea en público frente a colegas lo hace menos grave?",
        opciones: ["Sí, en público no puede ser hostigamiento", "No cambia nada, el hostigamiento ocurre en público o en privado", "Depende de la reacción de los colegas"],
        correcta: 1,
        feedback: "✅ Correcto. El hostigamiento puede ocurrir en cualquier contexto, público o privado, dentro o fuera del horario laboral.",
        feedbackWrong: "❌ Incorrecto. La Ley 27942 no distingue entre espacios públicos o privados. El hostigamiento es igualmente grave en ambos contextos."
      },
      {
        pregunta: "Jorge le da palmadas en el hombro a Luis como gesto de amistad y a Luis no le molesta. ¿Es hostigamiento sexual laboral?",
        opciones: ["Sí, cualquier contacto físico es hostigamiento", "No, el contacto aceptado entre pares sin connotación sexual no lo es", "Depende de la frecuencia"],
        correcta: 1,
        feedback: "✅ Correcto. El contacto físico no sexual, aceptado por ambas partes y sin connotación intimidatoria, no constituye hostigamiento.",
        feedbackWrong: "❌ Incorrecto. No todo contacto físico es hostigamiento. La ley requiere connotación sexual o intimidatoria y que no sea bienvenido."
      },
      {
        pregunta: "Luis le dice a Jorge que ya no quiere ese contacto pero Jorge continúa. ¿Cambia la situación?",
        opciones: ["No, si antes era aceptado no puede cambiar", "Solo cambia si hay testigos", "Sí, ignorar el límite expresado puede constituir hostigamiento"],
        correcta: 2,
        feedback: "✅ Correcto. En el momento en que alguien expresa que no quiere un tipo de contacto y la otra persona continúa, la situación puede constituir hostigamiento.",
        feedbackWrong: "❌ Incorrecto. Cuando alguien dice 'no quiero esto' y la otra persona continúa, está ignorando un límite claro, lo cual puede ser hostigamiento."
      }
    ];

    // Imágenes de fondo por pregunta (puedes poner la misma o variarlas)
    const fondos = [
      '../assets/img/trivia-bg.jpg',
      '../assets/img/trivia-bg2.jpg',
      '../assets/img/trivia-bg3.jpg',
      '../assets/img/trivia-bg4.jpg',
      '../assets/img/trivia-bg5.jpg',
      '../assets/img/trivia-bg6.jpg',
      '../assets/img/trivia-bg6.jpg',
      '../assets/img/trivia-bg5.jpg',
      '../assets/img/trivia-bg4.jpg',
      '../assets/img/trivia-bg3.jpg',
    ];

    let preguntaActual = 0;
    let puntaje = 0;
    const letras = ['A', 'B', 'C'];

    function iniciarTrivia() {
      preguntaActual = 0;
      puntaje = 0;
      mostrarPregunta();
    }

    function mostrarPregunta() {
      const p = preguntas[preguntaActual];

      // Fondo
      document.getElementById('trivia-bg').style.backgroundImage = `url('${fondos[preguntaActual]}')`;

      // Label
      document.getElementById('trivia-label').textContent = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;

      // Pregunta
      document.getElementById('trivia-question').textContent = p.pregunta;

      // Opciones
      const cont = document.getElementById('trivia-options');
      cont.innerHTML = '';
      p.opciones.forEach((op, i) => {
        const btn = document.createElement('button');
        btn.className = 'trivia-option';
        btn.innerHTML = `<span class="option-letter">${letras[i]}</span> ${op}`;
        btn.addEventListener('click', () => seleccionar(i, btn));
        cont.appendChild(btn);
      });

      // Reset feedback y botón
      const fb = document.getElementById('trivia-feedback');
      fb.style.display = 'none';
      fb.className = 'trivia-feedback';
      fb.textContent = '';
      document.getElementById('btn-siguiente').style.display = 'none';

      // Progreso
      const pct = ((preguntaActual) / preguntas.length) * 100;
      document.getElementById('progress-fill').style.width = pct + '%';
    }

    function seleccionar(idx, btnElegido) {
      const p = preguntas[preguntaActual];
      const opciones = document.querySelectorAll('.trivia-option');
      const fb = document.getElementById('trivia-feedback');

      // Deshabilitar todas
      opciones.forEach((b, i) => {
        b.classList.add('disabled');
        if (i === p.correcta) b.classList.add('correct');
      });

      if (idx === p.correcta) {
        puntaje++;
        btnElegido.classList.remove('disabled');
        btnElegido.classList.add('correct');
        fb.textContent = p.feedback;
        fb.className = 'correct';
      } else {
        btnElegido.classList.remove('disabled');
        btnElegido.classList.add('wrong');
        fb.textContent = p.feedbackWrong;
        fb.className = 'wrong';
      }

      fb.style.display = 'block';
      document.getElementById('btn-siguiente').style.display = 'block';
    }

    document.getElementById('btn-siguiente').addEventListener('click', () => {
      preguntaActual++;
      if (preguntaActual < preguntas.length) {
        mostrarPregunta();
      } else {
        mostrarResultado();
      }
    });

    function mostrarResultado() {
      document.getElementById('trivia-section').style.display = 'none';
      const res = document.getElementById('resultado-section');
      res.classList.add('visible');

      // Progreso 100%
      document.getElementById('progress-fill').style.width = '100%';

      // Guardar en Firebase
      if (typeof window.guardarEnFirebase === 'function') {
        window.guardarEnFirebase(puntaje, preguntas.length);
      }

      // Perfil según puntaje
      let emoji, perfil, desc;
      if (puntaje >= 9) {
        emoji = '🏆'; perfil = 'Aliado Activo';
        desc = 'Tienes un conocimiento sólido sobre el hostigamiento sexual laboral. Eres parte del cambio que PwC necesita. Comparte lo que sabes con tu equipo.';
      } else if (puntaje >= 6) {
        emoji = '👍'; perfil = 'En Camino';
        desc = 'Vas por buen camino. Conoces los conceptos básicos pero aún hay situaciones que pueden ser difíciles de identificar. Revisa la guía de acción.';
      } else if (puntaje >= 3) {
        emoji = '📚'; perfil = 'Aprendiendo';
        desc = 'El conocimiento te protege. Te recomendamos revisar la sección de Leyes y la Guía de Acción para fortalecer tu comprensión del tema.';
      } else {
        emoji = '💡'; perfil = 'Comenzando';
        desc = 'Todos empezamos en algún lugar. Te invitamos a explorar el micrositio completo: la sección de Leyes y la Guía te ayudarán a entender mejor este tema.';
      }

      document.getElementById('res-emoji').textContent = emoji;
      document.getElementById('res-puntaje').textContent = `${puntaje} / ${preguntas.length}`;
      document.getElementById('res-perfil').textContent = perfil;
      document.getElementById('res-desc').textContent = desc;

      const resultadoLink = document.getElementById('resultado-link');
      if (resultadoLink) {
        if (puntaje < 5) {
          resultadoLink.href = '/leyes';
          resultadoLink.textContent = 'Revisar leyes';
        } else {
          resultadoLink.href = '/guia';
          resultadoLink.textContent = 'Ver guía de acción';
        }
      }
    }

    window.reiniciarTrivia = function() {
      document.getElementById('resultado-section').classList.remove('visible');
      document.getElementById('trivia-section').style.display = 'flex';
      iniciarTrivia();
    };

    // Menu mobile
    document.getElementById('nav-toggle').addEventListener('click', () => {
      document.getElementById('main-nav').classList.toggle('open');
    });