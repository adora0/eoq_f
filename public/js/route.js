/*libreria javascript - Web Application EOQ Lotto Economico di Ordinazione
 routing delle request
 */

/************elaboraEOQ
  Funzione che richiama l'endpoint /elab per il calcolo del valore EOQ
  I parametri per il calcolo vengono letti dai campi della pagina html
  Valore restituito:
  oggetto json:
    - EOQ, valore del lotto ecnomico d'acquisto
    - CTot, costo totale di riordino
    - error. evventuale errore nel calcolo o nei parametri inviati
*/
async function elaboraEOQ(tabellaDati) {    
        const data = new URLSearchParams(); 
        let dati=convertiTabella(tabellaDati);

        if(dati=="") {
            showAlert('Attenzione', 'Tabella dati vuota');
            return;
        }
        document.getElementById("spinner").style.display = 'inline-block';    
        data.append("dati",convertiTabella(tabellaDati));        
                
        /*verifico se è stato selezionata la richiesta di previsioni*/
        if(document.getElementById("checkForecast").checked){
            data.append("flagPrev",1);            
        }else{
            data.append("flagPrev", 0);
        }
              
        await fetch('/elab', {
            method: "POST",
            body:data
        }).then(function (response) { 
            if(response.ok)                                 
                return response.text();
            else 
                throw new Error('Problema nel modulo Python');
        }).then(function (data) {             
            /* Aggiorna la parte della pagina con il nuovo contenuto  */                   
            inserisciDatiInTabella(data,true);
            showResult(data);
        }).catch(function(error) {
            showAlert('Errore', 'Errore durante il calcolo EOQ:' + error);
        });
        document.getElementById("spinner").style.display = 'none';
}

/************showParams
  Funzione che richiama l'endpoint /params per la visualizzazione
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



/************showInfo
  Funzione che richiama l'endpoint /info per la visualizzazione delle 
  informazioni riguardanti le modalità di uso dell'applicativo.
  Valore restituito:
  file html: info.html
*/
async function showInfo() {
    try {
        await fetch('/info', {
            method: "POST"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            //Aggiorna la parte della pagina con il nuovo contenuto
            document.getElementById('main').innerHTML = data;
        });
    } catch (error) {
        showAlert('Errore', 'Errore durante il richiamo della pagina di informazioni' + error);
    }
}


/****DA RIMUOVERE**************/
/*************generaDati
   Funzione per la generazione di una serie storica casuale.
   Richiama l'endpoint /datidomanda per la generazione di una serie storica casuale.
*/
/*async function caricaDati() {
    let numAnni = 20;
    
    try {        
        const data = new URLSearchParams();
        data.append("n",numAnni);
        await fetch('/datidomanda', {
            method: "POST",            
            body: data
        }).then(function (response) {
            return response.text();
        }).then(function(data){
            inserisciDatiInTabella(data);
        });
    } catch (error) {
        showAlert('Errore', 'Errore durante la generazione di dati' + error);
    }
}*/
