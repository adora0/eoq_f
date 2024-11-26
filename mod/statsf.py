
import os

from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA
from statsforecast.utils import AirPassengersDF

os.environ['NIXTLA_ID_AS_COL'] = '1'
df = AirPassengersDF
type(df)
df.head()
sf = StatsForecast(
    models = [AutoARIMA(season_length = 1)],
    freq = 'Y'
)

sf.fit(df)
forecast=sf.predict(h=12, level=[95])
forecast.tail()
sf.plot(df, forecast, level=[95] )
