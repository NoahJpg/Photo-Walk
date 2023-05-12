import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GoogleMaps from './components/GoogleMaps';



const App = () => {
  return (
    
    <div className='App'>
      <React.Fragment>
        <Header />
        <GoogleMaps />
        <Footer />
      </React.Fragment>
    </div>
    
  );
}

export default App;
