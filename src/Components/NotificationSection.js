import { ClickAwayListener } from '@material-ui/core'
import { AppState } from '../Context';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React from 'react'
import { doc, setDoc } from '@firebase/firestore'
import { db } from '../Scripts/firebase-config';

const NotificationSection = ({ setshowNotificationSection }) => {
    const { notifications, user, setAlert } = AppState();

    const notificationstoShow = notifications.filter((item) => item.show === true);
    const deleteNotification = async (coin) => {
        const coinRef = doc(db, "notifications", user.uid);
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
        <ClickAwayListener onClickAway={() => setshowNotificationSection(false)}>
            <div className='notifications-section'>
                <h3><NotificationsIcon /> Notifications </h3>
                <h4>Click on Notifications to remove</h4>
                <ul>
                    <li className='column notification-list'>
                        <h3>Sample Notification</h3>
                        Dev Coin increased by 10%
                    </li>
                    {notificationstoShow.map((notification) => (
                        <li className='column notification-list' key={notification.symbol} onClick={() => deleteNotification(notification.symbol)}>
                            <h3>{notification.symbol.toUpperCase()}</h3>
                            {notification.message}
                        </li>
                    ))}
                </ul>
            </div>
        </ClickAwayListener>
    )
}

export default NotificationSection