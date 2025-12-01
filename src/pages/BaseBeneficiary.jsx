import BurgerMenu from "../components/BurgerMenu";
import FloatingButton from "../components/FloatingButton";
import Header from "../components/Header";

export default function BaseBeneficiary() {
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
                <a className="btn" href="/base/beneficiary/applications">Solicitudes</a>
                <a className="btn" href ="/base/beneficiary/resolved">Beneficiarios</a>
                <a className="btn"href="/base/beneficiary/statistics">Estadísticas</a>
            </div>
        </>

    );
}
<a id="voluntarios" className="menu-item" href="/base/volunteers">Voluntarios</a>