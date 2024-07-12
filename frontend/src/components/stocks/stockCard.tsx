import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import { Box, Modal, Typography } from "@mui/material";
import {Stock} from "../../models/Stocks";
import { LineChart } from "../chart/chart";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SendIcon from "@mui/icons-material/Send";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import webSocketService from "../../services/WebSocketService";

function StockCard({ stock, onStockUpdate }: { stock: Stock, onStockUpdate: Function}){
    const [open, setOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(stock.isTrading);

    const handleToggleSelect = () => {
        setIsSelected(!isSelected);
        stock.isTrading = !isSelected
        webSocketService.emit('updateStock', stock)
    };

    return (
        <div>
            <div style={{display: "flex", alignItems: "center"}}>
                <h3 style={{width: "40%"}}>{stock.name} ({stock.symbol})</h3>
                {!isSelected &&
                    <Button size="small" onClick={handleToggleSelect} style={{height: "40px", width: "30%", marginLeft: "30%"}} variant="contained" color="success" startIcon={<AddIcon/>}>Добавить к торгам</Button>
                }
                {isSelected &&
                    <Button size="small" onClick={handleToggleSelect} style={{height: "40px", width: "30%", marginLeft: "30%"}} variant="contained" color="error" startIcon={<DeleteIcon/>}>Убрать с торгов</Button>
                }
            </div>
            <LineChart chartData={stock} />
        </div>
    )
}

export default StockCard
