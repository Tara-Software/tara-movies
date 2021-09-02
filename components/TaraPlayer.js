export default function TaraPlayer() {
    return (
        <div id="videoContainer" data-fullscreen="false">
            <video id="video" controls preload="metadata">
                <source src="/videos/earth.mp4" type="video/mp4" />
                <object type="application/x-shockwave-flash" data="flash-player.swf?videoUrl=http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4" width="1024" height="576">
                    <param name="movie" value="flash-player.swf?videoUrl=http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4" />
                    <param name="allowfullscreen" value="true" />
                    <param name="wmode" value="transparent" />
                    <param name="flashvars" value="controlbar=over&amp;image=img/poster.jpg&amp;file=flash-player.swf?http://iandevlin.github.io/mdn/video-player/videoUrl=video/tears-of-steel-battle-clip-medium.mp4" />
                    {/* <img alt="Tears of Steel poster image" src="img/poster.jpg" width="1024" height="428" title="No video playback possible, please download the video from the link below" /> */}
                </object>
            </video>
            <div id="video-controls" className="controls" data-state="hidden">
                <button id="playpause" type="button" data-state="play">Play/Pause</button>
                <button id="stop" type="button" data-state="stop">Stop</button>
                <div className="progress">
                    <progress id="progress" value="0" min="0">
                        <span id="progress-bar"></span>
                    </progress>
                </div>
                <button id="mute" type="button" data-state="mute">Mute/Unmute</button>
                <button id="volinc" type="button" data-state="volup">Vol+</button>
                <button id="voldec" type="button" data-state="voldown">Vol-</button>
                <button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
            </div>
	    </div>
    )
}