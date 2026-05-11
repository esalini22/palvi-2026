import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getCollections } from '../../services'

type PropsType = {
    collection: string,
    setCollection: React.Dispatch<React.SetStateAction<string>>
}

const DropdownCollections = (props: PropsType) => {
    
    const handleChange = (event: SelectChangeEvent) => {
        props.setCollection(event.target.value as string);
    };

    const { status: statusCollections, data: dataCollections, error: errorCollections } = useQuery({
        queryKey: ['get_collections'],
        queryFn: () => getCollections(),
    })

    console.log(dataCollections)

    if (statusCollections === 'pending' || errorCollections!=null) {
        return null;
    }

    return (
        <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.collection}
            label="Dataset"
            onChange={handleChange}
            >
            {dataCollections.map((c: string) => <MenuItem value={c}>{c}</MenuItem>)}
            </Select>
        </FormControl>
        </Box>
    );
}

const Collections = (props: PropsType) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <DropdownCollections collection={props.collection} setCollection={props.setCollection}/>
        </QueryClientProvider>
    );
}

export default Collections