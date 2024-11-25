const fs = require('fs');
const { execSync } = require('child_process');

// Ruta al archivo de inscripciones
const INSCRIPCIONES_FILE = 'inscripciones.json';

// Obtener datos de los issues creados
function fetchIssues() {
  try {
    const issuesJSON = execSync('gh issue list --json title,body --state open', {
      encoding: 'utf-8',
    });
    return JSON.parse(issuesJSON);
  } catch (error) {
    console.error('Error al obtener los issues:', error.message);
    return [];
  }
}

// Actualizar el archivo de inscripciones
function updateInscripciones(issues) {
  const nuevasInscripciones = issues.map((issue) => {
    const [categoriaLine, horarioLine] = issue.body.split('\n');
    return {
      nombre: issue.title.replace('Inscripción: ', '').trim(),
      categoria: categoriaLine.replace('**Categoría**: ', '').trim(),
      horario: horarioLine.replace('**Problemas de horario**: ', '').trim() || 'Ninguno',
    };
  });

  let inscripcionesExistentes = [];
  if (fs.existsSync(INSCRIPCIONES_FILE)) {
    inscripcionesExistentes = JSON.parse(fs.readFileSync(INSCRIPCIONES_FILE, 'utf-8'));
  }

  const inscripcionesActualizadas = [...inscripcionesExistentes, ...nuevasInscripciones];
  fs.writeFileSync(INSCRIPCIONES_FILE, JSON.stringify(inscripcionesActualizadas, null, 2), 'utf-8');
  console.log('Archivo de inscripciones actualizado.');
}

function main() {
  const issues = fetchIssues();
  if (issues.length > 0) {
    updateInscripciones(issues);
  } else {
    console.log('No hay nuevos issues para procesar.');
  }
}

main();
