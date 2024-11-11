/*************************************************************************
 * Applicazione calcolo Lotto Economico di Acquisto
 * Project Work Traccia 1.1 Lotto Economico di Ordinazione (EOQ) per 
   materiali a domanda indipendente
 * Autore: Andrea D'Orazio
 * Matricola: 0312300107
 * Corso di Laura: Informatica per le Aziende Digitali L-31 a.a. 2024/2025
 * repository git : https://github.com/adora0/eoq_f/
 * Descrizione: Applicazione javascript, utilizza NodeJS per l'esecuzione 
   di un server web minimale che implementa un'applicazione web
   per il calcolo del lotto economico di acquisto.
   Le elaborazioni di tipo matematico/statistico sono sviluppate in Python
 ************************************************************************/
 
/*librerie utilizzate per l'applicazione server*/ 
const express = require('express');
const path = require('path');
const fs = require('fs');
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
	return console.log('[' + tipo +'] ' + new Date().toLocaleTimeString() + ' - ' + text) ;
}

/*imposto il folder public con le parti statiche dell'applicazione*/
app.use(express.static('public'));


/*endpoint homepage applicazione - index.html*/
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public' , 'index.html'));
    log('Inviato file index.html','INFO');
});

/*endpoint /params
    invio di frammento codice html -file params.html-
*/
app.post('/params', (req, res) => {
	/*fs.readFile(path.join(__dirname, 'public' , 'params.html') , 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file:', err);
            return res.status(500).send('Errore nel caricamento del contenuto');
        }		
        res.sendFile(data);    
	});*/
    res.sendFile(path.join(__dirname, 'public' , 'params.html'));
    log('Inviato file params.html','INFO');
   
});

/*endpoint /elab
    richiamo delle funzioni Python per il calcolo dell'EOQ
*/
app.post('/elab', (req, res) => {

    const firstNum = 4;
    const secondNum = 7;

    let dataToSend;
    // spawn new child process to call the python script 
    // and pass the variable values to the python script
    const python = spawn('python', [path.join(__dirname,'mod','core.py'), firstNum , secondNum]);
    // collect data from script
    python.stdout.on('data', function (data) {
        log('Inizio esecuzione script python', 'INFO');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        log(`Codice esecuzione script python ${code} - [0=OK]`);
        // send data to browser
        res.json(dataToSend);
    });

    log('Richiesta elaborazione EOQ', 'INFO')
});


/*inizio ascolto del server su porta 3000*/
app.listen(port, () => {
    log(`Server web in ascolto sulla porta:${port}`,'INFO');
});


