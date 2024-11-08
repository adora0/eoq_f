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
                await fetch('/elab',{
					method:"POST"					
					}).then(function(response){
                        return response.json();
                    }).then(function (data){
                        // Aggiorna la parte della pagina con il nuovo contenuto
                        document.getElementById('result').innerHTML = data;
                    });               
            } catch (error) {
                document.getElementById('error').innerHTML='Errore durante il richiamo della funzione:'+ error;
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
                await fetch('/params',{
					    method:"POST"					
					}).then(function(response) {
                        return response.text();
                    }).then(function(data){
                        //Aggiorna la parte della pagina con il nuovo contenuto
                        document.getElementById('parametri').innerHTML=data;
                    });
            } catch (error) {
				console.log(error);
                document.getElementById('error').innerHTML='Errore durante il richiamo della funzione';
            }
        }