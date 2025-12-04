import { useState } from 'react'
import Header from '../components/Header.jsx'
import FloatingButton from "../components/FloatingButton";

export default function Contact() {
    return(
        <>
            <div><Header/></div>
            <div>
                <h1>Contáctanos</h1> 
                <h2>Te escuchámos</h2>
                <h2>Queremos conocerte</h2>
                <h3>Nos encantaría conocer tú experiencia, para así poder trabajar de mejor forma y servir a la sociedad 
                    en general, en una constante búsqueda de mayor equidad y reconocimientos.</h3>
                <h3>Además, para nosotros es muy importante generar nuevos lazos, que nos lleven juntos a mejores resultados.</h3>
                <div>
                    <h2>Whatsapp</h2>
                    <h3>Lunes a Viernes</h3>
                    <h3>09:00 a 17:00</h3>
                </div>
                <div>
                    <h2>Correo</h2>
                    <h3>contacto@semejantes.cl </h3>
                </div>
                <div>
                    <h2>Instagram</h2>
                    <h3>@semejantes.chile</h3>
                </div>
                <div>
                    <h2>Facebook</h2>
                    <h3>Semejantes</h3>
                </div>
            </div>
            <div>
                <FloatingButton/>
            </div>
        </>

    );
}