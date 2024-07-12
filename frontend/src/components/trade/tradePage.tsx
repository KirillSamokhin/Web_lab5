import {Box} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Stock} from "../../models/Stocks";
import webSocketService from "../../services/WebSocketService";
import {LineChart} from "../chart/chart";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";

function TradePage() {
    const [stocks, setStocks] = useState<Stock[]>();
    const [tradeDate, setTradeDate] = useState<Date>();

    useEffect(() => {
        webSocketService.emit('stocks');
        webSocketService.emit('getStartTradeDate')


        webSocketService.on('stocks', function (data) {
            setStocks(data);
        });

        webSocketService.on(`updateStockData`, function (data) {
            webSocketService.emit('stocks');
        });

        webSocketService.on('getStartTradeDate', function (date: Date) {
            if (!date || new Date(date).toLocaleDateString('ru') !== new Date().toLocaleDateString('ru')) return;

            setTradeDate(new Date(date))
        })

        return () => {
            webSocketService.off('stocks');
        };
    }, []);

    let counter = 0;
     return (
         <div>
             <div style={{display: "flex"}}>
                 <Link to="/stocks" style={{marginLeft: "10px", marginTop: "10px"}}>
                     <Button variant="outlined">Акции</Button>
                 </Link>
                 <Link to="/brokers" style={{marginLeft: "10px", marginTop: "10px"}}>
                     <Button variant="outlined">Брокеры</Button>
                 </Link>
                 <Link to="/settings" style={{marginLeft: "10px", marginTop: "10px"}}>
                     <Button variant="outlined">Настройка торгов</Button>
                 </Link>
             </div>
             <div style={{marginLeft: "30%", marginTop: "5%", width: "40%"}}>
                 {tradeDate && (
                     <h1 style={{textAlign: "center"}}>Дата начала торгов: {tradeDate.toLocaleDateString('ru')}</h1>
                 )}
                 {!tradeDate && (
                     <h1 style={{textAlign: "center"}}>Ждите начала торгов</h1>
                 )}
                 <div>
                     {stocks && stocks.map(stock => {
                         if (!stock.isTrading) {
                             counter += 1;
                             return;
                         }

                         return (
                             <div>
                                 <h3 style={{width: "40%"}}>{stock.name} ({stock.symbol})</h3>
                                 <LineChart chartData={stock}/>
                             </div>
                         )
                     })}
                 </div>
                 {counter === stocks?.length && (
                     <div>
                         <h2 style={{textAlign: "center"}}>Акций не найдено... Выберите для торговли нужные акции!</h2>
                     </div>
                 )}
             </div>
         </div>
     )
}

export default TradePage