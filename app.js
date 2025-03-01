/*************************************************************************
 * Applicazione calcolo Lotto Economico di Ordinazione
 * Project Work Traccia 1.1 Lotto Economico di Ordinazione (EOQ) per 
    materiali a domanda indipendente
 * Autore: Andrea D'Orazio
 * Matricola: 0312300107
 * Corso di Laurea: Informatica per le Aziende Digitali L-31 a.a. 2024/2025
 * repository git : https://github.com/adora0/eoq_f/
 * Descrizione: Applicazione javascript, utilizza NodeJS per l'esecuzione 
    di un server web minimale che implementa un'applicazione web per il 
    calcolo del lotto economico di ordinazione.
    Le elaborazioni di tipo matematico/statistico sono implementate in un
    modulo esterno Python richiamato come sotto-processo (child_process)
 ************************************************************************/
 
/*librerie utilizzate per l'applicazione server*/ 
const express = require('express');
const path = require('path');

const fs = require('fs');
/*oggetto per l'esecuzione di sotto-processi*/
const { spawn } = require('child_process');

/*istanza dell'applicazione express*/
const app = express();
/*porta di ascolto*/
const port = 3000;

/*funzione per la stampa del log nella console di nodejs
 Parametri:
 text, testo del messaggio
 tipo, tipologia messaggio (info, warn, errore)*/
const log = function(text, tipo) {
	return console.log('[' + tipo +'] ' 
        + new Date().toLocaleString() + ' - ' + text) ;
}

/*imposto il folder public con le parti statiche dell'applicazione*/
app.use(express.static('public'));
/*imposto express per la ricezione dei parametri in JSON via POST*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


/*inizio ascolto del server su porta 3000*/
app.listen(port, () => {
    log(`Server web in ascolto sulla porta:${port}`,'INFO');
});

/********************ENDPOINT DI ASCOLTO**************/

/*endpoint homepage applicazione - index.html*/
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public' , 'index.html'));
    log('Inviato file index.html','INFO');
});

/*endpoint /params
    invio di frammento codice html -file params.html-
*/
app.post('/params', (req, res) => {
	res.sendFile(path.join(__dirname, 'public' , 'params.html'));
    log('Inviato file params.html','INFO');   
});

/*endpoint /info
    invio di frammento codice html -file info.html-
*/
app.post('/info', (req, res) => {
	res.sendFile(path.join(__dirname, 'public' , 'info.html'));
    log('Inviato file info.html','INFO');   
});


/*endpoint /elab
    richiamo delle funzioni Python per il calcolo dell'EOQ
*/
app.post('/elab', (req, res,next) => {

    log('Richiesta elaborazione EOQ', 'INFO');
    const datiAcquisti=req.body;     
  
    /*Creo il processo di esecuzione codice python, passando i dati come 
    argomento e il timeout per la gestione degli errori */
    const python = spawn('python', 
                         [path.join(__dirname,'pyelab','eoq_elab.py'), 
                         JSON.stringify(datiAcquisti)]);
    /*Funzione callback per la lettura dell'output del sotto-processo */
    python.stdout.on('data', function (data) {        
        log(`Codice python eseguito con successo`,'INFO');   
        res.send(data);        
    });
    /*Funzione callback per la lettura di errori del sottoprocesso*/
    python.stderr.on('data', (data) => {
        log(`Errore: ${data}`,'ERROR'); 
    });

    /*Funzione callback di termine del sotto-processo.
    * se il code è diverso da zero l'esecuzione non è andata a buon fine e
    * invio l'HTTP code 500 - internal server error
    */
    python.on('close', (code) => {
        if(code!=0){
            log(`Errore esecuzione codice python code:[${code}]`,'ERROR');
            res.status(500).send('KO');            
        }                     
    });
   
});
 


/***DA RIMUOVERE */
//const anno = new Date().getFullYear();
/*endpoint /datidomanda
Funzione per la lettura di una serie storica di dati. Per le fasi di test e presentazione genera valori casuali .
Viene utilizzata la funzione javascript Math.random() che genera un valore decimale compreso tra 0 e 1.
Valore restituito:
 - dati, oggetto json con gli array dei valori casuali in serie storica di Costo unitario, Costo setup, costo mantenimento, Domanda
*/
/*app.post('/datidomanda',(req,res) => {   
    //genero valori di base random per le varie componenti di calcolo
    log('datidomanda','INFO');
    let aa = anno; //ultimo anno serie storica
    let dati = [];
    let maxVariazione = 0.5;    
    let valD = Math.round(Math.random() * (100000 - 1000) + 1000);  
    let valC = Math.round(Math.random() * (1001 - 50) + 50); 
    let valS = Math.round(Math.random() * (1000 - 100) + 100);    
    let valH = Math.round(Math.random() * valC); 
    //genero un array di indici tra -1 e 1 che rappresentano la variazione della domanda in serie storica
    let indici = Array.from({length: req.body.n}, (_,i) => Math.random() * (Math.random() < 0.5 ? -1 : 1));
    //genero l'array dei dati in serie storica con una variazione della base al massimo di un 10%/
    for(let i=0; i<indici.length; i++){  
        periodo = aa--;      
        valD += Math.floor((Math.random() * 2 - 1) * maxVariazione);
        valC += Math.floor((Math.random() * 2 - 1) * maxVariazione);
        valH += Math.floor((Math.random() * 2 - 1) * maxVariazione);
        valS += Math.floor((Math.random() * 2 - 1) * maxVariazione);       
        dati.push({
            periodo: periodo, 
            valD: valD, 
            valC: valC, 
            valH: valH, 
            valS: valS
        });
    }   
    res.send(dati);
});*/

