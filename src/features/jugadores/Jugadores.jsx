import React, { useEffect, useState } from "react";
import { Box, Button, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getDraggablePositions, getEquipoCancha, getEquiposStatus, selectAllEquipos, selectDraggablePositions, selectEquipoCancha } from "../equipos/equiposSlice";
import { fetchJugadores, getJugadoresStatus, jugadorSelected, selectAllJugadores, updateJugador } from "./jugadoresSlice";
import JugadorAvatar from "./JugadorAvatar";
import { paths, router } from '../../router/router';
import './jugadores.css';
import Draggable from "react-draggable";
import { useLocation } from "react-router-dom";

const Jugadores = () => {

    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const equipoCancha = useSelector(getEquipoCancha);
    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);

    const { pathname } = useLocation();

    const [equipo, setEquipo] = useState(equipoCancha?.nombre ?? '');
    const [jugadoresEquipo, setJugadoresEquipo] = useState([]);

    const [draggablePositions, setDraggablePositions] = useState([]);

    const [isDragging, setIsDragging] = useState(false);

    const onEquipoChanged = e => {
        /* draggablePositions.forEach(position => 
            dispatch(updateJugador({
                id: position.jugadorId,
                jugador: { 
                    posX: position.coords.x,
                    posY: position.coords.y
                }
            }))
        ); */
        setEquipo(e.target.value);
        dispatch(selectEquipoCancha(equipos.find(equipo => equipo.nombre === e.target.value)));
    }

    const resetPositions = () => {
        setDraggablePositions(jugadoresEquipo.map(jugador => {
            return {
                jugadorId: jugador.id,
                coords: {
                    x: 0,
                    y: 0
                }
            }
        }))
        draggablePositions.forEach(position =>
            dispatch(updateJugador({
                id: position.jugadorId,
                jugador: { 
                    posX: 0,
                    posY: 0
                }
            })
        ));
    }
    const handleJugadorClick = (jugador) => {
        if (!isDragging) {
            //dispatch(selectDraggablePositions(draggablePositions));
            dispatch(jugadorSelected(jugador));
            const navPaths = {
                '/jugadores': paths.jugadorDatos,
                '/estadisticas-jugador': paths.jugadorEstadistica,
                '/graficas': paths.jugadorGraficas,
                '/desarrollo-tactico-individual': paths.desarrolloTacticoIndividual,
                '/estadisticas-equipo': paths.estadisticasEquipo,
                '/calendario': paths.jugadorCalendario,
                '/notificaciones': paths.jugadoresNotificaciones,
            }
            router.navigate(navPaths[pathname], {replace: true});
        } else {
            setIsDragging(false);
        }
    }

    useEffect(() => {
        if(jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }  , [jugadoresStatus, dispatch])

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }
    , [equiposStatus, dispatch])

    useEffect(() => {
        if(equipo) {
            const filteredJugadores = jugadores
                .filter(jugador => jugador.equipo && jugador.equipo.nombre === equipo)
                .sort((a, b) => a.id - b.id);
            setJugadoresEquipo(filteredJugadores);
            setDraggablePositions(filteredJugadores.map(jugador => {
                return {
                    jugadorId: jugador.id,
                    coords: {
                        x: jugador.posX,
                        y: jugador.posY
                    }
                }
            }))
        }
    }   , [equipo, equipos, jugadores]);

    useEffect(() => {
        if(jugadoresEquipo.length > 0) {
            setDraggablePositions(jugadoresEquipo.map(jugador => {
                return {
                    jugadorId: jugador.id,
                    coords: {
                        x: jugador.posX,
                        y: jugador.posY
                    }
                }
            }))
        }
    }, [jugadoresEquipo]);


    return (
        <div className="jugadores-cancha">
            <InputLabel id="equipo-label">Seleccionar equipo</InputLabel>
            <Select
                labelId="equipo-label"
                id="equipo"
                value={equipo}
                label="Seleccionar equipo"
                onChange={onEquipoChanged}
                sx={{width: 300}}
            >
                {
                    equipos.map((equipo, index) => (
                        <MenuItem key={index} value={equipo.nombre}>{equipo.nombre}</MenuItem>
                    ))
                }
            </Select>
            <Button onClick={resetPositions}>Reset</Button>
            <div className="jugadores-avatar-list" id="avatar-list">
                <Box
                    height={600}
                    width={1160}
                    position="relative"
                    id="cancha"
                    mb={2}
                    sx={{
                        flex: '100%',
                        backgroundImage: `url(${'../../assets/cancha.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                </Box>
                {
                    jugadoresEquipo.map((jugador, index) => (
                        <Draggable
                            key={index}
                            bounds="parent"
                            position= {{ 
                                x: draggablePositions.find(position => position.jugadorId === jugador.id).coords.x,
                                y: draggablePositions.find(position => position.jugadorId === jugador.id).coords.y
                            }}
                            onDrag={(e, data) => {
                                /* const updatedPositions = [ ...draggablePositions ]
                                updatedPositions.forEach(position => {
                                    if(position.jugadorId === jugador.id) {
                                        position.coords.x = data.x;
                                        position.coords.y = data.y;
                                    }
                                })
                                setDraggablePositions(updatedPositions); */
                                setIsDragging(true);
                            }}
                            onStop={(e, data) => {
                                const updatedPositions = [ ...draggablePositions ]
                                updatedPositions.forEach(position => {
                                    if(position.jugadorId === jugador.id) {
                                        position.coords.x = data.x;
                                        position.coords.y = data.y;
                                    }
                                })
                                setDraggablePositions(updatedPositions);
                                dispatch(updateJugador({
                                    id: jugador.id,
                                    jugador: { 
                                        posX: data.x,
                                        posY: data.y
                                    }
                                }))
                            }}
       
                        >
                            <div onClick={() => handleJugadorClick(jugador)}>
                                <JugadorAvatar
                                    nombre={jugador.nombre}
                                    apellido={jugador.apellido}
                                    fotoJugador={jugador.foto}
                                />
                            </div>
                        </Draggable>
                    ))
                }
            </div>
        </div>
    )
}

export default Jugadores;