import AddIcon from "@mui/icons-material/Add";
import {Box, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Modal from '@mui/material/Modal';
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from 'react';
import webSocketService from "../../services/WebSocketService";
import BrokerCard from "./brokerCard";
import {Broker} from "../../models/Broker";
import {Link} from "react-router-dom";

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

const INITIAL_CAPITAL_VALUE = 1000000;

function BrokersPage() {
    const [brokers, setBrokers] = useState<Broker[]>()
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [open, setOpen] = useState(false);

    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => {
        setOpen(false)
        setSuccessMessage("")
        setFormData({
            name: '',
            initialValue: INITIAL_CAPITAL_VALUE,
        })
    };

    const [formData, setFormData] = useState({
        name: '',
        initialValue: INITIAL_CAPITAL_VALUE,
    });

    useEffect(() => {
        webSocketService.emit('brokers');

        webSocketService.on('brokers', function (data) {
            setBrokers(data);
        });

        return () => {
            webSocketService.off('brokers');
        };
    }, []);

    const handleChange = (updatedCapital: number, brokerName: string) => {
        if (!brokers) return;

        const updatedBrokers = brokers.map(broker => {
            if (broker.name === brokerName) {
                broker.initialValue = updatedCapital;
            }
            return broker;
        });

        setBrokers(updatedBrokers);
    };

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleAddBroker = () => {
        // Здесь отправляем данные регистрации через WebSocket
        webSocketService.emit('register', formData);

        webSocketService.on('registerSuccess', (newBroker) => {
            setSuccessMessage('Брокер успешно добавлен!');
            console.log(successMessage);
            handleModalOpen();
            webSocketService.emit('brokers');
        });

        webSocketService.on('registerFailure', (err) => {
            alert(err)
        })
    }


    const handleDeleteBroker = (name: string) => {
        // Здесь отправляем данные удаления брокера через WebSocket
        webSocketService.emit('deleteBroker', name);

        // Обработка успешного удаления для обновления списка брокеров
        webSocketService.on('deleteBrokerSuccess', () => {
            webSocketService.emit('brokers');
        });

        // Обработка ошибки удаления, если брокер с указанным именем не найден
        webSocketService.on('deleteBrokerFailure', (err) => {
            alert(err);
        });
    };

    return (
        <div>
            <div style={{display: "flex"}}>
                <Link to="/" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Назад</Button>
                </Link>
                <Link to="/stocks" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Акции</Button>
                </Link>
                <Link to="/settings" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Настройка торгов</Button>
                </Link>
                <Link to="/trade" style={{marginLeft: "10px", marginTop: "10px"}}>
                    <Button variant="outlined">Торги</Button>
                </Link>
            </div>
            <div style={{marginLeft: "30%", marginTop: "5%", width: "40%"}}>
                <h1 style={{textAlign: "center"}}>Список брокеров</h1>
                {brokers && brokers.map(broker => (
                    <BrokerCard
                        key={broker.name}
                        broker={broker}
                        onChange={(capital: number) => handleChange(capital, broker.name)}
                        onDelete={(name: string) => handleDeleteBroker(name)}/>
                ))}
                <div style={{marginLeft: "35%", width: "30%"}}>
                    <Button size="small"
                            style={{width: "100%"}}
                            onClick={handleModalOpen}
                            variant="contained"
                            startIcon={<AddIcon/>}>Добавить</Button>
                </div>
                <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {successMessage &&
                            <Box id="modal-modal-title">
                                <p>{successMessage}</p>
                                <Button variant="outlined" style={{width: "40%", marginLeft: "30%"}} onClick={handleModalClose}>Закрыть</Button>
                            </Box>}

                        {!successMessage && <div>
                            <h2 style={{width: "60%", marginLeft: "20%", textAlign: "center"}}>Новый пользователь</h2>
                            <Box
                                style={{alignItems: "center"}}
                                component="form"
                            >
                                <TextField
                                    required
                                    style={{height: "20px", width: "40%"}}
                                    id="name"
                                    type={'text'}
                                    label="Имя"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <Select
                                    name="initialValue"
                                    style={{height: "40px", marginLeft: "5%", width: "25%"}}
                                    value={formData.initialValue}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={500000}>500000</MenuItem>
                                    <MenuItem value={1000000}>1000000</MenuItem>
                                    <MenuItem value={1500000}>1500000</MenuItem>
                                </Select>
                                <Button variant="outlined" style={{height: "40px", marginLeft: "5%", width: "25%"}} onClick={handleAddBroker}>
                                    Создать
                                </Button>
                            </Box>
                        </div>}
                    </Box>
                </Modal>
            </div>
        </div>
    )
}

export default BrokersPage;