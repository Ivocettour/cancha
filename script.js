const form = document.getElementById('registrationForm');
const playerList = document.getElementById('playerList');

// Cargar inscripciones al iniciar
document.addEventListener('DOMContentLoaded', fetchInscriptions);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const category = document.getElementById('category').value;
  const schedule = document.getElementById('schedule').value.trim();

  if (!name || !category) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }

  // Enviar inscripción al servidor
  fetch('/inscripciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: name, categoria: category, horario: schedule }),
  })
    .then((res) => res.json())
    .then(() => {
      fetchInscriptions(); // Actualizar lista
      form.reset();
    })
    .catch((err) => console.error('Error:', err));
});

function fetchInscriptions() {
  fetch('/inscripciones')
    .then((res) => res.json())
    .then((players) => {
      playerList.innerHTML = '';
      players.forEach((player) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${player.nombre}</strong> - Categoría: ${player.categoria}<br>
          Problemas de horario: ${player.horario || 'Ninguno'}
        `;
        playerList.appendChild(li);
      });
    })
    .catch((err) => console.error('Error:', err));
}
