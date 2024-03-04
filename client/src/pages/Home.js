import React, { useEffect, useRef, useState } from "react";
import useSkipFirstRender from "../hooks/useSkipFirstRender";
import axios from "axios";
import { Button, Container, Dialog, DialogTitle, Grow, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Flipper from "../components/Flipper";

export default function Home() {
    const theme = useTheme();
    const didMountRef = useRef(false);
    const [userId, setUserId] = useState("");
    const [startCount, setStartCount] = useState("");
    const [readCount, setReadCount] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [showDataList, setShowDataList] = useState(false);
    const [loading, setLoading] = useState(true);
    const [onPace, setOnPace] = useState(false);
    const [flippingDone, setFlippingDone] = useState(false);

    const styles = {
        paper: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(2)
        },
        numbers: {
            fontSize: theme.typography.fontSize,
            fontFamily: theme.typography.fontFamily,
            color: theme.typography.color
        },
        text: {
            fontSize: 30
        }
    };

    const today = new Date();
    const newYears = new Date(today.getFullYear(), 0, 1);
    const nextNewYears = new Date(today.getFullYear() + 1, 0, 1);
    const daysIn = Math.ceil((today.getTime() - newYears.getTime()) / 86400000);
    const daysInYear = Math.ceil((nextNewYears.getTime() - newYears.getTime()) / 86400000);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("items")) || {};
        items.userId && setUserId(items.userId);
        items.startCount && setStartCount(items.startCount);

        if (items.userId && items.startCount) {
            setShowDataList(true);
            getReadCount(items);
        } else {
            setShowDialog(true);
        }
    }, []);

    useSkipFirstRender(() => {
        setLoading(false);
        setOnPace(getPace() >= daysInYear);
    }, [readCount]);

    useSkipFirstRender(() => {
        setTimeout(() => {
            setFlippingDone(true);
        }, 2000);
    }, [onPace]);

    const getFlippingNumber = (value) => readCount === 0 ? "000" : loading ? "000" : value.toString();

    const getPace = () => Math.floor((readCount / daysIn) * daysInYear);

    const getPaceIcon = () => onPace ? <CheckIcon color="success" /> : <ClearIcon color="error" />;

    const saveDisabled = () => (!userId || !startCount);

    const getReadCount = (items) => {
        const config = { headers: { "Content-Type": "text/plain" }};
        axios.post("/api/getReadCount", JSON.stringify(items), config).then(res => {
            setReadCount(res.data.readCount);
        }).catch(err => console.error(err));
    }

    const saveUserInfo = () => {
        localStorage.setItem("items", JSON.stringify({ userId, startCount}));
        setShowDialog(false);
        setShowDataList(true);
        getReadCount({ userId, startCount});
    }

    const renderDataList = () => (
            <Paper sx={styles.paper}>
                <List>
                    <ListItem>
                        <Typography style={styles.text}>Read:&nbsp;</Typography>
                        <Flipper
                            loading={loading}
                            getFlippingNumber={getFlippingNumber}
                            flipNumber={readCount}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography style={styles.text}>Days In:&nbsp;</Typography>
                        <Flipper
                            loading={loading}
                            getFlippingNumber={getFlippingNumber}
                            flipNumber={daysIn}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography style={styles.text}>Days Remaining:&nbsp;</Typography>
                        <Flipper
                            loading={loading}
                            getFlippingNumber={getFlippingNumber}
                            flipNumber={daysInYear - daysIn}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography style={styles.text}>Pace:&nbsp;</Typography>
                        <Flipper
                            loading={loading}
                            getFlippingNumber={getFlippingNumber}
                            flipNumber={getPace()}
                        />&nbsp;
                        <Grow in={flippingDone} style={{ transformOrigin: '0 0 0' }}
                        {...(flippingDone ? { timeout: 1000 } : {})}>
                            {flippingDone ? getPaceIcon() : <></>}
                        </Grow>                        
                    </ListItem>
                </List>
            </Paper>
    );

    return (
        <Container maxWidth="xs">
            <Dialog open={showDialog}>
                <DialogTitle>Enter your information</DialogTitle>
                    <List>
                        <ListItem>
                            <TextField label="User Id" variant="outlined" value={userId} onChange={e => setUserId(e.target.value)} />                
                        </ListItem>
                        <ListItem>
                            <TextField label="Starting Count" variant="outlined" value={startCount} onChange={e => setStartCount(e.target.value)} />                
                        </ListItem>
                    </List>
                <Button variant="contained" disabled={saveDisabled()} onClick={saveUserInfo}>Save</Button>
            </Dialog>
            {showDataList && renderDataList()}
        </Container>
    );
}