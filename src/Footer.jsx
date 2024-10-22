import React from "react"
import Style from "./css/footer.module.css"

export default function Footer(){
    return (
        
        <div className={Style.footerContainer}>
            <h2>Note</h2>
            <p>Your photo will be stored for 24 hours and deleted <br />
            after printing or automatically after that time.</p>
        </div>
    )
}