import React, { useState } from 'react'
import { AppState } from '../Context';
import { doc, setDoc } from '@firebase/firestore'
import { db } from '../Scripts/firebase-config';
import { formatNum } from '../Scripts/script';

const EntryModal = ({ entryPopup, setEntryPopup }) => {
    const { coin, favorites, setAlert, user } = AppState();
    const addEntry = async (action) => {
        if (!action || !entryPopup[1]) {
            return;
        }
        let value = action === "sell" ? -entryPopup[1] : entryPopup[1];
        const coinRef = doc(db, "favorites", user.uid);
        try {
            favorites.map((i) => {
                if (i.symbol === coin) {
                    i["entry"] = value;
                }
            })
            await setDoc(
                coinRef,
                { coins: favorites },
                { merge: "true" }
            )
            setAlert({
                open: true,
                time: 3000,
                type: "Success",
                message: `Added an Entry to ${coin} !`,
            });
            setEntryPopup([false, null])
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
        <div className='column entry-modal'>
            <div>Add Entry ${formatNum(entryPopup[1])} to {coin}</div>
            <div className='row entry-action'>
                <div onClick={() => { addEntry("buy") }}>
                    Buy
                </div>
                <div style={{
                    backgroundColor: "var(--red)"
                }}
                    onClick={() => { addEntry("sell") }}
                >
                    Sell
                </div>
            </div>
            <div style={{
                margin: "10px 10px",
                color: "var(--red)",
                cursor: "pointer",
                fontWeight: 900,
                transition: "0.4s"
            }}
                onClick={
                    () => {
                        setEntryPopup([false, null])
                    }
                }
            >
                Close Modal
            </div>
        </div>
    )
}

export default EntryModal