async function buscarPokemon() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const infoDiv = document.getElementById("pokemonInfo");

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!response.ok) throw new Error("Pokémon no encontrado");

    const data = await response.json();

    infoDiv.innerHTML = `
      <h2>${data.name.toUpperCase()}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p><strong>ID:</strong> ${data.id}</p>
      <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
      <p><strong>Altura:</strong> ${data.height / 10} m</p>
      <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
    `;

    document.getElementById("busqueda").style.display = "none";
    document.getElementById("info").style.display = "block";

  } catch (error) {
    infoDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    document.getElementById("busqueda").style.display = "none";
    document.getElementById("info").style.display = "block";
  }
}

function regresar() {
  document.getElementById("busqueda").style.display = "block";
  document.getElementById("info").style.display = "none";
  document.getElementById("searchInput").value = "";
}
