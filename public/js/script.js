/*libreria javascript - web application EOQ Lotto economico di acquisto*/

const anno = new Date().getFullYear();

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
        showAlert('Errore', 'Errore durante il richiamo del form parametri' + error);
    }
}

/* generaDati
   Funzione per la generazione di una serie storica casuale.
   Richiama l'endpoint /datidomanda per la generazione di una serie storica casuale.
*/
async function generaDati() {
    let numAnni = 20;
    let aa=anno; /*ultimo anno serie storica*/
    try {
        
        const data = new URLSearchParams();
        data.append("n",numAnni);
        await fetch('/datidomanda', {
            method: "POST",            
            body: data
        }).then(function (response) {
            return response.text();
        }).then(function (data) {

            //Aggiorna la porzione di pagina con il nuovo contenuto            
            var tabella = document.getElementById('tabellaDati');
            tabella.innerHTML = '';
            let datiDomanda = JSON.parse(data);
            let i = 1;           
            datiDomanda.forEach((dati) => {
                let row = document.createElement('tr');
                let cell = document.createElement('td');
              
                cell.appendChild(document.createTextNode(aa--));
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.appendChild(document.createTextNode(dati.valC.toLocaleString('it-IT')));
                cell.classList.add("numeric");
                row.appendChild(cell);

                cell = document.createElement('td');
                cell.appendChild(document.createTextNode(dati.valS.toLocaleString('it-IT')));
                cell.classList.add("numeric");
                row.appendChild(cell);

                cell = document.createElement('td');
                cell.appendChild(document.createTextNode(dati.valH.toLocaleString('it-IT')));
                cell.classList.add("numeric");
                row.appendChild(cell);

                cell = document.createElement('td');
                cell.appendChild(document.createTextNode(dati.valD.toLocaleString('it-IT')));
                cell.classList.add("numeric");
                row.appendChild(cell);

                row.appendChild(cell);

                tabella.appendChild(row);
                i = i + 1;
            });
        });
    } catch (error) {
        showAlert('Errore', 'Errore durante la generazione di dati' + error);
    }
}


async function caricaDati() {

    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        let file = e.target.files[0];
        document.getElementById("fileSelezionato").innerHTML = file.name;
        console.log(file);
    }
    input.click();

}


/*addRow
  funzione per l'inserimento di una riga nella tabella dati, per l'inserimento manuale dei dati
  Valore restituito:
  - il riferimento all'oggetto riga appena inserito
*/
function addRow() {
    /*prelevo il body della tabella dal DOM*/
    let tabella = document.getElementById('tabellaDati');
    /*imposto l'id della riga da inserire*/
    let num_riga = tabella.rows.length;
    let row = tabella.insertRow(0);
    /*imposto l'id della riga*/
    row.id = 'R' + num_riga;
    /*aggiungo le celle della tabella*/
    /*let cellRiga = row.insertCell(0).innerHTML = num_riga + 1;*/
    let cellPeriodo = row.insertCell(0);
    let cellCosto = row.insertCell(1);
    let cellSetup = row.insertCell(2);
    let cellMantenimento = row.insertCell(3);
    let cellDomanda = row.insertCell(4);
    let cellEOQ = row.insertCell(5);
    let cellRemove = row.insertCell(6);
    /*imposto le celle come editabili*/
    cellPeriodo.contentEditable = "true";
    cellCosto.contentEditable = "true";
    cellSetup.contentEditable = "true";
    cellMantenimento.contentEditable = "true";
    cellDomanda.contentEditable = "true";
    /*aggiungo il pulsante per la rimozione della riga*/
    cellRemove.innerHTML = "<button type='button' class='btn btn-outline-danger' onclick='removeRow(this)'>x</button>";
    /*restituisco la riga inserita*/
    return row;
}

/*removeRow
  funzione per la rimozione di una riga dalla tabella dati
  Parametri:
  - btn, oggetto del button che è stato cliccato*/
function removeRow(btn) {
    /*prelevo il body della tabella dal DOM*/
    let tabella = document.getElementById('tabellaDati');
    /*individuo la riga del button premuto*/
    let row = btn.closest('tr');
    /*rimuovo la riga dalla tabella*/
    tabella.removeChild(row);
}

/*showAlert
    Funzione per la visualizzazione di un messaggio di alert di tipo modal
    Parametri:
    - titolo, titolo dell'alert;
    - messaggio, corpo del messaggio di alert.
*/
function showAlert(titolo, messaggio) {
    var modal = new bootstrap.Modal(document.getElementById('alert'));
    modal.show();
    document.getElementById("alertTitolo").innerHTML = titolo;
    document.getElementById("alertMessaggio").innerHTML = messaggio;
}





/*showButton 
    Funzione per la visualizazione dinamica del form inserimento dati, dati dell domanda D, se generati 
    automaticamente o inseriti tramite file csv.
    Parametri: 
    - btnID, valore id dell'input di tipo button da visualizzare.
*/
/*function showButton(btnID) {
    document.getElementById(btnID).className = "visible";
    (btnID != "btnFileDati") ? document.getElementById("btnFileDati").classList.add("invisible")
        : document.getElementById("btnFileDati").className = "visible";
    (btnID != "btnDatiRandom") ? document.getElementById("btnDatiRandom").className = "invisible"
        : document.getElementById("btnDatiRandom").className = "visible";   
    /*inizializzo la tabella dati

    document.getElementById('tabellaDati').innerHTML="";
}*/
