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
			    
                const response = await fetch('/elab',{
					method:"POST"					
					});
                const data = await response.json();
                
                // Aggiorna la parte della pagina con il nuovo contenuto
                document.getElementById('result').innerHTML = data;
            } catch (error) {
                document.getElementById('error').innerHTML='Errore durante il richiamo della funzione:'+ error;
            }
        }
		
/*showParams
  Funzione che richiama la routing path /params per la visualizzazione
  e la possibilità di inserimento dei parametri per il calcolo dell'EOQ.
  Valore restituito:
  file html:
*/
    async function showParams() {		
            try {
			    
                const response = await fetch('/params',{
					method:"POST"					
					});
                const data = await response;                
                // Aggiorna la parte della pagina con il nuovo contenuto
				console.log(data.text());
                document.getElementById('main').innerHTML=data.text;
            } catch (error) {
				console.log(error);
                document.getElementById('error').innerHTML='Errore durante il richiamo della funzione';
            }
        }