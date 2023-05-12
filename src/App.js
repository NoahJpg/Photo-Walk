import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Map from './components/GoogleMaps';



const App = () => {
  return (
    
    <div className='App'>
      <React.Fragment>
        <Header />
        
        <Footer />
      </React.Fragment>
    </div>
    
  );
}

export default App;
