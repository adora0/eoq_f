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
    df["valEOQ"]=nm.int16(nm.sqrt((2 * df["valS"] * df["valD"] / df["valH"])))

def calcola_forecast(df):    
    #datas=df.loc[:,("periodo","valS")]   
    #datas=datas.rename(columns={"valS": "y", "periodo": "ds"})
   # datas["unique_id"]= "D"
    data_f = pd.DataFrame({
        'unique_id':'eoq_f',
        'ds':df['periodo'],
        'y':df['valH']
    })

    sf = StatsForecast(
        models = [AutoARIMA(season_length = 1)],
        freq = 1
    )

    forecast=sf.forecast(h=1, df=data_f)
    #forecast=sf.predict(h=1)
    print(forecast)    
    return forecast
   


try:
    os.environ["NIXTLA_ID_AS_COL"] = "1"   
    dati_tabella='[{"periodo": 2024, "valC": 230, "valS": 960, "valH": 127, "valD": 1961, "valEOQ": 0, "valCT": 0}, {"periodo": 2023, "valC": 203, "valS": 954, "valH": 144, "valD": 2050, "valEOQ": 0, "valCT": 0}, {"periodo": 2022, "valC": 214, "valS": 945, "valH": 163, "valD": 2051, "valEOQ": 0, "valCT": 0}, {"periodo": 2021, "valC": 232, "valS": 942, "valH": 154, "valD": 1993, "valEOQ": 0, "valCT": 0}, {"periodo": 2020, "valC": 242, "valS": 946, "valH": 142, "valD": 1638, "valEOQ": 0, "valCT": 0}, {"periodo": 2019, "valC": 222, "valS": 945, "valH": 148, "valD": 1701, "valEOQ": 0, "valCT": 0}, {"periodo": 2018, "valC": 220, "valS": 950, "valH": 164, "valD": 1888, "valEOQ": 0, "valCT": 0}, {"periodo": 2017, "valC": 233, "valS": 962, "valH": 173, "valD": 1564, "valEOQ": 0, "valCT": 0}, {"periodo": 2016, "valC": 248, "valS": 981, "valH": 163, "valD": 1680, "valEOQ": 0, "valCT": 0}, {"periodo": 2015, "valC": 236, "valS": 1000, "valH": 143, "valD": 1834, "valEOQ": 0, "valCT": 0}, {"periodo": 2014, "valC": 237, "valS": 985, "valH": 160, "valD": 2130, "valEOQ": 0, "valCT": 0}, {"periodo": 2013, "valC": 233, "valS": 996, "valH": 170, "valD": 2164, "valEOQ": 0, "valCT": 0}, {"periodo": 2012, "valC": 213, "valS": 986, "valH": 158, "valD": 2561, "valEOQ": 0, "valCT": 0}, {"periodo": 2011, "valC": 228, "valS": 999, "valH": 152, "valD": 2213, "valEOQ": 0, "valCT": 0}, {"periodo": 2010, "valC": 211, "valS": 1009, "valH": 137, "valD": 2362, "valEOQ": 0, "valCT": 0}, {"periodo": 2009, "valC": 215, "valS": 996, "valH": 156, "valD": 2448, "valEOQ": 0, "valCT": 0}, {"periodo": 2008, "valC": 227, "valS": 981, "valH": 174, "valD": 2125, "valEOQ": 0, "valCT": 0}, {"periodo": 2007, "valC": 239, "valS": 994, "valH": 188, "valD": 1768, "valEOQ": 0, "valCT": 0}]';
    #genero il DataFrame del package Pandas
    df=pd.DataFrame(json.loads(dati_tabella))
    #df=pd.read_json(dati_tabella)
    print(df)
    frc=calcola_forecast(df)
    print(frc)
    previsione=pd.DataFrame({
        'periodo':frc['ds'].head(1),
        'valD':frc['AutoARIMA'].head(1)
    })
 
    df=pd.concat([previsione,df])   
    #richiamo la funzione per il calcolo
    calcola_EOQ(df)

    #restituisco il dataframe come json 
    print(df)
    #print(df.to_json(orient="records"))
    exit(0)

except Exception as e: 
    print(f"Errore inaspettato: {e}", file=sys.stderr)
    traceback.print_exc()
    exit(1)