export default function Form({elements}, submit) {
    console.log(elements)
    const outFocus = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        if(!e.target.value) {
            label.style.top = "15px"
            label.style.fontSize = "16px"
        }
    }
    const focusInput = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        label.style.top = "5px";
        label.style.fontSize = "11px";
    }
    return (
        <>
        {
        elements.map(({title, label, type}, id) => {
            return (
                <div key={id} className="input-wrapper">
                    {type != "submit" &&
                    <div className="input-wrapper-relative">
                        <label className={"input_" + title}>
                            <input type={type} id={title}  onBlur={outFocus} onFocus={focusInput} />
                            <label className="place-label" id={title + "-label"} htmlFor={title}>{label}</label>
                        </label>
                    </div>
                    }
                    {type == "submit" && 
                        <button className={title}>{label}</button>
                    }
                </div>
            )
        })
        }
        </>
    )
}