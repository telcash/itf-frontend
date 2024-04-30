import { useDispatch, useSelector } from "react-redux"
import { getJugadoresStatus, selectAllJugadores, getJugadoresError, fetchJugadores, deleteJugador, jugadorSelected, getJugadorSelected } from "./jugadoresSlice";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import { Button, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Paper from '@mui/material/Paper';
import calculateAge from '../../utils/calculateAge';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './jugadores.css';
import SimpleDialog from "../../components/simple-dialog/SimpleDialog";
import { router } from '../../components/main-drawer/MainDrawer';
import JugadorAvatar from "./JugadorAvatar";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const JugadoresList = () => {

    const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/"

    const dispatch = useDispatch();

    const jugadores = useSelector(selectAllJugadores);
    const jugadorSelectedId = useSelector(getJugadorSelected);
    const jugadoresStatus = useSelector(getJugadoresStatus);
    const error = useSelector(getJugadoresError);

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Cancelar');
    const handleClickOpen = (id) => {
        dispatch(jugadorSelected(id));
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
        if (value === 'Eliminar') {
            dispatch(deleteJugador(jugadorSelectedId));
        }
    };


    useEffect(() => {
        if (jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }, [jugadoresStatus, dispatch])

    let content;
    if(jugadoresStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (jugadoresStatus === 'succeeded') {
        content = (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista jugadores">
                    <TableHead sx={{backgroundColor:'#273237'}}>
                        <TableRow>
                            <TableCell align="center" sx={{color: 'white'}}>Imagen</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Apellido</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Apodo</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Edad</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Posicion</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Inicio de Contrato</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Finalización de Contrato</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Id</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jugadores.map((jugador) => (
                            <TableRow
                                key={jugador.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">
                                    <JugadorAvatar fotoJugador={imgUrl + jugador.foto} />
                                </TableCell>
                                <TableCell align="center">{jugador.nombre}</TableCell>
                                <TableCell align="center">{jugador.apellido}</TableCell>
                                <TableCell align="center">{jugador.apodo}</TableCell>
                                <TableCell align="center">{calculateAge(jugador.fNac)}</TableCell>
                                <TableCell align="center">{jugador.posicion ? jugador.posicion.nombre : ''}</TableCell>
                                <TableCell align="center">{dayjs(jugador.iniContrato).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="center">{dayjs(jugador.finContrato).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="center">{jugador.id}</TableCell>
                                <TableCell align="center">
                                    <div className="action-buttons">
                                        <IconButton>
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(jugador.id)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar Jugador"
                                    contentText={`¿Deseas eliminar al jugador ${jugador.nombre}?`}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (jugadoresStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <div>
                <Button variant="contained" onClick={() => router.navigate('../agregar-jugador')} >Añadir jugador</Button>
            </div>
            {content}
        </section>
    )
}

export default JugadoresList;