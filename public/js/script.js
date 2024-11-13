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
        document.getElementById('error').innerHTML = 'Errore durante il calcolo EOQ:' + error;
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
        document.getElementById('error').innerHTML = 'Errore durante il richiamo del form parametri' + error;
    }
}

/* generaDati
   Funzione per la generazione di una serie storica casuale.
   Richiama l'endpoint /datidomanda per la generazione di una serie storica casuale.
*/
async function generaDati() {    
    try {
        await fetch('/datidomanda', {
            method: "POST"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {            
            //Aggiorna la porzione di pagina con il nuovo contenuto            
            var tabella=document.getElementById('tabellaDati');
            tabella.innerHTML='';   
            let datiDomanda = JSON.parse(data);  
            let i=1;
            datiDomanda.forEach((val) => {
                let row = document.createElement('tr');             
                  let cell = document.createElement('td');
                  cell.appendChild(document.createTextNode("P"+ i));
                  row.appendChild(cell);                           
                  cell=document.createElement('td');
                  cell.appendChild(document.createTextNode(val));
                  row.appendChild(cell);  
                tabella.appendChild(row);
                i=i+1;
              });
        });
    } catch (error) {             
        document.getElementById('error').innerHTML = 'Errore durante la generazione di dati'+ error;
    } 
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

