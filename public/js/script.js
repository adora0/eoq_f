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
         showAlert('Errore', 'Errore durante il calcolo EOQ:' + error);
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
            document.getElementById('main').innerHTML = data;
        });
    } catch (error) {        
         showAlert('Errore','Errore durante il richiamo del form parametri' + error);
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
            addRow();        
          /*  datiDomanda.forEach((val) => {
                let row = document.createElement('tr');             
                  let cell = document.createElement('td');
                  cell.appendChild(document.createTextNode("P"+ i));
                  cell.className="small";
                  row.appendChild(cell);                           
                  cell=document.createElement('td');
                  cell.appendChild(document.createTextNode(val.toLocaleString('it-IT')));
                  cell.classList.add("small", "text-right");
                  row.appendChild(cell);  
                tabella.appendChild(row);
                i=i+1;
              });*/
        });
    } catch (error) {             
         showAlert('Errore','Errore durante la generazione di dati'+ error);
    } 
}


function addRow(){
    let tabella=document.getElementById('tabellaDati');
    let id = tabella.rows.length;
    let row = tabella.insertRow();
    
    let cellRiga = row.insertCell(0).innerHTML=id+1;
    let cellPeriodo = row.insertCell(1);
    let cellCosto = row.insertCell(2);
    let cellSetup = row.insertCell(3);
    let cellMantenimento = row.insertCell(4);
    let cellDomanda = row.insertCell(5);
    let cellEOQ = row.insertCell(6);
    let cellRemove = row.insertCell(7);

    cellPeriodo.contentEditable = "true";
    cellCosto.contentEditable = "true";
    cellSetup.contentEditable = "true";
    cellMantenimento.contentEditable = "true";
    cellDomanda.contentEditable = "true";    
    cellRemove.innerHTML="<button type='button' class='btn btn-outline-danger' onclick='removeRow(" + row.rowIndex+ ")'>X</button>";
}


function removeRow(row){
    let tabella=document.getElementById('tabellaDati');
    tabella.deleteRow(row.rowIndex);
}
/*showButton 
    Funzione per la visualizazione dinamica del form inserimento dati, dati dell domanda D, se generati 
    automaticamente o inseriti tramite file csv.
    Parametri: 
    - btnID, valore id dell'input di tipo button da visualizzare.
*/
function showButton(btnID) {
    document.getElementById(btnID).className = "visible";
    (btnID != "btnFileDati") ? document.getElementById("btnFileDati").className = "invisible" 
        : document.getElementById("btnFileDati").className = "visible" ;
    (btnID != "btnDatiRandom") ? document.getElementById("btnDatiRandom").className = "invisible"
        : document.getElementById("btnDatiRandom").className = "visible" ;
    (btnID != "btnDatiInserimento") ? document.getElementById("btnDatiInserimento").className = "invisible"
        : document.getElementById("btnDatiInserimento").className = "visible" ;
}

/*showAlert
    Funzione per la visualizzazione di un messaggio di alert di tipo modal
    Parametri:
    - titolo, titolo dell'alert;
    - messaggio, corpo del messaggio di alert.
*/
function showAlert(titolo, messaggio){
    var modal = new bootstrap.Modal(document.getElementById('alert')); 
    modal.show();
    document.getElementById("alertTitolo").innerHTML=titolo;
    document.getElementById("alertMessaggio").innerHTML=messaggio;
}

