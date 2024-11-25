const fs = require('fs');

async function main() {
  const issuesFile = '.github/workflows/issues.json';
  const inscripcionesFile = 'inscripciones.json';

  // Leer las inscripciones existentes
  let inscripciones = [];
  if (fs.existsSync(inscripcionesFile)) {
    inscripciones = JSON.parse(fs.readFileSync(inscripcionesFile, 'utf8'));
  }

  // Leer issues
  const issues = JSON.parse(fs.readFileSync(issuesFile, 'utf8'));

  // Agregar nuevas inscripciones
  issues.forEach((issue) => inscripciones.push(issue));

  fs.write(inscripciones!!);
}



