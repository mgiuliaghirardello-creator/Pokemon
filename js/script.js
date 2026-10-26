const campo = document.getElementById("pokemon");
const resultados = document.getElementById("resultados");
const erro = document.getElementById("erro");

const STATUS = [
  { chave: "hp",              nome: "HP",         cor: "#dc3545" },
  { chave: "attack",          nome: "Ataque",     cor: "#ffc107" },
  { chave: "defense",         nome: "Defesa",     cor: "#0dcaf0" },
  { chave: "speed",           nome: "Velocidade", cor: "#198754" }
];

async function buscarPokemon() {
  erro.textContent = "";
  // permite vários Pokémon separados por vírgula ou espaço
  const nomes = campo.value.toLowerCase().split(/[,\s]+/).filter(Boolean);
  if (nomes.length === 0) return;

  const naoEncontrados = [];

  for (const nome of nomes) {
    try {
      const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      if (!resposta.ok) throw new Error("não encontrado");
      const pokemon = await resposta.json();
      mostrarPokemon(pokemon);
    } catch (e) {
      naoEncontrados.push(nome);
    }
  }

  if (naoEncontrados.length) {
    erro.textContent = "Não encontrado: " + naoEncontrados.join(", ");
  }
}

function mostrarPokemon(p) {
  const nome = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  const imagem = p.sprites.other["official-artwork"].front_default || p.sprites.front_default;

  const tipos = p.types
    .map(t => `<span class="badge tipo tipo-${t.type.name}">${t.type.name}</span>`).join("");

  const habilidades = p.abilities
    .map(a => `<span class="badge bg-secondary me-1">${a.ability.name}</span>`).join("");

  const barras = STATUS.map(s => {
    const valor = p.stats.find(x => x.stat.name === s.chave).base_stat;
    const largura = Math.min(valor, 100);
    return `
      <div class="mb-2">
        <div class="stat-label">${s.nome}: ${valor}</div>
        <div class="progress">
          <div class="progress-bar" style="width:${largura}%; background:${s.cor}">${valor}</div>
        </div>
      </div>`;
  }).join("");

  const card = document.createElement("div");
  card.className = "card card-pokemon mb-3 position-relative";
  card.innerHTML = `
    <button class="btn-remover" title="Remover">×</button>
    <div class="card-body text-center">
      <h3>${nome} <span class="text-secondary">#${p.id}</span></h3>
      <img class="pokemon-img my-2" src="${imagem}" alt="${nome}">
      <hr>
      <h6 class="mt-3">Tipo</h6>
      <div class="mb-3">${tipos}</div>
      <div class="row small mb-3">
        <div class="col"><strong>Altura</strong><br>${p.height / 10} m</div>
        <div class="col"><strong>Peso</strong><br>${p.weight / 10} kg</div>
      </div>
      <h6 class="mt-4 mb-3">Status</h6>
      <div class="text-start">${barras}</div>
      <h6 class="mt-4">Habilidades</h6>
      <div>${habilidades}</div>
    </div>`;

  card.querySelector(".btn-remover").onclick = () => card.remove();
  resultados.prepend(card);
}

document.getElementById("btnBuscar").addEventListener("click", buscarPokemon);
campo.addEventListener("keydown", e => { if (e.key === "Enter") buscarPokemon(); });

buscarPokemon(); // carrega o Pikachu ao abrir, como no modelo