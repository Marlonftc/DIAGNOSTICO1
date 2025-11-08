// === Global variables ===
let pokemonList = [];

// === Load Pokémon names on startup ===
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    pokemonList = data.results;
  } catch (error) {
    console.error('Error loading Pokémon list:', error);
  }
});

// === Login function (local version, no backend) ===
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorP = document.getElementById('loginError');

  if (!username || !password) {
    errorP.textContent = 'Please enter both username and password.';
    return;
  }

  // ✅ Fixed credentials (you can change them)
  const VALID_USER = 'admin';
  const VALID_PASS = '1234';

  if (username === VALID_USER && password === VALID_PASS) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('search').style.display = 'block';
    errorP.textContent = '';
  } else {
    errorP.textContent = 'Invalid credentials.';
  }
}

// === Search Pokémon by name or ID ===
async function searchPokemon() {
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

    document.getElementById("search").style.display = "none";
    document.getElementById("info").style.display = "block";

  } catch (error) {
    infoDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    document.getElementById("search").style.display = "none";
    document.getElementById("info").style.display = "block";
  }
}

// === Go back to login ===
function goBackToLogin() {
  document.getElementById("login").style.display = "block";
  document.getElementById("search").style.display = "none";
  document.getElementById("info").style.display = "none";

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("searchInput").value = "";

  document.getElementById("searchResults").innerHTML = "";
  document.getElementById("pokemonInfo").innerHTML = "";
  document.getElementById("loginError").textContent = "";
}

// === Go back to search view ===
function goBackToSearch() {
  document.getElementById("search").style.display = "block";
  document.getElementById("info").style.display = "none";
}

// === Filter Pokémon as user types ===
async function filterPokemon() {
  const text = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("searchResults");

  resultsDiv.innerHTML = "";

  if (text.length === 0) return;

  const results = pokemonList.filter(p => p.name.startsWith(text)).slice(0, 10);

  for (let poke of results) {
    const response = await fetch(poke.url);
    const data = await response.json();

    const card = document.createElement("div");
    card.innerHTML = `
      <h4>${data.name.toUpperCase()}</h4>
      <img src="${data.sprites.front_default}" alt="${data.name}" />
      <button onclick="showPokemon('${data.name}')">See more</button>
    `;
    resultsDiv.appendChild(card);
  }
}

// === Show detailed Pokémon info ===
async function showPokemon(name) {
  document.getElementById("searchInput").value = name;
  await searchPokemon();
}
