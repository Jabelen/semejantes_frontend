import Header from '../components/Header.jsx'
import EventCard from '../components/EventCard.jsx';
import FloatingButton from "../components/FloatingButton";

export default function Events() {
    return(
        <>
            <div>
                <Header/>
            </div>
            <div>
                <EventCard event="Ruedas para Chile" direction="Av. Avenida 9876, Ciudad" hrI="09" mnI="00" hrT="19" mnT="30" rutaImg=""/>
            </div>
            <div>
                <FloatingButton/>
            </div>
        </>

    );
}