import React from 'react';
import axios from 'axios';
import DogSearch from './DogSearch.jsx';

class AdoptList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adoptables: [],
      unfiltered: [],
    }
    this.refactorPetFinderData = this.refactorPetFinderData.bind(this);
    this.searchDogs = this.searchDogs.bind(this);
  }
  
  componentDidMount() {
    if(this.props.match) {
      axios.post('/adopt', {
        breedName: this.props.match.params.breed,
        zipCode: this.props.match.params.zip
      })
      .then(res => {
        var refactoredData = this.refactorPetFinderData(res.data.pet);
        this.setState({
          adoptables: refactoredData
        })
      }).catch(err => {
        console.error(err);
      }) 
    }
  }

  refactorPetFinderData(data) {
    // FILTERING ONLY THE NECESSARY DATA

    if(data) {
      return (
        data.map(dog => {
          var compressed = {
            name: dog.name.$t,
            age: dog.age.$t,
            description: dog.description.$t,
            zip: dog.contact.zip.$t,
            email: dog.contact.email.$t,
            sex: dog.sex.$t
          };
          // SOME DOGS DON'T HAVE A PICTURE OR PICTURES IN BAD FORMATS. THE SIZE FORMATS "x" AND "pn" WORK FOR US
          // WE CHECK IF ONE OF THOSE IS AVAILABLE (PREFERABLY "x"), AND SET IT AS PHOTO, IF NOT WE GIVE IT A PLACEHOLDER
          if(dog.media.photos) {
            var pics = {};
            dog.media.photos.photo.forEach(photo => {
              if(photo['@size'] === 'x' || photo['@size'] === 'pn') {
                if(!pics.hasOwnProperty(photo['@size'])) {
                  pics[photo['@size']] = photo.$t;
                }

              }
            })
            if(pics.hasOwnProperty('x')) {
              compressed.photo = pics.x;
            } else if (pics.hasOwnProperty('pn')) {
              compressed.photo = pics.pn;
            } else {
              compressed.photo = 'http://www.dohyokennels.com/img/dog-placeholder.jpg';
            }
          }
          return compressed;
        })
      )
    } else {
      return undefined;
    }
  }

  searchDogs(params) {
    //The searchnow filters the breeds dynamicly as the user makes their selection for characteristics. As each selection is made, searchNow is invoked. 
    var allDogs;

    //Checks to see if this is the first the filter is being used, if yes than a copy of all the breeds is kept in the state as unfiltered so additional api calls are unnecssary.
    if(this.state.unfiltered.length === 0){
      allDogs = this.state.adoptables.slice();
    } else {
      allDogs = this.state.unfiltered.slice();
    };

    //If all the selections are 'unselected' or zero, than all the breeds are shown.
    if(params.favorite.length + params.sex.length + params.age.length + params.options.length === 0){
      this.setState({
        adoptables: allDogs,
        unfiltered: allDogs,
      });
    } else {
      //Based on the selection, certain breeds are shown and others are not.
      var createSelector = (dog, category) => {
        if (params[category].length !== 0) {
          if (category === 'options') {
            if (params.options.includes('catsOk') && dog.options.includes('noCats')) {
              return false;
            }
            if (params.options.includes('kidsOk') && dog.options.includes('noKids')) {
              return false;
            }
          }
          return params[category].some(characteristic => {
            return characteristic === dog[category];
          })
        } else {
          return true;
        }
      }

      var filteredDogs = allDogs.filter(dog => {
        var favoriteSelect = createSelector(dog, 'favorite');
        var sexSelect = createSelector(dog, 'sex');
        var ageSelect = createSelector(dog, 'age');
        var optionsSelect = (dog) => {
          if (params.options.length !== 0) {
            if (params.options.includes('catsOk') && dog.options.includes('noCats')) {
              return false;
            }
            return params.options.some(characteristic => {
              return characteristic === dog[category];
            })
          } else {
            return true;
          }
        }
       
        console.log('favoriteSelect', favoriteSelect);
        console.log('sexSelect', sexSelect);
        console.log('ageSelect', ageSelect);
        console.log('optionsSelect', optionsSelect);
  
        return favoriteSelect && sexSelect && ageSelect && optionsSelect;
      }); //end of filter

      this.setState({
        adoptables: filteredDogs,
        unfiltered: allDogs,
      });
    }; //end of if else
  } //end of searchNow()
  
  render() {
    if(this.state.adoptables) {
      if(this.state.adoptables.length === 0) {
        return (
          <div className="loading-div">
            <p className="loading-text">Going to space and looking for doggos . . .</p>
          </div>
        )
      }
      return (
        <div className="below-header">
          <DogSearch searchDogs={this.searchDogs}/>
          <div className="breed-container flex">
          {this.state.adoptables.map((dog, i)=>{
            return(
              <div key={i} className="flex list-item">
                <div className='adopt-rightside'>
                  <img src={dog.photo} width='250' height= '260'/>
                  <a href={`mailto:${dog.email}?subject=I would like to adopt ${dog.name}!&body=Hello! I was looking at ${dog.name} and I believe we would have the most amazing adventures together. I would like to meet and see if the feeling is mutual. Please let me know if you have any other questions!`} target='_self'><button className = 'adopt-me'>Adopt me!</button></a>
                </div>
                <div className="item-text">
                  <h2>Name: {dog.name}</h2>
                  <p>{dog.description}</p>
                  <div className="flex zip-age">
                    <h4>Age: {dog.age}</h4>
                    <h4>Sex: {dog.sex}</h4>
                    <h4>Zip Code: {dog.zip}</h4>
                  </div>
                </div>
              </div>
            )
          })} 
          </div>    
        </div>
      )
    } else {
      return (
        <div className="no-adoptables-div">
          <img className="no-adoptables-img" src={'https://i0.wp.com/alawalnews.net/wp-content/uploads/2018/04/do.jpg?ssl=1'}/>
          <p className="no-adoptables-text">There are no dogs of this breed for adoption in your area :( </p>
        </div>
      )
    }
  }
}
 
  export default AdoptList;
