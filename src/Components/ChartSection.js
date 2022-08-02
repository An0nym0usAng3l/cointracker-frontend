import React, { useEffect, useState, useRef } from 'react'
import { AppState } from '../Context'

import StarIcon from '@material-ui/icons/Star';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsIcon from '@material-ui/icons/Notifications';
import axios from 'axios';
import { getHistoricalData, singleCoin } from '../Scripts/api';
import { CircularProgress, LinearProgress } from '@material-ui/core';
import { copyText, formatDate, formatNum, formatProfit } from '../Scripts/script';
import {
    CategoryScale,
    Chart,
    LinearScale,
    LineElement,
    PointElement,
    Interaction,
    UpdateModeEnum,
    Filler,
    Tooltip
} from 'chart.js';
// import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair'
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartFooter from './ChartFooter';
import EntryModal from './EntryModal'
import NotifyModal from './NotifyModal';
import { doc, setDoc } from '@firebase/firestore'
import { db } from '../Scripts/firebase-config';


// Pair : coindata.tickers.filter((tickers)=> tickers.target === coin.toUpperCase())
const ChartSection = () => {
    const { coin, days, user, favorites, notifications, setAlert } = AppState();
    const [coindata, setCoinData] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [entryPopup, setEntryPopup] = useState([false, null]);
    const [notificationPopup, setNotificationPopup] = useState([false, null, 'add']);
    const chartRef = useRef(null);
    const fetchCoin = async () => {
        try {
            const { data } = await axios.get(singleCoin(coin));
            setCoinData(data);
        } catch (e) {
            console.log(e.response.data);
        }
    }

    const fetchHistoricData = async () => {
        try {
            const { data } = await axios.get(getHistoricalData(coin, days[0]))
            setHistoricalData(data);
        } catch (e) {
            console.log(e.response.data);
        }
    }
    const inFavorites = favorites.some((obj) => obj.symbol === coin)
    const inNotifications = notifications.some((obj) => obj.symbol === coin)

    const addToFavorites = async () => {
        const coinRef = doc(db, "favorites", user.uid);
        try {
            await setDoc(
                coinRef,
                {
                    coins: favorites.length !== 0 ? (
                        [...favorites, { symbol: coin, entry: null }]
                    ) : (
                        [{ symbol: coin, entry: null }]
                    ),
                },
                { merge: "true" }
            )
            setAlert({
                open: true,
                time: 3000,
                type: "success",
                message: `Added ${coin} to Favorites!`,
            });
        } catch (error) {
            setAlert({
                open: true,
                time: 4000,
                type: "error",
                message: error.message,
            });
        }
    }

    const removeFromFavourites = async () => {
        const coinRef = doc(db, "favorites", user.uid);
        try {
            await setDoc(
                coinRef,
                { coins: favorites.filter((favorite) => favorite.symbol !== coin) },
                { merge: "true" }
            )
            setAlert({
                open: true,
                time: 3000,
                type: "error",
                message: `Removed ${coin} from Favorites!`,
            });
        } catch (error) {
            setAlert({
                open: true,
                time: 4000,
                type: "error",
                message: error.message,
            });
        }
    }

    const addEntry = async (value) => {
        if (!user) {
            return;
        }
        setEntryPopup([true, value])
    }

    const addNotification = () => {
        setNotificationPopup([true, coindata?.market_data.current_price["usd"], 'add'])
    }

    const editNotification = () => {
        setNotificationPopup([true, coindata?.market_data.current_price["usd"], 'edit'])
    }

    useEffect(() => {
    }, [coin])

    useEffect(() => {
        fetchCoin();
        fetchHistoricData();
    }, [coin, days])
    // useEffect(() => {
    Chart.register(
        LinearScale,
        CategoryScale,
        PointElement,
        LineElement,
        zoomPlugin,
        Filler,
        Tooltip,
        // CrosshairPlugin
    );
    // Interaction.modes.interpolate = Interpolate
    // })
    const pointRadius = historicalData.prices?.map((coin) => coin[1])?.map((point) => point === Math.abs(favorites.find((item) => item.symbol === coin)?.entry) ? 10 : 1);
    return (
        <>
            {coindata ?
                <>
                    <div className='column chart-header'>
                        <div><span className='grey'>Market Summary ></span> {coindata?.name}</div>
                        <div className='row chart-header-sec-one'>
                            <div className='row coin-details'>
                                <div className='row' style={{ alignItems: "center" }}>
                                    <div className='coin-logo'><img src={coindata?.image.small} alt={coindata?.name} /></div>
                                    <h1 className='price-huge'>{formatNum(coindata?.market_data.current_price["usd"])} <span>USD</span></h1>
                                </div>
                                {/* <div className='coin-logo'><img src={coindata?.image.small} alt={coindata?.name} /></div>
                                <div className='coin-symbol'>{(coindata.symbol).toUpperCase()}</div>
                                <sup className='coin-change-percent'>{formatProfit(coindata.market_data.price_change_percentage_1h_in_currency["usd"])}</sup> */}
                            </div>
                            {user && (
                                <div className='row'>
                                    <div className='toggle-favorite' style={{
                                        color: !inNotifications ? "var(--grey)" : "var(--yellow)",
                                        margin: "0px 5px",
                                    }}
                                        onClick={() => {
                                            if (!inFavorites) {
                                                addToFavorites()
                                            }
                                            !inNotifications ? addNotification() : editNotification()
                                        }
                                        }
                                    >
                                        {!inNotifications ?
                                            <NotificationsNoneIcon fontSize='large' />
                                            :
                                            <NotificationsIcon fontSize='large' />
                                        }
                                    </div>
                                    <div className='toggle-favorite' style={{
                                        color: inFavorites ? "var(--yellow)" : "var(--grey)",
                                    }}
                                        onClick={inFavorites ? removeFromFavourites : addToFavorites}
                                    >
                                        <StarIcon fontSize='large' />
                                    </div>
                                </div>

                            )}

                        </div>
                        <div className='grey price-impact'>{formatProfit(coindata.market_data.price_change_percentage_7d_in_currency["usd"])} past 7 days</div>
                        <div className='grey'>{formatDate(coindata.last_updated)}</div>
                        {/* <div className='row coin-details-extra'>
                            <div><span className='main-color'>Name:</span> {coindata?.name}</div>
                            <div><span className='main-color'>Price:</span> ${formatNum(coindata?.market_data.current_price["usd"])}</div>
                            <div><span className='main-color'>Rank:</span> {formatNum(coindata?.coingecko_rank)}</div>
                            <div><span className='main-color'>Market Cap:</span> ${formatNum(coindata?.market_data.market_cap["usd"])}</div>
                        </div> */}
                        {coindata.contract_address &&
                            <div className='row addresses'>
                                <div onClick={() => {
                                    copyText(coindata?.contract_address);
                                    setAlert({
                                        open: true,
                                        time: 4000,
                                        type: "success",
                                        message: "Copied " + (coindata?.contract_address)?.slice(0, 10) + "... to Clipboard",
                                    });
                                }}><span className='main-color'>Token:</span> {coindata?.contract_address?.slice(0, 10)}...<FileCopyIcon fontSize='inherit' /></div>
                            </div>
                        }

                        {entryPopup[0] && <EntryModal
                            setEntryPopup={setEntryPopup}
                            entryPopup={entryPopup}
                        />}
                        {notificationPopup[0] && <NotifyModal
                            setNotificationPopup={setNotificationPopup}
                            notificationPopup={notificationPopup}
                            price={coindata?.market_data.current_price["usd"]}
                        />}
                    </div>
                    <div className='row chart-footer'>
                        <ChartFooter />
                    </div>
                    <div className='main-chart'>
                        {
                            historicalData.length < 1 ?
                                <CircularProgress style={{ color: "gold" }} size={250} />
                                :
                                <>
                                    <Line
                                        ref={chartRef}
                                        data={{
                                            labels: historicalData.prices.map((coin) => {
                                                let date = new Date(coin[0]);
                                                let time = Number(date.getHours()) >= 12 ?
                                                    `${date.getHours() - 12}:${date.getMinutes()} PM`
                                                    : `${date.getHours()}:${date.getMinutes()} AM`;
                                                if (days[0] <= 1) {
                                                    return time;
                                                } else {
                                                    return date.toLocaleDateString();
                                                }
                                            }),
                                            datasets: [
                                                {
                                                    label: `Price in USD`,
                                                    data: historicalData.prices.map((coin) => coin[1]),
                                                    fill: true,
                                                    borderColor: historicalData.prices.map((coin) => coin[1])[0] >= historicalData.prices.map((coin) => coin[1])[1] ? "#0e500e" : "#ab2424",
                                                    borderWidth: 2,
                                                    tension: 0.01,
                                                    pointRadius: pointRadius,
                                                    backgroundColor: historicalData.prices.map((coin) => coin[1])[0] >= historicalData.prices.map((coin) => coin[1])[1] ? "#0e500e0d" : "#ab24240d",
                                                    pointBackgroundColor: historicalData.prices.map((coin) => coin[1])[0] >= historicalData.prices.map((coin) => coin[1])[1] ? "#0e500e" : "#ab2424",
                                                },
                                            ],
                                        }}
                                        options={{
                                            onHover: (event, element) => {
                                                if (element[0]) {
                                                    event.native.target.style.cursor = "pointer";
                                                }
                                            },
                                            onClick: (event, element) => {
                                                if (element[0]) {
                                                    let dataset = element[0].datasetIndex, index = element[0].index;
                                                    let label = chartRef.current.data.labels[index];
                                                    let value = chartRef.current.data.datasets[dataset].data[index];
                                                    if (!inFavorites) {
                                                        addToFavorites()
                                                    }
                                                    addEntry(value);
                                                }
                                            },
                                            hover: {
                                                intersect: false
                                            },
                                            scales: {
                                                x: {
                                                    grid: {
                                                        display: false,
                                                    }
                                                },
                                                // myScale: {
                                                //     position: 'right',
                                                // }
                                            },
                                            responsive: true,
                                            elements: {
                                                point: {
                                                    hoverBackgroundColor: historicalData.prices.map((coin) => coin[1])[0] >= historicalData.prices.map((coin) => coin[1])[1] ? "#0e500e" : "#ab2424",
                                                    pointStyle: "circle",
                                                    hoverRadius: 10,
                                                },
                                                line: {
                                                    // stepped: true,
                                                }
                                            },
                                            layout: {
                                                autoPadding: true,
                                            },
                                            aspectRatio: 2,
                                            maintainAspectRatio: true,
                                            interaction: {
                                                intersect: false,
                                                mode: 'nearest'
                                            },
                                            plugins: {
                                                zoom: {
                                                    pan: {
                                                        enabled: true,
                                                        mode: 'xy'
                                                    },
                                                    zoom: {
                                                        wheel: {
                                                            enabled: true,
                                                        },
                                                        mode: 'xy',
                                                    }
                                                },
                                                tooltip: {
                                                    // enabled: true,
                                                    mode: 'nearest', //Normally supposed to be interpolate
                                                    intersect: false
                                                },
                                                crosshair: {
                                                    line: {
                                                        color: "#f2f2f2",
                                                        width: 0.5,
                                                        dashPattern: [5, 2]
                                                    },
                                                    snap: {
                                                        enabled: true
                                                    }
                                                },
                                            }
                                        }}
                                    />
                                </>
                        }
                    </div>
                </>
                :
                <LinearProgress color="primary" />
            }
        </>
    )
}

export default ChartSection