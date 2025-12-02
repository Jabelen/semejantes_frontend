import { useState } from 'react'
import './Home.css'
import Header from '../components/Header.jsx'
import images from "../data/images.js"
import FloatingButton from "../components/FloatingButton";
import Slider from '../components/Slider.jsx'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header/>
      </div>
      <div>
        <h2>ONG Semejantes</h2>
        <h1>Integrando a personas con discapacidad</h1>
        <h2>Porque cada persona es valiosa, amada y tiene propósito en Dios</h2>
      </div>
      <div>
        <Slider>
          {images.map((image, index) => {
          return <img key={index} src={image.imgURL} alt={image.imgAlt} />;
        })}
        </Slider>
      </div>
      <div>
          <FloatingButton/>
      </div>
    </>
  )
}

export default Home
