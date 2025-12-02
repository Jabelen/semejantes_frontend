import BurgerMenu from "../components/BurgerMenu";
import FloatingButton from "../components/FloatingButton";
import Header from "../components/Header";
import { useState } from "react";

export default function BaseBeneficiary() {
    const [selected, setSelected] = useState('applications');
    return(
        <>
            <div>
                <BurgerMenu/>
            </div>
            <div>
                <Header/>
            </div>
            <div>
                <FloatingButton/>
            </div>
            <div>
                <button onClick = {() => setSelected('applications')} className="btn">Solicitudes</button>
                <button onClick = {() => setSelected('beneficiary')} className="btn">Beneficiarios</button>
                <button onClick = {() => setSelected('statistics')} className="btn">Estadísticas</button>
            </div>
            {selected == 'applications'&& <h1>XD</h1>}
            <h1>XD1</h1>
            <h1>XD2</h1>
        </>

    );
}
<a id="voluntarios" className="menu-item" href="/base/volunteers">Voluntarios</a>