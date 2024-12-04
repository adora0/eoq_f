# import system library
import sys
import os
import json
import traceback
import numpy as nm
import pandas as pd
#import del package StatsForecast https://github.com/Nixtla/statsforecast
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA
from datetime import datetime

#Funzioane per il calcolo del lotto economico di ordinazione
def calcola_EOQ(df):
    #applico la formula per il calcolo dell"EOQ : sqrt((2*D*S)/(H))
    df["valEOQ"]=round(nm.sqrt((2 * df["valS"] * df["valD"] / df["valH"])),0)
    df["valNL"]=round(df["valD"]/df["valEOQ"], 0)
    df["valCT"]=round(((df["valD"]/df["valEOQ"])*df["valS"] ) 
                         + (df["valH"] * (df["valEOQ"] / 2 )) 
                         + (df["valD"] * df["valC"]),0)

#https://nixtlaverse.nixtla.io/statsforecast/src/core/models.html
def calcola_forecast(df, n_previsioni):    
    #creo una copia dei dati con solo la serie storica della domanda
    data_f = pd.DataFrame({
        'unique_id':'eoq_f',
        'ds':df['periodo'],
        'y':df['valD']
    })
    
    #imposto il modello AutoARIMA, con frequenza annuale
    sf = StatsForecast(
        models = [AutoARIMA(
            stepwise=True, #scelta dei parametri velocizzata
            seasonal=False,  #disabilito la stagionalità                         
            season_length = 1, #dati annuali            
            )],
        freq = 1
    )
    #addestro il modello con i dati
    sf.fit(data_f)
    #richiamo la predict per stimare 1 periodo
    eoq_f=sf.predict(h=1)
    eoq_f['AutoARIMA']=round(eoq_f['AutoARIMA'],0)
    #ripristino i nomi delle variabili per il valore di return
    return eoq_f


try:
    os.environ["NIXTLA_ID_AS_COL"] = "1"

    #leggo i dati passati e li formatto in json
    dati = json.loads(sys.argv[1])
    dati_tabella = json.loads(dati["dati"])
    flag_previsione = json.loads(dati["flagPrev"])
    n_previsioni = int(json.loads(dati["nPrev"]))
      
      
    #genero il DataFrame del package Pandas
    dati_mag=pd.DataFrame(dati_tabella)
    
    dati_c=calcola_forecast(dati_mag, n_previsioni)
    #aggiungo la previsione ai dati
    previsione=dati_mag.head(1).copy()
    previsione.loc[:,('valD')]=dati_c.loc[:,('AutoARIMA')]
    previsione.loc[:,('periodo')]=dati_c.loc[:,('ds')]

    #aggiungo la previsione al dataset
    dati_f = pd.concat([previsione,dati_mag])

    #richiamo la funzione per il calcolo
    calcola_EOQ(dati_f)

    #restituisco il dataframe come json 
    print(dati_f.to_json(orient="records"))
    exit(0)

except Exception as e: 
    print(f"Errore inaspettato: {e}", file=sys.stderr)
    traceback.print_exc()
    exit(1)