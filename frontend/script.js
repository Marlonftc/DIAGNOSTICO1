// === Global variables ===
let listaPokemon = [];

// === Load Pokémon names on startup ===
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    listaPokemon = data.results;
  } catch (error) {
    console.error('Error loading Pokémon list:', error);
  }
});

// === Login function ===
async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorP = document.getElementById('loginError');

  if (!username || !password) {
    errorP.textContent = 'Please enter both username and password.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('login').style.display = 'none';
      document.getElementById('busqueda').style.display = 'block';
    } else {
      errorP.textContent = data.error || 'Invalid credentials.';
    }
  } catch (error) {
    errorP.textContent = 'Cannot connect to the server.';
    console.error(error);
  }
}

// === Search Pokémon by name or ID ===
async function buscarPokemon() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const infoDiv = document.getElementById("pokemonInfo");

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!response.ok) throw new Error("Pokémon not found");

    const data = await response.json();

    infoDiv.innerHTML = `
      <h2>${data.name.toUpperCase()}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p><strong>ID:</strong> ${data.id}</p>
      <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
      <p><strong>Height:</strong> ${data.height / 10} m</p>
      <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
    `;

    document.getElementById("busqueda").style.display = "none";
    document.getElementById("info").style.display = "block";

  } catch (error) {
    infoDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    document.getElementById("busqueda").style.display = "none";
    document.getElementById("info").style.display = "block";
  }
}

// === Go back to login ===
function regresar() {
  document.getElementById("login").style.display = "block";
  document.getElementById("busqueda").style.display = "none";
  document.getElementById("info").style.display = "none";

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("searchInput").value = "";

  document.getElementById("resultadoBusqueda").innerHTML = "";
  document.getElementById("pokemonInfo").innerHTML = "";
  document.getElementById("loginError").textContent = "";
}

// === Go back to search view ===
function regresarABusqueda() {
  document.getElementById("busqueda").style.display = "block";
  document.getElementById("info").style.display = "none";
}

// === Filter Pokémon as user types ===
async function filtrarPokemon() {
  const texto = document.getElementById("searchInput").value.toLowerCase();
  const resultadosDiv = document.getElementById("resultadoBusqueda");

  resultadosDiv.innerHTML = "";

  if (texto.length === 0) return;

  const resultados = listaPokemon.filter(p => p.name.startsWith(texto)).slice(0, 10);

  for (let poke of resultados) {
    const response = await fetch(poke.url);
    const data = await response.json();

    const card = document.createElement("div");
    card.innerHTML = `
      <h4>${data.name.toUpperCase()}</h4>
      <img src="${data.sprites.front_default}" alt="${data.name}" />
      <button onclick="mostrarPokemon('${data.name}')">See more</button>
    `;
    resultadosDiv.appendChild(card);
  }
}

// === Show detailed Pokémon info ===
async function mostrarPokemon(nombre) {
  document.getElementById("searchInput").value = nombre;
  await buscarPokemon();
}
