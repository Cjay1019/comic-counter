import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import FlipNumbers from "react-flip-numbers";

export default function Flipper(props) {
    const theme = useTheme();
    const styles = {
        numbers: {
            fontFamily: theme.typography.fontFamily,
            color: theme.typography.color
        },
        text: {
            fontSize: 30
        }
    };

    return (
        <FlipNumbers
            height={styles.text.fontSize}
            width={styles.text.fontSize - 10}
            color={styles.numbers.color}
            numberStyle={{fontFamily: styles.numbers.fontFamily}}
            perspective={400}
            play
            duration={props.loading ? 4 : 2}
            numbers={props.getFlippingNumber(props.flipNumber)}
        />
    );
}