// script.js

const creditosElemento = document.getElementById("creditos");
const mallaContainer = document.getElementById("malla");

// Malla ejemplo (primer año)
const datos = {
  "1° Semestre": [
    { nombre: "Historia del Derecho", creditos: 4 },
    { nombre: "Fundamentos Filosóficos", creditos: 4 },
    { nombre: "Técnicas para el manejo del estrés y la ansiedad frente a evaluaciones", creditos: 4 }
  ],
  "2° Semestre": [
    { nombre: "Derecho Económico I", creditos: 4 },
    { nombre: "Fundamentos Teológicos", creditos: 4 },
    { nombre: "Integración del Saber", creditos: 4 }
  ],
  "Anuales 1° Año": [
    { nombre: "Derecho Romano", creditos: 10 },
    { nombre: "Derecho Político", creditos: 10 },
    { nombre: "Teoría del Derecho", creditos: 10 }
  ]
  // Puedes seguir agregando los otros semestres aquí
};

// Prerrequisitos (clave = ramo, valor = array de requisitos o CREDITOS_X)
const prerrequisitos = {
  "Derecho Civil I": ["Derecho Romano", "Teoría del Derecho"],
  "Derecho Constitucional I": ["Derecho Político"],
  "Derecho Internacional Público I": ["Derecho Político"],
  "Derecho Económico II": ["Derecho Económico I"],
  "Derecho Canónico": ["Fundamentos Teológicos"],
  "Derecho Penal I": ["CREDITOS_54"],
  "Derecho Comercial I": ["Derecho Civil II"],
  "Derecho del Trabajo I": ["Teoría del Derecho"],
  "Derecho Administrativo I": ["Derecho Constitucional I"],
  "Seminario Jurídico I": ["Derecho Civil I", "Derecho Procesal I"],
  "Ética Profesional": ["CREDITOS_54"],
  "Optativo de Profundización": ["CREDITOS_173"],
  "Anteproyecto de Investigación": ["CREDITOS_235"],
  "Tesina": ["Anteproyecto de Investigación"],
  "Práctica Profesional": ["Seminario Jurídico III"]
};

let estadoRamos = JSON.parse(localStorage.getItem("estadoRamos")) || {};

function calcularCreditos() {
  return Object.entries(estadoRamos)
    .filter(([, estado]) => estado === true)
    .reduce((acc, [nombre]) => {
      for (const grupo in datos) {
        const ramo = datos[grupo].find(r => r.nombre === nombre);
        if (ramo) return acc + ramo.creditos;
      }
      return acc;
    }, 0);
}

function tienePrerrequisitosCumplidos(nombreRamo, creditos) {
  const requisitos = prerrequisitos[nombreRamo];
  if (!requisitos) return true;
  return requisitos.every(req => {
    if (req.startsWith("CREDITOS_")) {
      const minCreditos = parseInt(req.split("_")[1]);
      return creditos >= minCreditos;
    }
    return estadoRamos[req];
  });
}

function actualizarVista() {
  mallaContainer.innerHTML = "";
  const creditosActuales = calcularCreditos();

  for (const [grupo, ramos] of Object.entries(datos)) {
    const box = document.createElement("div");
    box.className = "semestre";
    box.innerHTML = `<h2>${grupo}</h2>`;

    ramos.forEach(ramo => {
      const div = document.createElement("div");
      div.className = "ramo";
      div.textContent = ramo.nombre;

      const aprobado = estadoRamos[ramo.nombre];
      const bloqueado = !tienePrerrequisitosCumplidos(ramo.nombre, creditosActuales);

      if (aprobado) div.classList.add("aprobado");
      if (bloqueado && !aprobado) div.classList.add("bloqueado");

      div.addEventListener("click", () => {
        if (div.classList.contains("bloqueado")) return;
        estadoRamos[ramo.nombre] = !estadoRamos[ramo.nombre];
        localStorage.setItem("estadoRamos", JSON.stringify(estadoRamos));
        actualizarVista();
      });

      box.appendChild(div);
    });

    mallaContainer.appendChild(box);
  }

  creditosElemento.textContent = creditosActuales;
}

actualizarVista();
