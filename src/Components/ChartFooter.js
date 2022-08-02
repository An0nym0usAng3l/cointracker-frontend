import React from 'react'
import { AppState } from '../Context';
import { chartTimings } from '../Scripts/script';

const ChartFooter = ({ children }) => {
    const { days, setDays } = AppState();
    return (
        <>
            {chartTimings.map((day) => (
                <button className='selectDays' key={day.label} onClick={() => {
                    setDays(day.value);
                }} style={{ borderBottom: day.value[0] === days[0] ? '3px solid var(--main-color)' : 'none' }}>{day.label}</button>
            ))
            }
        </>
    )
}

export default ChartFooter