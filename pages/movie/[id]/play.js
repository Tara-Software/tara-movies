import { getUserAuth } from "../../../lib/auth";
import { getMovieData } from "../../../lib/movies";
import ReactPlayer from 'react-player'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Head from 'next/head'
import ProgressBar from '../../../components/ProgressBar'
import Link from "next/link";

export default function Movie({ user, movie, data}) {
    const [ playing   , setPlaying ]    = useState(false)
    const [ mute      , setMute    ]    = useState(false)
    const [ isFullScreen, setIsFullScreen ] = useState(false)
    const [ progressVideo, setProgressVideo ] = useState("0")
    const [ bufferVideo, setBufferVideo ] = useState("0");
    const [ playedSeconds, setPlayedSeconds ] = useState("00:00")
    const [ totalTime, setTotalTime ] = useState("0")
    const [ volume, setVolume ] = useState("1")
    const handleFullSreen = useFullScreenHandle();
    const [ opacityHandled, setOpacityHandled ] = useState(false)
    const player = useRef(null)

    


    // Obtener valor del volumen de localStorage
    useEffect(() => {
        const volume = window.localStorage.getItem("volume")
        setVolume(volume || 1)
    }, [])
    const reportChange = (e) => {
        var fc_icon = document.getElementsByClassName("fullscreen-icon")[0]
        if(e) {
            fc_icon.classList.remove("expand-bg-button")
            fc_icon.classList.add("contract-bg-button")
        } else {
            fc_icon.classList.add("expand-bg-button")
            fc_icon.classList.remove("contract-bg-button")
        }
        setIsFullScreen(e)
    }
    const handleProgress = (play) => {
        const progress = (play.played * 100);
        setProgressVideo(progress.toString())
        setPlayedSeconds(progressToSeconds(play.played))
        setBufferVideo(play.loaded * 100)
    }
    const handleDuration = (duration) => {
        setTotalTime(Math.round(duration))
    }
    const progressToSeconds = (progress) => {
        var res = ""
        // Segundos 
        const time = progress * totalTime
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
    const durationToSeconds = (duration) => {
        var res = ""
        const seconds = parseInt(duration % 60).toLocaleString("es-ES", {minimumIntegerDigits:2})
        const minutes = parseInt(duration % 3600 / 60).toLocaleString("es-ES", {minimumIntegerDigits:2})
        // const minutes = parseInt(duration % 60).toLocaleString("es-ES", {minimumIntegerDigits:2})
        if(parseInt(duration/3600) > 0 ) {
            res = parseInt(duration/3600) + ":" + res
        }
        return res + minutes + ":" + seconds;
        
    }
    const handlePause = () => {
        var pauseButton = document.getElementById("pause-button");
        var play_pause = document.getElementsByClassName("play-pause")[0]

        setPlaying(!playing);
        if(playing) {
            pauseButton.classList.add("pause-button-play")
            pauseButton.classList.remove("pause-button-pause")
            play_pause.classList.remove("pause-bg-button")
            play_pause.classList.add("play-bg-button")

        }
        else {
            pauseButton.classList.remove("pause-button-play")
            pauseButton.classList.add("pause-button-pause")
            play_pause.classList.remove("play-bg-button")
            play_pause.classList.add("pause-bg-button")
            
        }
    }
    const handleMute = () => {
        var volume_icon = document.getElementsByClassName("volume-icon")[0];

        // Al igual que en handlePause, no se actualiza el valor hasta 
        // acabar la función yo creo, entonces hay que ver el valor ** futuro **
        setMute(!mute)
        
        if(!mute) {
            volume_icon.classList.add("volume-mute")
        } else {
            volume_icon.classList.remove("volume-mute")
        }

    }
    const handleSeekTo = (seekTo) => {
        player.current.seekTo(seekTo)
    }
    const handleMouseMove = () => {
        setOpacityHandled(true);
        handleOpacity()
    }
    const handleOpacity = () => {
        const timeOut = 3000;
        if(!opacityHandled)
        {
            var elems = document.getElementsByClassName("opacable")
            //document.body.style.cursor="default";
            for (let elem of elems) {
                elem.style.opacity = 1
                setTimeout(() => {elem.style.opacity = 0; setOpacityHandled(false)}, timeOut)
            }
            var mask = document.getElementById("mask")
            mask.style.opacity = 0.2
            setTimeout(() => {mask.style.opacity = 0}, timeOut)
            //setTimeout(() => {document.body.style.cursor = "none"}, 4000)
        }
    }
    const handleRewind = () => {
        // Quitar 10 segundos
        player.current.seekTo(progressVideo/100 * totalTime - 10)
    }
    const handleForward = () => {
        player.current.seekTo(parseInt(progressVideo/100 * totalTime) + 10)
    }

    const handleVolume = (e) => {
        setMute(false) 
        var volume_elem = document.getElementsByClassName("volume-icon")[0]
        const volume = e.target.value
        setVolume(volume)
        volume_elem.className = ''
        volume_elem.classList.add("volume-icon")
        if(volume <= 0.2) {
            volume_elem.classList.add("volume-off")
        }
        else if(volume <= 0.4) {
            volume_elem.classList.add("volume-low")
        }
        else if(volume <= 0.7) {
            volume_elem.classList.add("volume-medium")
        } 
        else if(volume >= 0.7) {
            volume_elem.classList.add("volume-high")
        }
        
        // Guardar en localStorage el valor del volumen para que no reviente el sonido siempre
        // Guardar solo al levantar el mouse
        document.onmouseup = () => {
            window.localStorage.setItem("volume", volume)
        }
        
    }
    const handleExit = () => {
        window.location.href = window.location.href.split("/play")[0] + "/preview"
    }

    return (
        <>
        <Head>
            <title>{data.title} | Tara Movies</title>
            <meta type="description" content="Página de previsualización"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <div className="background-movie" style={{width: '100%'}} onMouseMove={handleMouseMove}  onMouseDown={handleMouseMove}>
                
                <div className="player-wrapper" id="playerWrapper" >
                    <FullScreen handle={handleFullSreen} onChange={reportChange}>
                        <span id="mask"></span>
                        <Link href={document.URL.replace("/play", "/preview")}><button id="go-back" className="opacable"></button></Link>

                        <div className="video-wrapper">
                            <ReactPlayer 
                                ref={player} 
                                progressInterval={500} 
                                onDuration={handleDuration} 
                                className="video-player" 
                                onProgress={handleProgress} 
                                url={`${process.env.NEXT_PUBLIC_VIDEOS_URL}/videos/${movie}`}
                                playing={playing} 
                                muted={mute} 
                                volume={Number(volume)}
                            />    
                            <div className="over-video-controls opacable">
                                <button id="rewind" onClick={handleRewind}></button>
                                <button id="pause-button" className="pause-button pause-button-play" onClick={handlePause}></button>
                                <button id="forward" onClick={handleForward}></button>
                            </div>
                        </div>
                        <div className="controls opacable">
                            <button className="play-pause play-bg-button" onClick={handlePause}></button>
                            <div className="progress-info">
                                    <span className="progress-value" style={{color:"white"}}>{playedSeconds}</span>
                                    <ProgressBar played={progressVideo} loaded={bufferVideo} handleSeek={handleSeekTo} duration={totalTime} durationS={durationToSeconds(totalTime)}></ProgressBar>
                                    <span style={{color:"white"}}>{durationToSeconds(totalTime)}</span>
                            </div>
                            <div className="volume-wrapper">
                                <input type="range" min="0" orient="vertical" max="1" value={mute ? 0 : volume} step="0.1" id="slider" onChange={handleVolume}></input>
                                <button className="volume-icon volume-medium" onClick={handleMute}></button>
                            </div>
                            <button className="fullscreen-icon expand-bg-button" onClick={isFullScreen ? handleFullSreen.exit : handleFullSreen.enter}></button>
                        </div>
                    </FullScreen>
                </div>
        </div>
        </>
    )
}
export async function getServerSideProps(ctx) {
    const isAuthenticated = await getUserAuth(ctx);
    if(!isAuthenticated) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    } else {
        const data = await getMovieData(ctx.params.id);
        
        return {props: {user: isAuthenticated.user, movie: ctx.params.id, data: data}}
    }
}