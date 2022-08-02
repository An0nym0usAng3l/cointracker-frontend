import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShowChartIcon from '@material-ui/icons/ShowChart'
import { AppState } from '../Context';

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
});

export default function BottomNav() {
    const classes = useStyles();
    const { value, setValue, section, setSection } = AppState();
    useEffect(() => {
        if (value === 1) setSection(".favorite-section")
        else if (value === 0) setSection(".chart-section")
    }, [value])

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes.root}
        >
            <BottomNavigationAction label="Chart" icon={<ShowChartIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        </BottomNavigation>
    );
}
