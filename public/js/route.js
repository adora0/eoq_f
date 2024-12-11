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
        /*variabile per il caricamento dei parametri*/
        const data = new URLSearchParams(); 
        /*trasformo la tabella dati da html a json*/
        let dati=convertiTabella(tabellaDati);
        /*verifico che la tabella non sia vuota*/
        if(dati=="") {
            showAlert('Attenzione', 'Tabella dati vuota');
            return;
        }
        document.getElementById("spinner").style.display = 'inline-block';    
        /*aggiungo i dati json alla variabile data*/
        data.append("dati",convertiTabella(tabellaDati));        
                
        /*verifico se è stato selezionata la richiesta di previsioni*/
        if(document.getElementById("checkForecast").checked){
            data.append("flagPrev",1);            
        }else{
            data.append("flagPrev", 0);
        }
        /*richiamo l'endopoint con metodo POST passando i dati*/      
        await fetch('/elab', {
            method: "POST",
            body:data
        }).then(function (response) { 
            /*se la risposta è 'ok' restituisco i dati json*/
            if(response.ok)                                 
                return response.text();
            else 
            /*in caso di errore sollevo l'eccezione*/
                throw new Error('Problema nel modulo Python');
        }).then(function (data) {             
            /*Se tutto bene, aggiorno la parte della pagina con il nuovo contenuto  */                   
            inserisciDatiInTabella(data,true);
            /*aggiorno i risultati*/
            showResult(data);
        }).catch(function(error) {
            showAlert('Errore', 'Errore durante il calcolo EOQ:' + error);
        });
        document.getElementById("spinner").style.display = 'none';
}

/************showParams
  Funzione che richiama l'endpoint /params per il caricamento della porzione di pagina
  per l'inserimento dei parametri di calcolo dell'EOQ e  relativo output.
  Valore restituito:
  file html: params.html file con i campi da compilare per il calcolo dell'EOQ
*/
async function showParams() {
    try {
        /*richiamo l'endpoint con il metodo POST*/
        await fetch('/params', {
            method: "POST"
        }).then(function (response) {
            /*restituisco la response dal server in formato testo/html*/
            return response.text();
        }).then(function (data) {
            /*Aggiorna la parte della pagina con il nuovo contenuto*/
            document.getElementById('main').innerHTML = data;
        });
    /*catturo eventuali errori*/    
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
        /*richiamo l'endpoint info con metodo POST*/
        await fetch('/info', {
            method: "POST"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            /*Aggiorna la parte della pagina con il nuovo contenuto*/
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
