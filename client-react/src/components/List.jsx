import React from 'react';
import ListEntry from './ListEntry.jsx';
console.log("ListEntry: ", ListEntry);

const List = ({breeds, clickHandler,addDefaultSrc}) => (
  
    <div className="breed-container">
        {breeds.map((breed, i) => {
          return <ListEntry key={i} breed={breed} clickHandler={clickHandler} addDefaultSrc={addDefaultSrc}/>
        })}
  
  </div>
) 


export default List;