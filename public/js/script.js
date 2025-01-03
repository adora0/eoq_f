/*libreria javascript - Web Application EOQ Lotto Economico di Ordinazione*/

let gEOQ, gDomanda;

/*inserisciDatiInTabella
funzione per il caricamento dei dati nella table HTML
Parametri:
- dati, oggetto JSON con i dati
- svuota, boolean per indicare se pulire la tabella o no. Nella fase di
  caricamento da file la tabella va svuotata, con l'inserimento manuale no.
*/
function inserisciDatiInTabella(dati, svuota) {

    //Aggiorna la porzione di pagina con il nuovo contenuto  
    let tabella = document.getElementById('tabellaDati');
    /*se inserimento da file pulisco la tabella*/
    if (svuota) {
        tabella.innerHTML = "";
    }
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
        cell.textContent = d.valC;
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valC');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = d.valS;
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valS');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = d.valH;
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valH');
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.textContent = d.valD;
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valD');
        row.appendChild(cell);

        /*RISULTATI*/
        /*EOQ*/
        cell = document.createElement('td');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valEOQ');
        if ('valEOQ' in d)
            cell.textContent = d.valEOQ;
        else
            cell.textContent = '';
        row.appendChild(cell);

        /*Costo totale*/
        cell = document.createElement('td');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valNL');
        if ('valEOQ' in d)
            cell.textContent = d.valNL;
        else
            cell.textContent = '';
        row.appendChild(cell);

        /*Numero lotti*/
        cell = document.createElement('td');
        cell.classList.add("numeric");
        cell.setAttribute('name', 'valCT');
        if ('valEOQ' in d)
            cell.textContent = d.valCT;
        else
            cell.textContent = '';
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.innerHTML = "<center><a href='#'><img src='/images/garbage.png' onclick='removeRow(this)' width='20px' /></a></center>";
        row.appendChild(cell);
        tabella.insertBefore(row, tabella.firstChild);

    });
}

/*caricaDatiDaFile
  Funzione che legge il file dati in formato csv e li visualizza nella tabella html
  I file consentiti devono avere il delimitatore ';' e la segunete intestazione 
  periodo - periodo di riferimento anno, mese, trimestre
  valS - valore Setup
  valH - valore costo gestione per prodotto per periodo
  valD - quantità domanda
  valC - costo unitario prodotto  
*/
function caricaDatiDaFile() {
    /*visualizzo il dialog per la selezione del file*/
    let input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('accept', '.csv');
    input.onchange = e => {
        /*se il file è selezionato lo converto da csv a json*/
        let file = e.target.files[0];       
        const reader = new FileReader();
        reader.onload = function (e) {
            fileJSON = csvToJson(e.target.result);
            if (fileJSON != '') {
                /*inserisco i dati del file nella tabella HTML*/
                inserisciDatiInTabella(fileJSON, true);
                showAlert('File dati', 'File ' + file.name + ' correttamente caricato');
            }
        }
        reader.readAsText(file);
    }
    input.click();
}

/*convertiTabella
funzione che converte la tabella html dati in formato JSON per l'elaborazione
*/
function convertiTabella(table) {
    let dt = document.getElementById(table);
    const dati = [];
    /*scorro tutti i tag riga <tr> della tabella*/ 
    dt.querySelectorAll('tr').forEach(tr => {
        const row = {};
        /*scorro tutte le celle della riga*/
        tr.querySelectorAll('td').forEach((td, i) => {
            /*se è una cella con attributo 'name' è una variabile e 
             la converto in numero e la inserisco nell'array di oggetti javascript*/
            if (td.getAttribute('name')) {
                row[td.getAttribute('name')] = parseFloat(td.textContent.trim() || 0);
            }
        });
        dati.push(row);
    });
    
    /*Converto l'array di oggetti in JSON se la tabella è piena*/
    return (dati.length > 0) ? JSON.stringify(dati) : "";

}


