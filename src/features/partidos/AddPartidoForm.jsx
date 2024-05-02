import { useDispatch, useSelector } from "react-redux"
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from "react";
import { addPartido } from "./partidosSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import './partidos.css';
import { router } from "../../router/router";

const AddPartidoForm = () => {
    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const [fecha, setFecha] = useState(dayjs());
    const [equipoLocal, setEquipoLocal] = useState('');
    const [equipoVisitante, setEquipoVisitante] = useState('');
    const [resultado, setResultado] = useState('');

    const onFechaChanged = e => setFecha(e);
    const onEquipoLocalChanged = e => setEquipoLocal(e.target.value);
    const onEquipoVisitanteChanged = e => setEquipoVisitante(e.target.value);
    const onResultadoChanged = e => setResultado(e.target.value);

    const onSavePartidoClicked = () => {
        try {
            dispatch(addPartido(
                {
                    fecha: fecha,
                    resultado: resultado,
                    equipoLocalId: equipoLocal.id,
                    equipoVisitanteId: equipoVisitante.id
                }
            ));
            router.navigate('../gestion-partidos');
        } catch (error) {
            console.error('Failed to save partido', error);
        } finally {
            setFecha(dayjs());
            setEquipoLocal('');
            setEquipoVisitante('');
            setResultado('');
        }
    }

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

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
                                    <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
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
                                    <MenuItem value={equipo}>{equipo.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <TextField
                        id="resultado"
                        label="Resultado"
                        value={resultado}
                        onChange={onResultadoChanged} 
                        sx={{minWidth: 300}}
                    />
                </div>
                <div>
                    <Button variant="contained" onClick={onSavePartidoClicked}>Salvar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddPartidoForm;