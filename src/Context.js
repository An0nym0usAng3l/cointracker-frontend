import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { coinList, singleCoin } from './Scripts/api.js'
import { auth, db } from './Scripts/firebase-config.js'
import { onAuthStateChanged } from '@firebase/auth'
import { doc, onSnapshot, setDoc } from '@firebase/firestore'

const Provider = createContext();



const Context = ({ children }) => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [value, setValue] = useState(0);
    const [section, setSection] = useState(".chart-section");
    const [coins, setCoins] = useState([]);
    const [coin, setCoin] = useState("ethereum");
    const [coindata, setCoinData] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [days, setDays] = useState([1 / 2, "12H"]);
    const [loadingCoins, setLoadingCoins] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        type: "success",
        time: 3000,
    })
    const fetchAllCoins = async () => {
        setLoadingCoins(true);
        try {
            // const { data } = await axios.get("http://localhost:9000/api/coinlist");
            const { data } = await axios.get("https://cointrackerapi.herokuapp.com/api/coinlist");
            setCoins(data);
            setLoadingCoins(false);
        } catch (e) {
            console.log(e.response.data);
        }
    }
    // console.log(coins)
    const setNotificationStatus = async () => {
        let filteredNotifications = notifications.filter((item) => item.show !== true);
        filteredNotifications.map(async (item) => {
            let coin = coins?.filter((data) => data.id === item.symbol)
            if (item.type === "increase") {
                let changeInPercent = ((Number(coin[0]?.current_price) - Number(item.point)) / Number(item.point)) * 100;
                if (changeInPercent >= Number(item.percentage)) {
                    const coinRef = doc(db, "notifications", user.uid);
                    notifications.map((i) => {
                        if (i.symbol === item.symbol) {
                            i["show"] = true;
                        }
                    })
                    await setDoc(
                        coinRef,
                        { coins: notifications },
                        { merge: "true" }
                    )
                }
            } else {
                let changeInPercent = ((Number(coin[0]?.current_price) - Number(item.point)) / Number(item.point)) * 100;
                if (changeInPercent >= Number(item.percentage)) {
                    const coinRef = doc(db, "notifications", user.uid);
                    notifications.map((i) => {
                        if (i.symbol === item.symbol) {
                            i["show"] = true;
                        }
                    })
                    await setDoc(
                        coinRef,
                        { coins: notifications },
                        { merge: "true" }
                    )
                }
            }
        })
    }
    useEffect(() => {
        if (user) {
            const coinRef = doc(db, "favorites", user.uid);
            var unsubscribe = onSnapshot(coinRef, coin => {
                if (coin.exists()) {
                    setFavorites(coin.data().coins);
                } else {
                    console.log("Nothing");
                }
            });
            return () => {
                unsubscribe();
            }
        }
    }, [user])

    useEffect(() => {
        if (user) {
            const coinRef = doc(db, "notifications", user.uid);
            var unsubscribe = onSnapshot(coinRef, coin => {
                if (coin.exists()) {
                    setNotifications(coin.data().coins);
                } else {
                    console.log("Nothing");
                }
            });
            return () => {
                unsubscribe();
            }
        }
    }, [user])

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) setUser(user)
            else setUser(null)
        });

    }, [user])
    useEffect(() => {
        fetchAllCoins();
    }, [])
    useEffect(() => {
        setNotificationStatus();
    }, [coin, coins, user, days])
    return (
        <Provider.Provider value={{
            user, setUser,
            value, setValue,
            section, setSection,
            coins, setCoins,
            coin, setCoin,
            loadingCoins, setLoadingCoins,
            coindata, setCoinData,
            historicalData, setHistoricalData,
            days, setDays,
            alert, setAlert,
            favorites, setFavorites,
            wallet, setWallet,
            notifications, setNotifications
        }}>
            {children}
        </Provider.Provider>
    )
}

export default Context;

export const AppState = () => {
    return useContext(Provider);
}