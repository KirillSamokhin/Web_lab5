import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import webSocketService from "../../services/WebSocketService";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormLabel from '@mui/material/FormLabel';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    justifyContent: 'center',
    alignItems: 'center',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function TradeSettings(){
    const [formData, setFormData] = useState({
        tradeStartDate: dayjs().add(0, 'day'),
        tradeSimulationSpeed: 5,
    });

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date: any) => {
        setFormData({
            ...formData,
            tradeStartDate: date,
        });
    };

    const handleStartTrading = () => {
        if (!formData.tradeStartDate || !formData.tradeSimulationSpeed) {
            alert('Введите все нужные поля!');
            return;
        }

        webSocketService.emit('startTrading', formData.tradeSimulationSpeed, formData.tradeSimulationSpeed * 4, formData.tradeStartDate)
        setSuccessMessage('Настройки были успешно заданы!')
        handleOpen()
    };

    return (
        <div>
            <div style={{display: "flex"}}>
                <Link to="/stocks" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Акции</Button>
                </Link>
                <Link to="/brokers" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Брокеры</Button>
                </Link>
            </div>
            <div style={{marginLeft: "30%", marginTop: "5%", width: "40%"}}>
                <h1 style={{textAlign: "center"}}>Настройка торгов</h1>
                <Box
                    component="form"
                    style={{display: "flex", flexDirection: "column", gap: "10px"}}
                >
                    <FormLabel>Прогнозируемая дата торгов:</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                        <DatePicker
                            disablePast
                            value={formData.tradeStartDate}
                            onChange={handleDateChange}
                            slotProps={{
                                textField: {
                                    required: true,
                                },
                            }} selectedSections={undefined} onSelectedSectionsChange={undefined}                        />
                    </LocalizationProvider>
                    <FormLabel>Скорость смены даты в сек:</FormLabel>
                    <TextField
                        required
                        id="initialValue"
                        type={'number'}
                        name="tradeSimulationSpeed"
                        value={formData.tradeSimulationSpeed}
                        onChange={handleInputChange}
                    />
                    <Button variant="outlined" style={{width: "40%", marginLeft: "30%"}} onClick={handleStartTrading}>
                        Начать торги
                    </Button>
                    {error && <div>{error}</div>}
                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <h3>{successMessage}</h3>
                        <Link to="/trade">
                            <Button color="success" variant="contained">Перейти к торгам</Button>
                        </Link>
                    </Box>
                </Modal>
            </div>
        </div>
    )
}

export default TradeSettings