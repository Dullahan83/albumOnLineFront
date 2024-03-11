import React from 'react'
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr'; // Importez la locale française pour Day.js

// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { frFR } from '@mui/x-date-pickers/locales';
const Datepicker = ({setDate, date, id}: {setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null >>, date: Dayjs | null , id:string}) => {
   

  return (
    <div id={id} className='w-fit mt-8'>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
        <DatePicker
          
            label="Date de la photo"
            value={date}
            onChange={(newValue) => setDate(newValue)}
        />
    </LocalizationProvider>
  </div>
  )
}

export default Datepicker
