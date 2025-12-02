import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import Home from './pages/Home.jsx';
import Base from './pages/Base.jsx';
import BaseDonations from './pages/BaseDonations.jsx'
import BaseVolunteers from './pages/BaseVolunteers.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Events from './pages/Events.jsx';
import Alliance from './pages/Alliance.jsx';
import Donations from './pages/Donations.jsx';
import BaseBeneficiary from './pages/BaseBeneficiary.jsx';
import BaseEvents from './pages/BaseEvents.jsx';
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx';


createRoot(document.getElementById('root')).render(
  //const [authed, setAuthed] = useState('login')
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='login' element= {<Login/>}/>
        <Route path="login/forgot-password" element={<Base/>} />
        <Route path="create-account" element={<Register/>} />
        <Route path="about" element={<About />} />
        <Route path="base" element={<Base/>} />
        <Route path="base/donations" element={<BaseDonations/>} />
        <Route path="base/volunteers" element={<BaseVolunteers/>} />
        <Route path="base/beneficiary" element={<BaseBeneficiary/>} />
        <Route path="base/events" element={<BaseEvents/>} />
        <Route path="services" element={<Services/>} />
        <Route path="events" element={<Events/>} />
        <Route path="alliance" element={<Alliance/>} />
        <Route path="contact" element={<Contact/>} />
        <Route path="donations" element={<Donations/>} />
      </Routes>  
    </BrowserRouter>
  </StrictMode>,
)