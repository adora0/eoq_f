/*libreria javascript - web application EOQ Lotto economico di acquisto*/


/*caricaDati
funzione per il caricamento dei dati nella table HTML
Parametri:
- dati, oggetto JSON con i dati*/
function inserisciDatiInTabella(dati) {

    //Aggiorna la porzione di pagina con il nuovo contenuto  

    let tabella = document.getElementById('tabellaDati');
    //let dati = JSON.parse(data);
    let i = 1;

    JSON.parse(dati).reverse().forEach((d) => {
        /*aggiungo una riga*/
        let row = document.createElement('tr');

        /*aggiungo le celle con i dati*/
        let cell = document.createElement('td');
        cell.textContent = d.periodo;
        cell.setAttribute('name', 'periodo');
        cell.classList.add("text");
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = d.valC.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valC');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = d.valS.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valS');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = d.valH.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valH');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = d.valD.toLocaleString('it-IT');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valD');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.appendChild(document.createTextNode(''));
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valEOQ');
        row.appendChild(cell);


        cell.innerHTML = "<a href='#'><img src='/images/garbage.png' onclick='removeRow(this)' width='30px' /></a>";
        row.appendChild(cell);
        tabella.insertBefore(row, tabella.firstChild);

    });
}

/*caricaDatiDaFile
  Funzione che legge il file dati in formato csv.
  I file consentiti devono avere il delimitatore ';' e le letiabili d'intestazione 
  periodo - periodo di riferimento anno, mese, trimestre
  valC - valore Costo prodotto
  valS - valore Setup
  valH - valore costo gestione per prodotto per periodo
  valD - quantità domanda
  Valore restituito:
  Oggetto JSON con i dati da elaborare per il calcolo dell'EOQ.
*/
function caricaDatiDaFile() {

    let input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('accept', '.csv');
    input.onchange = e => {
        let file = e.target.files[0];
        document.getElementById("fileSelezionato").innerHTML = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            fileJSON = csvToJson(e.target.result);
            if (fileJSON != '') {
                inserisciDatiInTabella(fileJSON);
                showAlert('File dati', 'File correttamente caricato');
            }
        }
        reader.readAsText(file);
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

/*showInserimentoDati 
    Funzione per la visualizazione del form inserimento dati di tipo modal.
    Parametro:
    - flagVuoto, boolean per aprire il modal pulito o no. Utilizzato per mostrarlo di nuovo in caso di errori;
    Pulisco e resetto le classi in caso di visualizzazione precedente.   
*/
function showInserimentoDati(flagVuoto) {
    let modal = new bootstrap.Modal(document.getElementById('datainput'));
    
    if (flagVuoto) {
        let f = document.getElementById("formDati");
        let err= document.getElementById('modalError');
        err.style.display='none';
        Array.from(f.elements).forEach(function (input) {
            if (input.tagName === 'INPUT') {
                /*Imposto le classi iniziali e pulisco i campi di input*/
                input.value = '';
                input.className = 'form-control';
            }
        });
    }
    modal.show();
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
    let flagFormValido=true;

    /*controllo i dati inseriti nel form*/
    let f = document.getElementById('formDati');
    let err= document.getElementById('modalError');
    Array.from(f.elements).forEach(function (input) {
        if (input.tagName === 'INPUT') {
            console.log(input.value);
            /*verifico se l'input è valido*/
            if (!valoreValido(input.value)) {
                /*se un valore non è valido fermo l'esecuzione*/
                flagFormValido=false;
                return;
            }
        }
    });
    /*form dati non valido, visualizzo di nuovo il form con un avviso*/
    if(!flagFormValido){
        err.style.display = 'block';
        showInserimentoDati(false);
        return;
    }

    /*form valido inserisco i dati nella tabella html*/
    riga['periodo'] = document.getElementById('paramP').value;
    riga['valD'] = document.getElementById('paramD').value;
    riga['valC'] = document.getElementById('paramC').value;
    riga['valS'] = document.getElementById('paramS').value;
    riga['valH'] = document.getElementById('paramH').value;
    dati.push(riga);
    inserisciDatiInTabella(JSON.stringify(dati));   
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

/*validaCampo
    Funzione per il controllo dei dati inserit nel campo input. I dati devono essere 
    numerici, positivi e al massimo di 7 digit. 
    Parametri:
    - id, id del campo input da verificare
*/

function validaCampo(id) {
    /*campo di input*/
    campo = document.getElementById(id);
    /*se il campo non rispetta i requisiti imposto le classi bootstrap di avviso - rosso invalido, verde valido*/
    if (valoreValido(campo.value)) {
        /*valore valido*/
        campo.classList.add('is-valid');
        campo.classList.remove('is-invalid');

    } else {
        /*valore non valido*/
        campo.classList.add('is-invalid');
        campo.classList.remove('is-valid');
    }
}


/*controllaValore
Funzione per la verifica del valore inserito nei campi di input
Il valore deve essere, diverso da vuoto, numerico , positivo e max di 7 digit
Parametri:
 - inputval - il valore inserito
Valore restituito:
 - boolean, true, valore valido, false altrimenti.
 */
function valoreValido(inputVal) {
    /*regola per accettare solo numeri*/
    let regex = /^[0-9]/;
    return (inputVal < 0 || inputVal.length > 7 || !regex.test(inputVal)) ? false : true;
}

/*csvToJson
Funzione per convertire un file .csv in oggetto json. Il file deve contenere l'intestazione
Parametri:
- fileCsv, oggetto file di tipo csv 
*/
function csvToJson(fileCsv) {
    /*suddivido il file in righe, separando per il separatore di linea*/

    const righe = fileCsv.trim().split('\n');

    /*leggo l'intestazione dei dati*/
    const letiabili = righe[0].split(';').map(letiabili => letiabili.trim());
    /*array dei dati*/
    const dati = [];

    /*leggo le righe e le letiabili*/
    for (let i = 1; i < righe.length; i++) {
        const riga = righe[i].split(';').map(v => v.trim());

        /*creo l'oggetto json per ogni riga*/
        const obj = {};
        for (let j = 0; j < letiabili.length; j++) {
            obj[letiabili[j]] = riga[j];
        }
        dati.push(obj);
    }
    return JSON.stringify(dati);
}


/*showAlert
    Funzione per la visualizzazione di un messaggio di alert di tipo modal
    Parametri:
    - titolo, titolo dell'alert;
    - messaggio, corpo del messaggio di alert.
*/
function showAlert(titolo, messaggio) {
    let modal = new bootstrap.Modal(document.getElementById('alert'));
    modal.show();
    document.getElementById("alertTitolo").innerHTML = titolo;
    document.getElementById("alertMessaggio").innerHTML = messaggio;
}
