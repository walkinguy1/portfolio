import { Container } from 'react-bootstrap'
import './App.css'
import { NavBar } from './components/nav.jsx'
import { Banner } from './components/banner.jsx'
import { Footer } from './components/footer.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <div className="App">
        <NavBar />
        <Banner />
        <Footer />
      </div>  
    </>
  )
}

export default App
