import Button from "@mui/material/Button";
import React, { useEffect, useState } from 'react';
import webSocketService from "../../services/WebSocketService";
import {Stock} from "../../models/Stocks";
import {Link} from "react-router-dom";
import StockCard from "./stockCard"


function StocksList() {
    const [stocks, setStocks] = useState<Stock[]>()

    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        webSocketService.emit('stocks');

        webSocketService.on('stocks', function (data) {
            setStocks(data);
        });

        return () => {
            webSocketService.off('stocks');
        };
    }, []);

    const stockUpdateHandle = (updatedStock: Stock) => {
        stocks?.forEach(stock => {
            stock.isTrading = stock.name === updatedStock.name ? updatedStock.isTrading : stock.isTrading;
        })
    }


    return (
        <div>
            <div style={{display: "flex"}}>
                <Link to="/" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Назад</Button>
                </Link>
                <Link to="/brokers" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Брокеры</Button>
                </Link>
                <Link to="/settings" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Настройка торгов</Button>
                </Link>
                <Link to="/trade" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Торги</Button>
                </Link>
            </div>
            <div style={{marginLeft: "25%", marginTop: "5%", width: "50%"}}>
                <h1 style={{textAlign: "center"}}>Список акций</h1>
                {stocks && stocks.map(stock => (
                    <StockCard key={stock.name} stock={stock} onStockUpdate={(updatedStock: Stock) => stockUpdateHandle(updatedStock)}/>
                ))}
            </div>
        </div>
    )
}

export default StocksList