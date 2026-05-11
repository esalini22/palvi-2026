import * as React from 'react';
import Collections from "./components/Collections"
import Metrics from './components/Metrics';
import Plot from './components/Plot';
import { type DaysType, type MetricType } from './types';

function App() {
  const [collection, setCollection] = React.useState('');
  const [metric, setMetric] = React.useState<MetricType|null>(null);
  const [days, setDays] = React.useState<DaysType[]>([])

  return (
    <>
      <Collections collection={collection} setCollection={setCollection}/>
      {collection && <Metrics collection={collection} metric={metric?.key} setMetric={setMetric} />}
      {collection && metric && <Plot collection={collection} metric={metric.key} direction={metric.direction} days={days} setDays={setDays}/>}
    </>
  )
}

export default App
