import React, { useEffect, useState } from "react";
import axios from "axios";
import FlipNumbers from "react-flip-numbers";
import { Container, Grow, List, ListItem, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

export default function Home() {
    const theme = useTheme();
    const [readCount, setReadCount] = useState(0);
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
        axios.get("/api/getReadCount").then(res => {
            setReadCount(res.data.readCount);
            setLoading(false);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setOnPace(getPace() >= daysInYear);
        setTimeout(() => {
            setFlippingDone(true);
        }, 2000);
    }, [readCount]);

    const getFlippingNumber = (value) => readCount === 0 ? "000" : loading ? "000" : value.toString();

    const getPace = () => Math.floor((readCount / daysIn) * daysInYear);

    const getPaceIcon = () => onPace ? <CheckIcon color="success" /> : <ClearIcon color="error" />;

    return (
        <Container maxWidth="xs">
            <Paper sx={styles.paper}>
                <List>
                    <ListItem>
                        <Typography style={styles.text}>Read:&nbsp;</Typography>
                        <FlipNumbers
                            height={styles.text.fontSize}
                            width={styles.text.fontSize - 10}
                            color={styles.numbers.color}
                            numberStyle={{fontFamily: styles.numbers.fontFamily}}
                            perspective={400}
                            play
                            duration={loading ? 4 : 2}
                            numbers={getFlippingNumber(readCount)}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography style={styles.text}>Days In:&nbsp;</Typography>
                        <FlipNumbers
                            height={styles.text.fontSize}
                            width={styles.text.fontSize - 10}
                            color={styles.numbers.color}
                            numberStyle={{fontFamily: styles.numbers.fontFamily}}
                            perspective={400}
                            play
                            duration={loading ? 4 : 2}
                            numbers={getFlippingNumber(daysIn)}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography style={styles.text}>Days Remaining:&nbsp;</Typography>
                        <FlipNumbers
                            height={styles.text.fontSize}
                            width={styles.text.fontSize - 10}
                            color={styles.numbers.color}
                            numberStyle={{fontFamily: styles.numbers.fontFamily}}
                            perspective={400}
                            play
                            duration={loading ? 4 : 2}
                            numbers={getFlippingNumber(daysInYear - daysIn)}
                        />
                    </ListItem>
                    <ListItem>
                        <Typography style={styles.text}>Pace:&nbsp;</Typography>
                        <FlipNumbers
                            height={styles.text.fontSize}
                            width={styles.text.fontSize - 10}
                            color={styles.numbers.color}
                            numberStyle={{fontFamily: styles.numbers.fontFamily}}
                            perspective={400}
                            play
                            duration={loading ? 4 : 2}
                            numbers={getFlippingNumber(getPace())}
                        />&nbsp;
                        <Grow in={flippingDone} style={{ transformOrigin: '0 0 0' }}
                        {...(flippingDone ? { timeout: 1000 } : {})}>
                            {flippingDone ? getPaceIcon() : <></>}
                        </Grow>
                        
                    </ListItem>
                </List>
            </Paper>
        </Container>
    );
}