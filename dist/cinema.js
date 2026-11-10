"use strict";
// Cinema "Chi dorme non piglia film" – soluzione dell'esercizio
// L'ordine delle sale corrisponde al value delle <option> del selettore
const sale = [
    { nome: "Sala Grande", film: "Il ritorno del drago", capienza: 150, postiLiberi: 150, bigliettiVenduti: 0 },
    { nome: "Sala Blu", film: "Avventura tra le stelle", capienza: 90, postiLiberi: 90, bigliettiVenduti: 0 },
    { nome: "Sala Verde", film: "La casa dei misteri", capienza: 60, postiLiberi: 60, bigliettiVenduti: 0 },
    { nome: "Sala VIP", film: "Risate in famiglia", capienza: 20, postiLiberi: 20, bigliettiVenduti: 0 }
];
// Prezzi
const PREZZO_INTERO = 8.50;
const PREZZO_RIDOTTO = 6.00;
const PREZZO_POPCORN = 4.00; // una volta per ordine
const PREZZO_BIBITA = 2.50; // una volta per ordine
const PREZZO_OCCHIALI = 1.00; // per ogni biglietto
const MAX_BIGLIETTI = 8;
const SCONTO = 0.10; // 10% da 5 biglietti in su
let incassoTotale = 0;
// ---------- FUNZIONI DI SUPPORTO ----------
// Scrive un numero come importo in euro: 12.5 -> "12,50 €"
function euro(valore) {
    return valore.toFixed(2).replace(".", ",") + " €";
}
function mostraErrore(messaggio) {
    const output = document.getElementById("output");
    output.className = "errore";
    output.innerHTML = messaggio;
}
// ---------- STAMPA BIGLIETTO ----------
function stampaBiglietto() {
    // 1. Leggo i dati dal form
    const nome = document.getElementById("nome").value.trim();
    const numero = Number(document.getElementById("numero").value);
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const indiceSala = Number(document.getElementById("film").value);
    const popcorn = document.getElementById("popcorn").checked;
    const bibita = document.getElementById("bibita").checked;
    const occhiali = document.getElementById("occhiali").checked;
    // 2. Controllo i dati
    if (nome === "") {
        mostraErrore("Inserisci il nome del cliente.");
        return;
    }
    if (numero < 1 || numero > MAX_BIGLIETTI || numero !== Math.floor(numero)) {
        mostraErrore("Il numero di biglietti deve essere compreso tra 1 e " + MAX_BIGLIETTI + ".");
        return;
    }
    const sala = sale[indiceSala];
    if (numero > sala.postiLiberi) {
        mostraErrore("Posti insufficienti in " + sala.nome + ": ne restano solo " + sala.postiLiberi + ". Vendita non registrata.");
        return;
    }
    // 3. Calcolo il totale
    let prezzoBiglietto;
    if (tipo === "intero") {
        prezzoBiglietto = PREZZO_INTERO;
    }
    else {
        prezzoBiglietto = PREZZO_RIDOTTO;
    }
    let totale = prezzoBiglietto * numero;
    let extra = "";
    if (popcorn) {
        totale += PREZZO_POPCORN;
        extra += "Popcorn (" + euro(PREZZO_POPCORN) + ")<br>";
    }
    if (bibita) {
        totale += PREZZO_BIBITA;
        extra += "Bibita (" + euro(PREZZO_BIBITA) + ")<br>";
    }
    if (occhiali) {
        totale += PREZZO_OCCHIALI * numero;
        extra += "Occhiali 3D × " + numero + " (" + euro(PREZZO_OCCHIALI * numero) + ")<br>";
    }
    if (extra === "") {
        extra = "Nessuno<br>";
    }
    let sconto = 0;
    if (numero >= 5) {
        sconto = totale * SCONTO;
        totale = totale - sconto;
    }
    totale = Math.round(totale * 100) / 100; // arrotondo ai centesimi
    // 4. Registro la vendita
    sala.postiLiberi -= numero;
    sala.bigliettiVenduti += numero;
    incassoTotale += totale;
    // 5. Mostro il riepilogo
    let testo = "<h2>🎟️ Biglietto</h2>";
    testo += "<b>Cliente:</b> " + nome + "<br>";
    testo += "<b>Film:</b> " + sala.film + " (" + sala.nome + ")<br>";
    testo += "<b>Biglietti:</b> " + numero + " × " + tipo + " (" + euro(prezzoBiglietto * numero) + ")<br>";
    testo += "<b>Extra:</b><br>" + extra;
    if (sconto > 0) {
        testo += "<b>Sconto 10%:</b> −" + euro(sconto) + "<br>";
    }
    testo += "<p class='totale'>Totale da pagare: " + euro(totale) + "</p>";
    const output = document.getElementById("output");
    output.className = "riepilogo";
    output.innerHTML = testo;
    // Svuoto il form per il cliente successivo
    document.getElementById("ordine").reset();
}
// ---------- CHIUSURA CASSA ----------
function chiusuraCassa() {
    let testo = "<h2>📋 Chiusura cassa</h2>";
    // Posti liberi per sala
    testo += "<b>Posti liberi:</b><ul>";
    for (let i = 0; i < sale.length; i++) {
        testo += "<li>" + sale[i].nome + " – " + sale[i].film + ": "
            + sale[i].postiLiberi + " su " + sale[i].capienza + "</li>";
    }
    testo += "</ul>";
    // Incasso
    testo += "<p class='totale'>Incasso totale: " + euro(incassoTotale) + "</p>";
    // Film più venduto: cerco la sala con più biglietti venduti
    let indiceMax = 0;
    for (let i = 1; i < sale.length; i++) {
        if (sale[i].bigliettiVenduti > sale[indiceMax].bigliettiVenduti) {
            indiceMax = i;
        }
    }
    if (sale[indiceMax].bigliettiVenduti === 0) {
        testo += "<b>Film più venduto:</b> nessun biglietto venduto oggi.";
    }
    else {
        testo += "<b>Film più venduto:</b> " + sale[indiceMax].film
            + " (" + sale[indiceMax].bigliettiVenduti + " biglietti)";
    }
    const output = document.getElementById("output");
    output.className = "chiusura";
    output.innerHTML = testo;
}
// ---------- COLLEGAMENTO DEI PULSANTI ----------
document.getElementById("btnStampa").addEventListener("click", stampaBiglietto);
document.getElementById("btnChiusura").addEventListener("click", chiusuraCassa);
