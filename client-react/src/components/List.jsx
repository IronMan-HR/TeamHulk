import React from 'react';
import ListEntry from './ListEntry.jsx';

const List = ({breeds, clickHandler,addDefaultSrc}) => (
      <div className='display-right'>
        <div className="breed-container">
          {breeds.map((breed, i) => {
            return <ListEntry key={i} breed={breed} clickHandler={clickHandler} addDefaultSrc={addDefaultSrc}/>
          })}
        </div>
        
        {/* FOOTER */}
        <div className="info">
            <div id="mission" className="text box">
                <h3>Mission</h3>
                <p>We aim to simplify the dog adoption process by targeting breeds that will pair favorably with your lifestyle, and locating local area dogs in need of a good home.</p>
            </div>
            <div className='bottom-logo box'>
              <img src='logo2.png' alt='logo'width="85" />
            </div>
            <div  id="aboutUs"className="text box">
              <h3>About Us</h3>
              <p>Doggy consists of four developers whose love for dogs has inspired us to build a solution for the number of aspiring pet owners that can't quite figure out how to get started.</p>
            </div>
          </div>

          <div className= 'copyright'>
            <p>©2018 Doggy App All rights reserved.</p>
          </div> 
      </div>
  )



export default List;