// ================== PREZZI ==================
const PREZZO_CITY: number = 5.0;       // all'ora
const PREZZO_MOUNTAIN: number = 7.0;   // all'ora
const PREZZO_EBIKE: number = 10.0;     // all'ora
const PREZZO_CASCO: number = 2.0;      // una sola volta
const SCONTO: number = 0.10;           // 10% sopra le 4 ore

// ================== ELEMENTI DELLA PAGINA ==================
// REGOLA: <input> → HTMLInputElement
//         <select> → HTMLSelectElement
//         tutto il resto → HTMLElement
const inputNome = document.getElementById("nome") as HTMLInputElement;
const inputCognome = document.getElementById("cognome") as HTMLInputElement;
const inputOre = document.getElementById("ore") as HTMLInputElement;
const selectBici = document.getElementById("bici") as HTMLSelectElement;
const radioAdulto = document.getElementById("adulto") as HTMLInputElement;
const radioRagazzo = document.getElementById("ragazzo") as HTMLInputElement;
const checkCasco = document.getElementById("casco") as HTMLInputElement;
const divRiepilogo = document.getElementById("riepilogo") as HTMLElement;

// ================== PULSANTE "CALCOLA PREZZO" ==================
function calcolaPrezzo(): void {
  // 1) lettura dei dati del form
  let nome: string = inputNome.value;
  let cognome: string = inputCognome.value;
  let ore: number = Number(inputOre.value);

  // 2) prezzo orario e nome della bici in base al selettore
  let prezzoOrario: number;
  let nomeBici: string;

  switch (selectBici.value) {
    case "city":
      prezzoOrario = PREZZO_CITY;
      nomeBici = "City bike";
      break;
    case "mountain":
      prezzoOrario = PREZZO_MOUNTAIN;
      nomeBici = "Mountain bike";
      break;
    default:
      prezzoOrario = PREZZO_EBIKE;
      nomeBici = "E-bike";
  }

  // 3) tariffa ragazzo: il prezzo orario è dimezzato
  if (radioRagazzo.checked) {
    prezzoOrario = prezzoOrario / 2;
  }

  // 4) totale: bici per le ore, più il casco (una sola volta)
  let totale: number = prezzoOrario * ore;

  if (checkCasco.checked) {
    totale = totale + PREZZO_CASCO;
  }

  // 5) sconto del 10% se la prenotazione supera le 4 ore
  if (ore > 4) {
    totale = totale - totale * SCONTO;
  }

  // 6) riepilogo
  let testo: string = "RIEPILOGO\n";
  testo += "Cliente: " + nome + " " + cognome + "\n";
  testo += "Bici: " + nomeBici + "\n";
  testo += "Ore di noleggio: " + ore + "\n";
  testo += "Totale da pagare: " + totale.toFixed(2).replace(".", ",") + " €";

  divRiepilogo.textContent = testo;
}

// ================== PULSANTE "NUOVO CLIENTE" ==================
// Rimette ogni campo al valore iniziale e cancella il riepilogo
function nuovoCliente(): void {
  inputNome.value = "";
  inputCognome.value = "";
  inputOre.value = "1";
  selectBici.value = "city";
  radioAdulto.checked = true;
  checkCasco.checked = false;
  divRiepilogo.textContent = "";
}
