import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import styles from './Navigation.module.css'

export default function Navigation(props) {
    const user_URL = (props.username ? "/" + props.username + "/dashboard" : "#")
    const settings_URL = (props.username ? "/" + props.username + "/settings" : "#")
    const index_URL = (props.username ? "/browse" : "/")
    const watchlist_URL = (props.username ? "/" + props.username + "/watchlist" : "#")
    const image = (props.avatar ? props.avatar : "/images/avatar.default.png")

    useEffect(() => {
        // Close the dropdown menu if the user clicks outside of it
        window.onclick = function(event) {
            if(!event.target.className.includes("dd_")) {
                var dd = document.getElementById("dd")
                if(dd != null) dd.classList.remove("show")
            }
        } 
    })

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function toggleShowDropDown() {
        document.getElementById("dd").classList.add("show");
    }
    
    
    
    return (
        <nav className={styles.web_nav}>
            <div className={styles.left}>
                <span className={styles.middle}><Link href={index_URL}>TaraMovies</Link></span>
                </div>
            <div className={styles.right}>
                {!props.username &&
                    <>
                    <span className={styles.item_right+ " " + styles.middle}><Link href="/login">Login</Link></span>
                    <span className={styles.item_right+ " " + styles.middle}><Link href="/signup">Signup</Link></span>
                    </>    
                }
                {props.username &&
                    <>
                    <div className={styles.dropdown}  onClick={toggleShowDropDown}>
                        <div className={styles.dd_cover}>
                            <Image src={image} width="32px" height="32px" className="dd_image"/>
                            <span className={styles.dd_cover_name}>{props.username || ""}</span>
                            </div>
                        <div className={styles.dd_content} id="dd">
                            <div className={styles.dd_item}><Link href={user_URL}>{props.username}</Link></div>
                            <div className={styles.divider}></div>
                            <div className={styles.dd_item}><Link href={user_URL}>Mi cuenta</Link></div>
                            <div className={styles.dd_item}><Link href={watchlist_URL}>Lista de reproducción</Link></div>
                            <div className={styles.dd_item}><Link href={user_URL}>Lorem</Link></div>
                            <div className={styles.dd_item}><Link href={settings_URL}>Configuración</Link></div>
                            <div className={styles.dd_item}><Link href={user_URL}>Random</Link></div>
                            <div className={styles.divider}></div>
                            <div className={styles.dd_item}><Link href="/logout">Cerrar sesión</Link></div>
                        </div>
                    </div>
                    </>
                }

            </div>
        </nav>
    )

}