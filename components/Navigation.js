import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import styles from './Navigation.module.css'

export default function Navigation(props) {
    const user_URL = (props.username ? "/" + props.username + "/dashboard" : "#")
    const settings_URL = (props.username ? "/" + props.username + "/settings" : "#")
    const index_URL = (props.username ? "/browse" : "/")
    const watchlist_URL = (props.username ? "/" + props.username + "/watchlist" : "#")
    const image = (props.avatar ? `${process.env.NEXT_PUBLIC_VIDEOS_URL}/${props.avatar}` : "/images/default.png")

    useEffect(() => {
        // Close the dropdown menu if the user clicks outside of it
        window.onclick = function(event) {
            if(event.target.localName == "path" || !event.target.className.includes("dd_")) {
                var dd = document.getElementById("dd")
                if(dd != null) dd.classList.remove("show")
                if(document.getElementById("global-mask") != null) document.getElementById("global-mask").classList.remove("mask")
                var arrow = document.querySelector(".arrow")
                if(arrow) {
                    arrow.classList.remove("rotation")
                }
                if (window.matchMedia("(max-width: 450px)").matches) {
                    /* La pantalla tiene menos de 450 píxeles de ancho */
                    document.documentElement.style.overflowY = "initial"
                    document.body.style.overflowY = "initial"
                }
            }
        } 
    })
    const exitMenu = () => {
        document.getElementById("dd").classList.remove("show")
        document.getElementById("global-mask").classList.remove("mask")
        if (window.matchMedia("(max-width: 450px)").matches) {
            /* La pantalla tiene menos de 450 píxeles de ancho */
            document.documentElement.style.overflowY = "initial"
            document.body.style.overflowY = "initial"
        }
    }
    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function toggleShowDropDown() {
        document.getElementById("dd").classList.add("show");
        var arrow = document.querySelector(".arrow")
        if(arrow) {
            arrow.classList.add("rotation")
        }
        if (window.matchMedia("(max-width: 450px)").matches) {
            /* La pantalla tiene menos de 450 píxeles de ancho */        
            document.getElementById("global-mask").classList.add("mask")
            document.documentElement.style.overflowY = "hidden"
            document.body.style.overflowY = "hidden"

        } 

    }
    
    
    
    return (
        <nav className={styles.web_nav}>
            <div id="global-mask" />
            <div className={styles.left}>
                <div className={styles.middle}>
                    
                        <div className={styles.index_url}>
                            <div className={styles.image_icon}>
                                
                            <Link href={index_URL}><img className={styles.tara_icon} src="/images/tara-software-logo-alt.svg" /></Link>
                            </div>
                            <span className={styles.image_text}><Link href="/"><img src="/images/tara-movies-text.svg" /></Link></span>

                        </div>
                </div>
            </div>
            <div className={styles.right}>
                {!props.username &&
                    <>
                    <span className={styles.item_right+ " " + styles.middle + " login"}><Link href="/login">Iniciar sesión</Link></span>
                    </>    
                }
                {props.username &&
                    <>
                    <div className={styles.dropdown}  onClick={toggleShowDropDown}>
                        <div className={styles.dd_cover}>
                            <Image src={image} width="32px" height="32px" className="dd_image"/>
                            <span className={styles.dd_cover_name + " arrow"}>{props.username || ""}</span>
                            </div>
                        <div className={styles.dd_content} id="dd">
                            <div className={styles.dd_info}>
                                <span className={styles.dd_title}>Opciones</span>
                                <div className={styles.dd_close} onClick={exitMenu}><img src="/images/icons/close-outline.svg" /></div>
                            </div>
                            <Link href={user_URL}><div className={styles.dd_item}>{props.username}</div></Link>
                            <div className={styles.divider}></div>
                            {/* <Link href={user_URL}><div className={styles.dd_item}>Mi cuenta</div></Link> */}
                            <Link href={watchlist_URL}><div className={styles.dd_item}>Lista de reproducción</div></Link>
                            <Link href="/admin/control-panel"><div className={styles.dd_item}>Admininistración</div></Link>
                            <Link href={settings_URL}><div className={styles.dd_item}>Configuración</div></Link>
                            <div className={styles.divider}></div>
                            <Link href="/logout"><div className={styles.dd_item}>Cerrar sesión</div></Link>
                        </div>
                    </div>
                    </>
                }

            </div>
        </nav>
    )

}