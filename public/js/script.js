/*libreria javascript - web application EOQ Lotto economico di acquisto*/


/*caricaDati
funzione per il caricamento dei dati nella table HTML
Parametri:
- data, oggetto JSON con i dati*/
function inserisciDatiInTabella(data) {

    //Aggiorna la porzione di pagina con il nuovo contenuto  
    console.log(data);
    let tabella = document.getElementById('tabellaDati');
    let dati = JSON.parse(data);
    let i = 1;
    
    dati.reverse().forEach((dati) => {        
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.textContent=dati.periodo;
        cell.setAttribute('name', 'periodo');
        row.appendChild(cell);
        cell.classList.add("text");
        cell = document.createElement('td');
        cell.textContent=dati.valC.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valC');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent=dati.valS.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valS');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent=dati.valH.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valH');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent=dati.valD.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valD');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.appendChild(document.createTextNode(''));
        cell.classList.add("numeric");
        row.appendChild(cell);
        cell.setAttribute('name', 'valEOQ');

        cell = document.createElement("button");
        cell.textContent="| X |";
        cell.className="btn btn-outline-danger";      
        cell.setAttribute("title","Elimina riga");
        cell.setAttribute("type", "button");
        cell.setAttribute("onclick", "removeRow(this)");
        row.appendChild(cell);
        tabella.insertBefore(row, tabella.firstChild); 
          
    });
}


function caricaDatiDaFile() {

    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        let file = e.target.files[0];
        document.getElementById("fileSelezionato").innerHTML = file.name;
        console.log(file);
    }
    input.click();

}

/*convertiTabella
funzione che converte la table dati in formato JSON per l'elaborazione
*/
function convertiTabella(table) {
    let dt = document.getElementById(table);
    const dati = [];
    // Ottieni i dati delle righe 
    dt.querySelectorAll('tr').forEach(tr => {
        const row = {};
        tr.querySelectorAll('td').forEach((td, i) => {
            row[td.getAttribute('name')] = parseInt(td.textContent.trim());
        });
        dati.push(row);
    });

    // Converti l'array di oggetti in JSON 
    return JSON.stringify(dati);
}




/*aggiungiRiga
  funzione per l'inserimento di una riga nella tabella dati, per l'inserimento manuale dei dati
  Valore restituito:
  - il riferimento all'oggetto riga appena inserito
*/
function aggiungiRiga() {

    /*leggo i dati dal form modal*/
    const dati = [];
    let riga = {};
    riga['periodo'] = document.getElementById('paramP').value;
    riga['valD'] = document.getElementById('paramD').value;
    riga['valC'] = document.getElementById('paramC').value;
    riga['valS'] = document.getElementById('paramS').value;
    riga['valH'] = document.getElementById('paramH').value;
    dati.push(riga);
    inserisciDatiInTabella(JSON.stringify(dati));
    /*prelevo il body della tabella dal DOM*/
    //let tabella = document.getElementById('tabellaDati');
    /*imposto l'id della riga da inserire*/
    //let num_riga = tabella.rows.length;
    //let row = tabella.insertRow(0);
    /*imposto l'id della riga*/
    //row.id = 'R' + num_riga;
    /*aggiungo le celle della tabella*/
    /*let cellRiga = row.insertCell(0).innerHTML = num_riga + 1;*/
    /*let cellPeriodo = row.insertCell(0);
    let cellCosto = row.insertCell(1);
    let cellSetup = row.insertCell(2);
    let cellMantenimento = row.insertCell(3);
    let cellDomanda = row.insertCell(4);
    let cellEOQ = row.insertCell(5);
    let cellRemove = row.insertCell(6);
    /*imposto le celle come editabili*/
    /*cellPeriodo.contentEditable = "true";
    cellCosto.contentEditable = "true";
    cellSetup.contentEditable = "true";
    cellMantenimento.contentEditable = "true";
    cellDomanda.contentEditable = "true";
    /*aggiungo il pulsante per la rimozione della riga*/
    /*cellRemove.innerHTML = "<button type='button' class='btn btn-outline-danger' onclick='removeRow(this)'>x</button>";
    /*restituisco la riga inserita*/
    //return row;
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

/*showInserimentoDati 
    Funzione per la visualizazione del form inserimento dati di tipo modal   
*/
function showInserimentoDati() {
    var modal = new bootstrap.Modal(document.getElementById('datainput'));
    modal.show();
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
