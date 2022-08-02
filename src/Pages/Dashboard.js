import React, { useEffect, useState } from 'react'
import { AppState } from '../Context';
import $ from 'jquery'
import BottomNav from '../Components/BottomNav';
import ChartSection from '../Components/ChartSection'
import FavoriteSection from '../Components/FavoriteSection'
import { CircularProgress, LinearProgress } from '@material-ui/core';

const Dashboard = () => {
    const { section, loadingCoins, user } = AppState();
    useEffect(() => {
        $(".mobile>.dashboard-section>*").hide();
        $(section).show();
    }, [section])
    return (
        <>
            {loadingCoins ?
                <LinearProgress color="primary" />
                :
                <>
                    <div className='desktop'>
                        <div className='row dashboard-section'>
                            <div className='chart-section'><ChartSection /></div>
                            {user && <div className='column favorite-section'><FavoriteSection /></div>}
                        </div>
                    </div>
                    <div className='column mobile'>
                        <div className='column dashboard-section'>
                            <div className='column chart-section'><ChartSection /></div>
                            {user && <div className='column favorite-section'><FavoriteSection /></div>}
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        {
                            user && (
                                <div className='bottom-nav'>
                                    <BottomNav />
                                </div>
                            )
                        }

                    </div>
                </>
            }
        </>
    )
}

export default Dashboard;