/*aggiungiRiga
  funzione per l'inserimento di una riga nella tabella dati, per l'inserimento manuale dei dati
  Parametri:
  Valore restituito:
  - il riferimento all'oggetto riga appena inserito
*/
function aggiungiRiga() {
    /*leggo i dati dal form modal*/  
    const dati = [];
    let riga = {};
    let flagFormValido = true;

    /*controllo i dati inseriti nel form*/
    let f = document.getElementById('formDati');
    let err = document.getElementById('modalError');
    Array.from(f.elements).forEach(function (input) {
        if (input.tagName === 'INPUT') {
            /*verifico se l'input è valido*/
            if (!controllaValore(input.value)) {
                /*se un valore non è valido fermo l'esecuzione*/
                flagFormValido = false;
                return;
            }
        }
    });
    /*form dati non valido, visualizzo di nuovo il form con un avviso*/
    if (!flagFormValido) {
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
    inserisciDatiInTabella(JSON.stringify(dati, false));
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
    if (controllaValore(campo.value)) {
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
function controllaValore(inputVal) {
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

/*svuotaTabella
Funzione per la rimozione di tutti i dati inseriti in tabella*/
function svuotaTabella() {
    document.getElementById("tabellaDati").innerHTML = "";
    clearResult();
}


/*showInserimentoDati 
    Funzione per la visualizazione del form inserimento dati di tipo modal.
    Parametro:
    - flagVuoto, boolean per aprire il modal pulito o no. Utilizzato per mostrarlo di nuovo in caso di errori;
    Pulisco e resetto le classi in caso di visualizzazione precedente.   
*/
function showInserimentoDati(flagVuoto) {
    /*istanzio l'oggetto Modal di bootstrap*/
    let modal = new bootstrap.Modal(document.getElementById('datainput'));
    /*visualizzo i campi per l'insermimento dati, se il flag è false visualizzo 
      i dati precedentemente insetiti, provengo da un inserimento parziale o errato*/
    if (flagVuoto) {
        let f = document.getElementById("formDati");
        let err = document.getElementById('modalError');
        err.style.display = 'none';
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

/*showResult
Funnzione che visualizza i risultati dell'elaborazione.
Vengono mostrati i valori dell'EOQ, dei costi totali, 
di ordinazione e mantenimento, oltre ai grafici con 
l'andamento della domanda e della dimensione del lotto*/
function showResult(data) {

    let d = JSON.parse(data);
    let txtRisultati=document.getElementById("testoRisultati");
    clearResult();
    txtRisultati.innerHTML="<h4>Risultati elaborazione</h4><br />" + 
                           "Periodo: <b>" + d[0].periodo + "</b><br />" +
                           "EOQ: <b>" + d[0].valEOQ + "</b><br />" +
                           "Costo mantenimento: <b>" + d[0].valCM + "</b><br />" +
                           "Costo ordinazione: <b>" + d[0].valCO + "</b><br />" +
                            "Costo totale: <b>" + d[0].valCT + "</b><br />"
    d.sort((a, b) => a.periodo - b.periodo);

    gEOQ = new Chart(
        document.getElementById('eoqGraphEOQ'),
        {
            type: 'line',
            data: {
                labels: d.map(row => row.periodo),
                datasets: [
                    {
                        label: 'EOQ',
                        data: d.length ? d.map(row => row.valEOQ) : []
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Grafico EOQ',
                        font: { size: 16 }
                    }
                }
            }
        }
    );
    gDomanda = new Chart(
        document.getElementById('eoqGraphD'),
        {
            type: 'line',
            data: {
                labels: d.map(row => row.periodo),
                datasets: [
                    {
                        label: 'Domanda annua',
                        data: d.map(row => row.valD),
                        borderColor: 'rgba(255, 99, 132, 52)'
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Grafico Domanda annua',
                        font: { size: 16 }
                    }
                }
            }
        }
    );
}

function clearResult() {
    document.getElementById("testoRisultati").innerHTML="";
    if (gEOQ) gEOQ.destroy();
    if (gDomanda) gDomanda.destroy();
}

/*infoForecast
    Visualizza un alert con le informazioni sul forecast
    Parametri:
    - checked, boolean se true viene visualizza l'alert
*/
function infoForecast(checked) {
    if (checked) {
        showAlert('Informazioni previsione domanda', 'Selezionando la previsione verrà stimata la domanda di beni.' +
            '<br />Viene utilizzato il modello di stima autoregressivo <b>ARIMA</b> per serie stazionarie. ' +
            'La previsione è per un solo periodo.');
    }
}


/*showButton 
    Funzione per la visualizazione dinamica del form inserimento dati se inseriti manualmente o inseriti tramite file csv.
    Parametri: 
    - btnID, valore id dell'input di tipo button da visualizzare.
*/
/*function showButton(btnID) {
    document.getElementById(btnID).classList.remove("invisible");
    document.getElementById(btnID).classList.add("visible");
    if (btnID === "btnInserisciDati") {
        document.getElementById("btnFileDati").classList.add("invisible");
        document.getElementById("btnFileDati").classList.remove("visible");
        document.getElementById('fileSelezionato').innerHTML = "";
    }
    if (btnID === "btnFileDati") {
        document.getElementById("btnInserisciDati").classList.add("invisible");
        document.getElementById("btnInserisciDati").classList.remove("visible");
    }

}*/