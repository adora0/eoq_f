/*libreria javascript - web application EOQ Lotto economico di acquisto*/


/*getEOQ
  Funzione che richiama la routing path /elab per il calcolo del valore EOQ
  I parametri per il calcolo vengono letti dai campi della pagina html
  Valore restituito:
  oggetto json:
    - EOQ, valore del lotto ecnomico d'acquisto
    - CTot, costo totale di riordino
    - error. evventuale errore nel calcolo o nei parametri inviati
*/
async function getEOQ() {
    try {
        await fetch('/elab', {
            method: "POST"
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            // Aggiorna la parte della pagina con il nuovo contenuto
            document.getElementById('result').innerHTML = data;
        });
    } catch (error) {
        document.getElementById('error').innerHTML = 'Errore durante il richiamo della funzione:' + error;
    }
}

/*showParams
  Funzione che richiama la routing path /params per la visualizzazione
  e la possibilità di inserimento dei parametri per il calcolo dell'EOQ.
  Valore restituito:
  file html: params.html file con i campi da compilare per il calcolo dell'EOQ
*/
async function showParams() {
    try {
        await fetch('/params', {
            method: "POST"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            //Aggiorna la parte della pagina con il nuovo contenuto
            document.getElementById('parametri').innerHTML = data;
        });
    } catch (error) {
        console.log(error);
        document.getElementById('error').innerHTML = 'Errore durante il richiamo della funzione';
    }
}

/* generaDati
*/
function generaDati() {
    var periodi = Array.from({ length: 20 }, (_, i) => i + 1);
    let valori = [45754, 51813, 53720, 59923, 59871, 54190, 53760, 60350, 63184, 51270, 53586, 51099, 50268, 57416, 50808, 64049, 61187, 55042, 63119,59440];
    let nuoviDati= valori.map(elem => Math.round(elem * (1 + (Math.random() * 0.5) - 0.25)));
    console.log(valori);
    console.log(nuoviDati);

}

/*showButton 
    Funzione per la visualizazione dinamica del form inserimento dati, dati dell domanda D, se generati 
    automaticamente o inseriti tramite file csv.
    Parametri: 
    - btnID, valore id dell'input di tipo button da visualizzare.
*/
function showButton(btnID) {
    document.getElementById(btnID).className = "visible";
    if (btnID == "btnFileDati") document.getElementById("btnDatiRandom").className = "invisible";
    if (btnID == "btnDatiRandom") document.getElementById("btnFileDati").className = "invisible";
}
