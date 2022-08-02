import { colors, LinearProgress } from '@material-ui/core';
import React, { useState } from 'react'
import { AppState } from '../Context'
import { formatNum, formatProfit } from '../Scripts/script';

const FavoriteSection = () => {
    const { favorites, coins, coin, setValue, setCoin } = AppState();
    const [sort, setSort] = useState("last-added");
    var favoritesData = coins?.filter((item) => favorites.some((obj) => obj.symbol === item?.id));
    favoritesData?.map((data) => {
        const entry = favorites.find((item) => (item.symbol).toLowerCase() === (data.id).toLowerCase())["entry"];
        favoritesData.find((data2) => data2.id === data.id)["entry"] = entry;
    })

    switch (sort) {
        case "price":
            favoritesData.sort((a, b) => {
                return b.current_price - a.current_price;
            })
            break;
        case "profit":
            favoritesData.sort((a, b) => {
                return b.price_change_percentage_1h_in_currency - a.price_change_percentage_1h_in_currency;
            })
            break;
        case "volume":
            favoritesData.sort((a, b) => {
                return b.total_volume - a.total_volume;
            })
            break;
        default:
            favoritesData.sort((a, b) => {
                return favorites.indexOf(a.id) - favorites.indexOf(b.id)
            }).reverse();
    }
    return (
        <>
            <div className='row favorite-header'>
                <div>Favorites</div>
                <div className='row sort-by'>
                    <label htmlFor="sort">Sort By: &nbsp;</label>
                    <select name="sort" id="sort" onChange={(e) => { setSort(e.target.value) }}>
                        <option value="last-added">Last Added</option>
                        <option value="price">Price</option>
                        <option value="profit">1 hr Profit</option>
                        <option value="volume">Volume</option>
                    </select>
                </div>
            </div>
            <div className='column table-section'>
                <div className='table-heading'>
                    <table cellPadding="20" cellSpacing="5">
                        <thead>
                            <tr>
                                <th> </th>
                                <th>Price</th>
                                <th>1 hr</th>
                                <th>24 hr</th>
                                <th>Entry</th>
                                <th>Profit/Loss</th>
                            </tr>

                        </thead>
                    </table>
                </div>
                <div className='column table-body'>
                    {favoritesData.length === 0 ?
                        // <LinearProgress color="primary" />
                        <div style={{
                            textAlign: "center",
                            color: "red"
                        }}>
                            Empty
                        </div>
                        :
                        favoritesData.map((item) => (
                            <div className='row table-row' style={{
                                backgroundColor: item.id === coin && "var(--lighter-black)"
                            }} key={item.id}
                                onClick={
                                    () => {
                                        setCoin(item.id);
                                        setValue(0);
                                    }
                                }
                            >
                                <div>{item.symbol.toUpperCase()}</div>
                                <div>${formatNum(item.current_price)}</div>
                                <div>{formatProfit(item.price_change_percentage_1h_in_currency)}</div>
                                <div>{formatProfit(item.price_change_percentage_24h_in_currency)}</div>
                                <div>{formatProfit(item.price_change_percentage_24h_in_currency)}</div>
                                <div>{item.entry ?
                                    item.entry < 0 ?
                                        formatProfit(((item.current_price + item.entry) / item.entry) * 100)
                                        :
                                        formatProfit(((item.current_price - item.entry) / item.entry) * 100)
                                    :
                                    "--%"
                                }</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default FavoriteSection