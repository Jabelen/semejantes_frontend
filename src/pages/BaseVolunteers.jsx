import BurgerMenu from "../components/BurgerMenu";
import FloatingButton from "../components/FloatingButton";
import Header from "../components/Header";

export default function BaseVolunteers() {
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
        </>

    );
}