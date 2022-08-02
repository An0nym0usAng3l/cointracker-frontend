import React, { useState } from 'react'
import { AppState } from '../Context'
import { doc, setDoc } from '@firebase/firestore'
import { db } from '../Scripts/firebase-config';
import { formatNum } from '../Scripts/script'

const NotifyModal = ({ setNotificationPopup, notificationPopup, price }) => {
    const { coin, user, notifications, setAlert } = AppState();
    const [action, setAction] = useState(true);
    const [percentage, setPercentage] = useState(null);
    var notifyData = notifications.filter((item) => item.symbol === coin)[0];
    const addNotification = async () => {
        if (!percentage) {
            console.log("Stop messing around and enter a value");
            return;
        }

        const coinRef = doc(db, "notifications", user.uid);
        try {
            setNotificationPopup([false, null, null])
            setAction(true)
            await setDoc(
                coinRef,
                {
                    coins: notifications.length !== 0 ?
                        [...notifications, {
                            symbol: coin,
                            type: action ? "increase" : "decrease",
                            point: price,
                            percentage: percentage,
                            show: false,
                            message: coin + (action ? " increased by " : " decreased by ") + percentage + "%",
                        }]
                        :
                        [{
                            symbol: coin,
                            type: action ? "increase" : "decrease",
                            point: price,
                            percentage: percentage,
                            show: false,
                            message: coin + (action ? " increased by " : " decreased by ") + percentage + "%",
                        }]
                },
                { merge: "true" }
            )

            setAlert({
                open: true,
                time: 3000,
                type: "success",
                message: `Added a notification for ${coin}!`,
            });
        } catch (e) {
            setAlert({
                open: true,
                time: 4000,
                type: "error",
                message: e.message,
            });
        }
    }

    const deleteNotification = async () => {
        const coinRef = doc(db, "notifications", user.uid);
        setNotificationPopup([false, null, null])
        setAction(true)
        try {
            await setDoc(
                coinRef,
                { coins: notifications.filter((notification) => notification.symbol !== coin) },
                { merge: "true" }
            )
            setAlert({
                open: true,
                time: 3000,
                type: "error",
                message: `Removed Notification for ${coin}!`,
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
    return (
        <div className='column entry-modal' style={{
        }}>
            {notificationPopup[2] === "add" ?
                <>
                    <h3>Set a notification for {coin} when current price:</h3>
                    <div className='row entry-action notify-action'>
                        <div onClick={() => {
                            setAction(true)
                        }}
                            style={{
                                background: action && "var(--bg-main)",
                                color: action && "var(--white)"
                            }}
                        >
                            Increase
                        </div>
                        <div style={{
                            background: !action && "var(--bg-main)",
                            color: !action && "var(--white)"
                        }}
                            onClick={() => {
                                setAction(false)
                            }}
                        >
                            Decrease
                        </div>
                    </div>
                    <h3>By</h3>
                    <input type="number" placeholder='Percentage, E.g 1%, 2%, 3%, 5%, 20%'
                        onChange={(e) => setPercentage(e.target.value)}
                        style={{
                            padding: "10px",
                            margin: "10px"
                        }}
                    />
                    <button style={{
                        padding: "10px 15px",
                        backgroundColor: "var(--green)",
                        color: "var(--white)",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer"
                    }}
                        onClick={addNotification}
                    >Update Notification</button>
                </>
                :
                <>

                    <h3>Notify me when {coin} {notifyData?.type + "s"} by {notifyData?.percentage}%</h3>
                    <button style={{
                        padding: "10px 15px",
                        backgroundColor: "var(--red)",
                        color: "var(--white)",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        margin: "10px 0px"
                    }}
                        onClick={deleteNotification}
                    >Remove this Notification</button>
                </>

            }
            <div style={{
                margin: "10px 10px",
                color: "var(--red)",
                cursor: "pointer",
                fontWeight: 900,
                transition: "0.4s"
            }}
                onClick={
                    () => {
                        setNotificationPopup([false, null, null])
                        setAction(true)
                    }
                }
            >
                Close Modal
            </div>
        </div>
    )
}

export default NotifyModal