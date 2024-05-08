import { useDispatch, useSelector } from "react-redux"
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from "react";
import { addPartido } from "./partidosSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Input } from "@mui/material";
import './partidos.css';
import { paths, router } from "../../router/router";
import { fetchJugadores, getJugadoresStatus, selectAllJugadores } from "../jugadores/jugadoresSlice";
import { addJugadorToPartido } from "../jugador-to-partido/jugadorToPartidoSlice";

const AddPartidoForm = () => {
    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);

    const [fecha, setFecha] = useState(dayjs());
    const [equipoLocal, setEquipoLocal] = useState('');
    const [equipoVisitante, setEquipoVisitante] = useState('');
    //const [resultado, setResultado] = useState('');
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);


    const onFechaChanged = e => setFecha(e);
    const onEquipoLocalChanged = e => setEquipoLocal(e.target.value);
    const onEquipoVisitanteChanged = e => setEquipoVisitante(e.target.value);
    const onGolesLocalChanged = e => setGolesLocal(e.target.value);
    const onGolesVisitanteChanged = e => setGolesVisitante(e.target.value);
    //const onResultadoChanged = e => setResultado(e.target.value);

    const onSavePartidoClicked = () => {
        try {
            dispatch(addPartido(
                {
                    fecha: fecha,
                    //resultado: resultado,
                    equipoLocalId: equipos.filter(equipo => equipo.nombre === equipoLocal)[0].id,
                    equipoVisitanteId: equipos.filter(equipo => equipo.nombre === equipoVisitante)[0].id,
                    golesLocal: golesLocal,
                    golesVisitante: golesVisitante,
                }
            ))
            .then((response) => {
                const partidoId = response.payload.id;
                if(partidoId) {
                    const jugadoresPromises = jugadores.filter(jugador => jugador.equipo && (jugador.equipo.nombre === equipoLocal || jugador.equipo.nombre === equipoVisitante)).map((jugador) => {
                        return dispatch(
                            addJugadorToPartido({
                                jugadorId: jugador.id,
                                partidoId: partidoId,
                                convocado: false,
                                lesionado: false,
                                minJugados: 0,
                                goles: 0,
                                asistencias: 0,
                                tarjetasAmarillas: 0,
                                tarjetasRojas: 0,
                                valoracion: 0,
                            })
                        )
                    });
                    Promise.all(jugadoresPromises)
                    .then(() => {
                        router.navigate(paths.gestionPartidos, {replace: true});
                    });
                }
            });
        } catch (error) {
            console.error('Failed to save partido', error);
        } finally {
            setFecha(dayjs());
            setEquipoLocal('');
            setEquipoVisitante('');
            setGolesLocal(0);
            setGolesVisitante(0);
            //setResultado('');
        }
    }

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    useEffect(() => {
        if(jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }   , [jugadoresStatus, dispatch]);

    return (
        <section className="addpartido">
            <h2>Salvar partido</h2>
            <form className="addpartido-form">
                <div className="addpartido-form-fields">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <DatePicker 
                            label="Fecha"
                            value={fecha}
                            onChange={onFechaChanged}
                        />
                    </LocalizationProvider>
                    <FormControl sx={{minWidth: 300}}>
                        <InputLabel id="equipolocal-label">Equipo Local</InputLabel>
                        <Select
                            labelId="equipolocal-label"
                            id="equipolocal"
                            value={equipoLocal}
                            label="Equipo Local"
                            onChange={onEquipoLocalChanged}
                        >
                            {
                                equipos.map((equipo) => (
                                    <MenuItem key={equipo.id} value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Input
                        sx={{width: 200}}
                        size="small"
                        placeholder="Goles equipo local"
                        type="number"
                        onChange={onGolesLocalChanged}
                        inputProps={{
                            min: 0,
                            max: 100,
                        }}
                    />
                    <FormControl sx={{minWidth: 300}}>
                        <InputLabel id="equipovisitante-label">Equipo Visitante</InputLabel>
                        <Select
                            labelId="equipovisitante-label"
                            id="equipovisitante"
                            value={equipoVisitante}
                            label="Equipo Visitante"
                            onChange={onEquipoVisitanteChanged}
                        >
                            {
                                equipos.map((equipo) => (
                                    <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Input
                        sx={{width: 200}}
                        size="small"
                        placeholder="Goles equipo local"
                        type="number"
                        onChange={onGolesVisitanteChanged}
                        inputProps={{
                            min: 0,
                            max: 100,
                        }}
                    />
                    {/* <TextField
                        id="resultado"
                        label="Resultado"
                        value={resultado}
                        onChange={onResultadoChanged} 
                        sx={{minWidth: 300}}
                    /> */}
                </div>
                <div className="addpartido-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSavePartidoClicked}>Salvar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionPartidos, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddPartidoForm;