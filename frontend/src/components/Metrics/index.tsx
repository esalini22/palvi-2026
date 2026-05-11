import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getMetrics } from '../../services'
import { type MetricType } from '../../types';

type PropsType = {
    collection: string
    metric: string|undefined,
    setMetric: React.Dispatch<React.SetStateAction<MetricType|null>>
}

const DropdownMetrics = (props: PropsType) => {
    
    const handleChange = (event: SelectChangeEvent) => {
        const selectedMetric = dataMetrics.find(
            (metric: MetricType) => metric.key === event.target.value
        );

        if (selectedMetric) {
            props.setMetric(selectedMetric);
        }
    };

    const { status: statusMetrics, data: dataMetrics, error: errorMetrics } = useQuery({
        queryKey: ['get_metrics', props.collection],
        queryFn: () => getMetrics(props.collection),
    })

    console.log(dataMetrics)

    if (statusMetrics === 'pending' || errorMetrics!=null) {
        return null;
    }

    return (
        <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Métrica</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.metric}
            label="Dataset"
            onChange={handleChange}
            >
            {dataMetrics.map((c: MetricType) => <MenuItem value={c.key}>{c.label}</MenuItem>)}
            </Select>
        </FormControl>
        </Box>
    );
}

const Metrics = (props: PropsType) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <DropdownMetrics collection={props.collection} metric={props.metric} setMetric={props.setMetric}/>
        </QueryClientProvider>
    );
}

export default Metrics