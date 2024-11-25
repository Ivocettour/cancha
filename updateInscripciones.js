const fetch = require('node-fetch'); // Para hacer solicitudes HTTP
const fs = require('fs'); // Para leer y escribir archivos locales

// Configuración
const GITHUB_API_URL = 'https://api.github.com';
const OWNER = 'tu_usuario_de_github'; // Reemplazá con tu usuario
const REPO = 'tu_repositorio'; // Reemplazá con el nombre del repo
const FILE_PATH = 'inscripciones.json'; // Ruta del archivo en el repositorio
const TOKEN = 'tu_token_de_acceso'; // Reemplazá con tu token

// Función para obtener el contenido actual del archivo
async function getFileContent() {
  const url = `${GITHUB_API_URL}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const response = await fetch(url, {
    headers: { Authorization: `token ${TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener el archivo: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: Buffer.from(data.content, 'base64').toString(),
    sha: data.sha, // Necesario para actualizar el archivo
  };
}

// Función para actualizar el archivo con una nueva inscripción
async function updateFile(newEntry) {
  const { content, sha } = await getFileContent();
  const inscripciones = JSON.parse(content); // Parsear el contenido actual
  inscripciones.push(newEntry); // Agregar la nueva inscripción

  const updatedContent = Buffer.from(JSON.stringify(inscripciones, null, 2)).toString('base64');

  // Actualizar el archivo en GitHub
  const url = `${GITHUB_API_URL}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Agregar nueva inscripción',
      content: updatedContent,
      sha,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar el archivo: ${response.statusText}`);
  }

  console.log('Archivo actualizado con éxito.');
}

// Ejemplo: Agregar una inscripción
const nuevaInscripcion = {
  nombre: 'Carlos Gómez',
  categoria: 'Avanzado',
  horario: 'Tarde',
};

updateFile(nuevaInscripcion).catch((err) => console.error(err.message));
