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
   Funzione per la generazione di una serie storica casuale.
   Viene utilizzata la funzione javascript Math.random() che genera un valore decimale compreso tra 0 e 1.
*/
function generaDati() {    
    /*var periodi = Array.from({ length: 20 }, (_, i) => i + 1);*/
    /*genero un valore di base random tra 100 e 100.000 
      rappresenta la dimensione base della domanda*/
    var base = Math.round(Math.random() * (100000 - 1000) + 1000);

    /*genero un array di indici tra -1 e 1 che rappresentano la variazione della domanda in serie storica*/
    var indici = Array.from({length: 20}, (_,i) => Math.random() * (Math.random() < 0.5 ? -1 : 1));
    /*genero l'array dei dati in serie storica con una variazione della base al massimo di un 10%*/ 
    let dati= indici.map(elem => Math.round(base * (10 -  elem) / 10));
    showError(dati);
    return dati;
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

function showError(messaggio){
    alert(messaggio);   
}

document.getElementById()