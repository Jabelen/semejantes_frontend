import { useState } from 'react'
import viteLogo from '/vite.svg'
import Header from '../components/Header.jsx'
import FloatingButton from "../components/FloatingButton";

export default function Contact() {
    return(
        <>
            <div><Header/></div>
            <div>
                <h1>Contáctanos</h1> 
                <h2>Te escuchámos</h2>
            </div>
            <div>
                <FloatingButton/>
            </div>
        </>

    );
}