import { useState } from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar(props) {
    const [ formattedSeconds, setFormattedSeconds] = useState("00:00")
    const [ secondsPlayed, setSecondsPlayed ] = useState("")
    const [ handled, setHandled] = useState(false)

    

    //max={props.max} min={props.min} value={props.value}
    const handleClientX = (e) => {

        setHandled(true);
        
        var progress = document.getElementById("progress")
        var progress_button = document.getElementById("progress_button")
        const bg_progress = document.getElementById("bg-progress")
        var seconds_info = document.getElementById("seconds_info")
        const rect = progress.getBoundingClientRect();
        if(e.clientX - rect.left >= 0 && e.clientX - rect.left <= bg_progress.offsetWidth) {
            seconds_info.style.opacity = 1
            progress.style.width = e.clientX - rect.left + "px"
            progress_button.style.left = e.clientX - rect.left - 10 + "px"
            seconds_info.style.left = e.clientX - rect.left - 50 + "px"
        }
        // Preparación para la preview de los segundos
        var previewSeconds = Math.abs((e.clientX - rect.left) / bg_progress.offsetWidth);
        if(previewSeconds < 0) {
            previewSeconds = 0;
        } else if(previewSeconds > 1) {
            previewSeconds = 1;
        }
        setFormattedSeconds(progressToSeconds(previewSeconds))

        // gestión del mouse
        document.onmousemove = handleClientX
        document.onmouseup = handleUp
    }
    const handleUp = (e) => {
        document.getElementById("seconds_info").style.opacity = 0

        var progress = document.getElementById("bg-progress")
        var rect = progress.getBoundingClientRect()
        var seekTo = Math.abs((e.clientX - rect.left) / progress.offsetWidth);
        if(seekTo < 0) {
            seekTo = 0;
        } else if(seekTo > 1) {
            seekTo = 1;
        }
        // Llamamos a la función que cambia el valor mágico
        props.handleSeek(seekTo)
        // Cerramos el drag
        document.onmousemove = null;
        document.onmouseup = null;

        setHandled(false)
    }
    const progressToSeconds = (progress) => {
        var res = ""
        // Segundos 
        const time = progress * props.duration
        // Segundos 
        res += parseInt(time % 60).toLocaleString("es-ES", {minimumIntegerDigits:2})
        // minutos
        res = ":" + res
        res = parseInt(time % 3600 / 60).toLocaleString("es-ES", {minimumIntegerDigits:2}) + res
        if(parseInt(time/3600) > 0 ) {
            res = parseInt(time/3600) + ":" + res
    }

        return res
    }
    return (
        <> 
        <div className={styles.wrapper} onMouseDown={handleClientX}>
            <div className={styles.seconds_info} id="seconds_info" style={{left: handled ? "" : `calc(${props.played}% - 50px)`}}>{formattedSeconds} / {props.durationS}</div>        
            <div className={styles.buffer} id="buffer" style={{width: `${props.loaded}%`}}></div>
            <div className={styles.progress} id="progress" style={{width: handled ? "" : `${props.played}%`}}></div>
            <div className={styles.progress_button} onMouseDown={handleClientX} id="progress_button" style={{left: handled ? "" : `calc(${props.played}% - 10px)`}}></div>
            <div className={styles.bg} id="bg-progress"></div>
        </div>
        </>
    )
}