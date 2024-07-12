import {Box} from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import webSocketService from "../../services/WebSocketService";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {Broker} from "../../models/Broker";
import TextField from "@mui/material/TextField";

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

function BrokerCard(props: { onChange: Function, broker:Broker, onDelete:Function }) {
    const [capitalMode, setCapitalMode] = useState(false)

    const [formCapital, setFormCapital] = useState(props.broker.initialValue);
    const [realCapital, setRealCapital] = useState(props.broker.initialValue);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event: any) => {
        if(Number(event.target.value)>=0) {
            setFormCapital(Number(event.target.value));
        }
    };

    const handleUpdateCapital = () => {
        webSocketService.emit('updateInitialValue', { name: props.broker.name, initialValue: formCapital });
        props.onChange(formCapital);
        setCapitalMode(false);
    };

    const handleDeleteBroker = (isDelete: boolean) => {
        if (!isDelete) {
            handleClose();
            return;
        }

        props.onDelete(props.broker.name);
        handleClose();
    }

    return (
        <div style={{display: "flex", marginBottom: "5px", height: "45px", alignItems: "center"}}>
            <h3 style={{width: "40%"}}>{props.broker.name}</h3>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h6">
                        Вы уверены?
                    </Typography>
                    <div>
                        <Button variant="outlined" color={'error'} onClick={() => handleDeleteBroker(true)}>
                            УES
                        </Button>
                        <Button variant="outlined" style={{marginLeft: "10px"}} color={'success'} onClick={() => handleDeleteBroker(false)}>
                            NO
                        </Button>
                    </div>
                </Box>
            </Modal>
            <div style={{width: "40%", alignItems: "center"}}>
                {!capitalMode && <>
                    <p onClick={() => setCapitalMode(true)}>
                        <AttachMoneyIcon/>
                        Капитал: {props.broker.initialValue}
                    </p>
                </>}
                {capitalMode && <>
                    <FormControl>
                        {/*<Select*/}
                        {/*    value={formCapital.toString()}*/}
                        {/*    onChange={handleChange}*/}
                        {/*    style={{height: "30px"}}*/}
                        {/*>*/}
                        {/*    <MenuItem value={500000}>500000</MenuItem>*/}
                        {/*    <MenuItem value={1000000}>1000000</MenuItem>*/}
                        {/*    <MenuItem value={1500000}>1500000</MenuItem>*/}
                        {/*</Select>*/}
                        <TextField
                            required
                            id="initialValue"
                            type={'number'}
                            name="tradeSimulationSpeed"
                            value={formCapital.toString()}
                            onChange={handleChange}
                        />
                        <Button onClick={handleUpdateCapital} variant="contained" endIcon={<SendIcon/>}>Отправить</Button>
                    </FormControl>
                </>}
            </div>
            <Button size="small" style={{height: "40px", width: "20%"}} onClick={handleOpen} color="error" variant="contained"
                    startIcon={<DeleteIcon/>}>Удалить</Button>
        </div>
    )
}

export default BrokerCard;