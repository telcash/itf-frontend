import React from "react";
import { Avatar, Container, Typography } from "@mui/material";

const JugadorAvatar = ({ fotoJugador, nombre, apellido, posicion }) => {
    return (
        <Container>
            <Avatar alt="avatar jugador" src={fotoJugador}/>
            {
                (nombre && apellido) && (
                    <Typography variant="h5" gutterBottom>{`${nombre} ${apellido}`}</Typography>
                )
            }
            {
                posicion && (
                    <Typography variant="h6" gutterBottom>{posicion}</Typography>
                )
            }
        </Container>
    )
}

export default JugadorAvatar;