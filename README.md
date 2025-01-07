## eoq_f
**Project Work - Corso di Laurea in Informatico per le Aziende Digitali L31**  
**Tema n. 1 La digitalizzazione dell’impresa**  
**Traccia 1.1 Lotto Economico di Ordinazione (EOQ) per materiali a domanda indipendente**  
**Autore: Andrea D'Orazio (matricola 0312300107)**  
*Anno accademico : 2024/2025*  

Applicazione web per il calcolo del Lotto Economico di Ordinazione  
**Tecnologia utilizzata:**
HTML5, CSS Bootstrap
Javascript: NodeJS v18.18.0, Express, Bootstrap, ChartJS
Python 3.8.10, Numpy, Pandas, StatsForecast  

Demo dell'applicazione disponibile all'indirizzo : http://82.165.144.82:3000/  
### Requisiti installazione:
*Python*
Installare python versione 3.8.10 o superiore e i seguenti pacchetti(controllare file *requirements.txt*)
- Numpy
- Pandas
- StatsForecast

*NodeJS*
Installare  nodejs versione 18 o superiore con i seguenti pacchetti:
- Express

*Javascript*
Le librerie javascript necessarie sono già disponibili nella cartella /public/js
- Bootstrap v5.3.3
- ChartJS v4.4.7

### Esecuzione in locale
Avviare l'applicazione Node con il comando 
`node app`

Accedere dal browser all'indirizzo **http://localhost:3000**
Premere su *EOQ* per visualizzare la pagina per l'inserimento dei dati.
E' necessario inserire i dati relativi a :
- Periodo di riferimento (ad esempio l'anno)
- Costo unitario del prodotto (C)
- Costo setup ordine (S)
- Costo mantenimento (H)
- Valore Domanda (D)

I dati possono essere inseriti col pulsante *Aggiungi dati* per l'insermimento manuale di una 
riga alla volta, o in alternativa con il pulsante *Carica dati* per il caricamento da file **csv** con i dati relativi a più periodi.

**Struttura del file .csv**
Il file deve essere strutturato nel seguente modo :
- intestazione con le variabili  
| Periodo | valC | valS | valH | valD |  
| --- | --- | --- | --- | --- |
- il separatore deve essere il *punto e virgola* `;`  
Nella cartella del progetto *dati_esempio* sono presenti dei file già predisposti per eseguire i test dell'applicazione.

Per procedere con il calcolo premere sul pulsante *Calcola EOQ* .
E' possibile spuntare la voce *Aggiungi proiezione* per aggiungere al calcolo la stima della domanda annua
per il periodo t+1. La stima applica il modello di previsione AutoARIMA senza stagionalità *utilizzare solo per
serie storiche superiori ai 15 periodi*.

**OUTPUT**
La tabella viene aggiornata con i dati relativi a :
- valore EOQ
- numero di lotti nel periodo
- Costo totale, calcolato con la somma dei costi di mantenimento, ordinazione e acquisto

Nel riquadro **Risultati elaborazione** verranno mostrati i valori dell'ultimo periodo calcolato :
- valore EOQ
- costo di mantenimento totale per il periodo
- costo di ordinazione totale per il periodo
- Costo totale per il periodo
L' output è corredato di deu grafici relativi all'andamento del lotto economico di ordinazione e domanda annua

### Struttura cartelle del progetto  
```plaintext
/eoq_f  
|-- /public  
|   |-- index.html  
|   |-- info.html  
|   |-- params.html  
|   |-- /css  
|       |-- bootstrap.min.css  
|       |-- bootstrap.min.css.map  
|       |-- stile.css  
|   |-- /js  
|       |-- bootstrap.bundle.min.js  
|       |-- bootstrap.bundle.min.js.map  
|       |-- chart.js  
|       |-- route.js  
|       |-- script.js  
|   |-- /images  
|       |-- garbage.png  
|       |-- home_img.png  
|-- /pyelab  
|   |-- eoq_elab.py  
|   |-- requirements.txt  
|-- /dati_esempio     
|-- package.json  
|-- README.md  
```
**/public**: Contiene file pubblici accessibili direttamente dal browser, file HTML e sottocartelle per file CSS e JavaScript.  
**/pyelab**: Contiene  il codice python per il calcolo dell'EOQ.  
**/dati_esempio**: Contiene file csv di esempio per il calcolo dell'EOQ.  
**package.json**: File di configurazione per il progetto, contiene dipendenze e script.  
**README.md**: Documentazione del progetto.  
