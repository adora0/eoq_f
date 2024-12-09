##########################################################################
# Web Application calcolo Lotto Economico di Ordinazione
# Project Work Traccia 1.1 Lotto Economico di Ordinazione (EOQ) per 
#  materiali a domanda indipendente
# Autore: Andrea D'Orazio
# Matricola: 0312300107
# Corso di Laurea: Informatica per le Aziende Digitali L-31 a.a. 2024/2025
# repository git : https://github.com/adora0/eoq_f/
# Descrizione: Modulo Python per il calcolo del Lotto Economico di Ordinazione
#  Il modulo viene richiamato da un applicativo esterno e riceve i dati come
#  argomento.
 ########################################################################/
 

# import delle librerie
import sys
import os
import json
import traceback
import numpy as nm
import pandas as pd

#package StatsForecast https://github.com/Nixtla/statsforecast
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA
from datetime import datetime

#calcola_EOQ - Modulo per il calcolo del lotto economico di ordinazione
# Parametri: 
#  df, dataframe con i parametri di calcolo
# Valore restituito:
#  dataframe, con i valori di EOQ, numero lotti e costi totali
def calcola_EOQ(df):
    #applico la formula per il calcolo dell"EOQ : sqrt((2*D*S)/(H))
    df["valEOQ"]=round(nm.sqrt((2 * df["valS"] * df["valD"] / df["valH"])),0)
    #calcolo numero di lotti: D/EOQ
    df["valNL"]=round(df["valD"]/df["valEOQ"], 0)
    #calcolo costi immagazzinamento
    df["valCM"]=round(df["valH"] * (df["valEOQ"] / 2 ),0)
    #calcolo costi di ordinazione
    df["valCO"]=round((df["valD"]/df["valEOQ"])*df["valS"],0)
    #calcolo costo totale 
    # df["valCT"]=round(((df["valD"]/df["valEOQ"])*df["valS"] ) 
       #                  + (df["valH"] * (df["valEOQ"] / 2 )) 
    #                     + (df["valEOQ"] * df["valC"]),0)
    df["valCT"]=df["valCM"] +df["valCO"] +  (df["valD"] * df["valC"])
    
    return df

#calcola_forecast - Modulo per il calcolo della previsione domanda
# Utilizza il modello AutoARIMA del package StatsForecast
# https://nixtlaverse.nixtla.io/statsforecast/src/core/models.html
# Parametri: 
#  df, dataframe con la serie storica dei dati
# Valore restituito:
#  dataframe, completo con un periodo di previsione.
def calcola_forecast(df):    
    #imposto il dataframe per l'utilizzo del modello
    data_f = pd.DataFrame({
        'unique_id':'eoq_f',
        'ds':df['periodo'],
        'y':df['valD']
    })
    
    #configuro il modello AutoARIMA, con frequenza annuale
    sf = StatsForecast(
        models = [AutoARIMA(
            stepwise=True, #scelta dei parametri velocizzata
            seasonal=False,  #disabilito la stagionalità                         
            season_length = 1, #dati annuali            
            )],
        freq = 1 #frequenza annuale
    )
    #addestro il modello con i dati
    sf.fit(data_f)
    #richiamo la predict per stimare un periodo
    eoq_f=sf.predict(h=1)
    eoq_f['AutoARIMA']=round(eoq_f['AutoARIMA'],0)   
    return eoq_f


try:
    #parametro per il package StatsForecast
    os.environ["NIXTLA_ID_AS_COL"] = "1"

    #leggo i dati passati in json
    dati = json.loads(sys.argv[1])
    dati_tabella = json.loads(dati["dati"]) #tabella dati
    flag_previsione = json.loads(dati["flagPrev"])#flag se richiesta previsione       

    #creo il DataFrame del package Pandas
    dati_mag=pd.DataFrame(dati_tabella)
    
    #se flag_previsione è uguale a 1 eseguo la previsione
    if flag_previsione == 1 : 
        dati_c=calcola_forecast(dati_mag)
        #riga previsione 
        previsione=dati_mag.head(1).copy()
        previsione.loc[0,('valD')]=dati_c.loc[0,('AutoARIMA')]
        previsione.loc[0,('periodo')]=dati_c.loc[0,('ds')]
        #aggiungo la previsione al dataset
        dati_mag = pd.concat([previsione,dati_mag])
   
    #richiamo la funzione per il calcolo dell'EOQ
    calcola_EOQ(dati_mag)

    #trasformo il dataframe in json e lo restituisco 
    print(dati_mag.to_json(orient="records"))
    #codice fine processo OK
    exit(0)

#gestione eccezioni
except Exception as e: 
    print(f"Errore inaspettato: {e}", file=sys.stderr)
    traceback.print_exc()
    #codice fine processo con errore
    exit(1)