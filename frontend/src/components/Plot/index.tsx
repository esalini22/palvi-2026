import * as React from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDays } from '../../services'
import { type DaysType } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

type PropsType = {  
    collection: string,
    metric: string,
    direction: string,
    days: DaysType[]
    setDays: React.Dispatch<React.SetStateAction<DaysType[]>>
}

const PlotQuery = (props: PropsType) => {

    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs())

    const { status: statusDays, data: dataDays, error: errorDays } = useQuery({
        queryKey: ['get_collections'],
        queryFn: () => getDays(props.collection, props.metric),
    })

    console.log(dataDays)

    if (statusDays === 'pending' || errorDays!=null) {
        return null;
    }

    const filteredData = dataDays.filter((item: DaysType) => {
        let startDateString = startDate?.format("YYYY-MM-DD");
        let endDateString = endDate?.format("YYYY-MM-DD");
        if(startDateString===undefined) startDateString = '2000-01-01'
        if(endDateString===undefined) endDateString = '2000-01-01'
        return item.date >= startDateString && item.date <= endDateString
    });

    //return hecho con IA
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                        label="Fecha de Inicio"
                        value={startDate}
                        format="DD-MM-YYYY"
                        onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
                    />
                    <DatePicker
                        label="Fecha de Término"
                        value={endDate}
                        format="DD-MM-YYYY"
                        onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                    />
                </DemoContainer>
            </LocalizationProvider>
            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={filteredData}>     
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis reversed={props.direction==='lower_is_better'}/>
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="metric"
                        stroke="#8884d8"
                        strokeWidth={2}
                    />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

const Plot = (props: PropsType) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <PlotQuery collection={props.collection} metric={props.metric} direction={props.direction} days={props.days} setDays={props.setDays}/>
        </QueryClientProvider>
    );
}

export default Plot