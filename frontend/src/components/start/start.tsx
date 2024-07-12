import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import {Box} from "@mui/material";

function Start(){
    return (
        <div style={{display: "flex", flexDirection: "column", marginLeft: "25%", marginTop: "18%", width: "50%"}}>
            <h1 style={{textAlign: "center"}}>Добро пожаловать на биржу!</h1>
            <Box component="section" style={{width: "100%"}}>
                <Link to="/brokers">
                    <Button variant="outlined" style={{marginLeft: "25%", width: "20%"}}>Брокеры</Button>
                </Link>
                <Link to="/stocks">
                    <Button variant="outlined" style={{marginLeft: "10%", width: "20%"}}>Акции</Button>
                </Link>
            </Box>
        </div>
    );
}

export default Start;