import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';

class Authenticate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      status: '',
      zip: '',
    };
    this.handleUserNameInput = this.handleUserNameInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleZipInput = this.handleZipInput.bind(this);
  }

  handleUserNameInput(e) {
    this.setState({
      username: e.target.value,
    });
  }

  handlePasswordInput(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleZipInput(e) {
    this.setState({
      zip: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var credentials = {
      username: this.state.username,
      password: this.state.password,
      zip: this.state.zip,
    }
    axios.post(`/${this.props.thisPage}`, credentials)
    .then(res => {
      if (res.status === 202) {
        this.setState({
          status: res.data,
        })
      } else if (res.status === 201) {
        this.props.setCredentialsInApp({
          username: credentials.username,
          zip: credentials.zip,
          userIsAuthenticated: true,
        });
      }
    }).catch(err => {
      console.error(err);
    })
  }

  render() {
    if (this.props.userIsAuthenticated) {
      if (localStorage.getItem('previousPage') === 'Profile') {
        return <Redirect to='/profile' />
      } else {
        return <Redirect to='/matchMe' />
      }   
    } else {
      return (
        <div className="authentication-page">
          <h2>{this.props.thisPage}</h2>
          <form onSubmit={this.handleSubmit}>
            <input placeholder="username" value={this.state.username} onChange={this.handleUserNameInput} />
            <input placeholder="password" type="password" value={this.state.password} onChange={this.handlePasswordInput} />
            <input placeholder="zipcode" value={this.state.zip} onChange={this.handleZipInput} />
            <button className="submit">Submit</button>
          </form>
          <Link to={`/${this.props.otherPage}`}><h2>{this.props.otherPage} Here</h2></Link>
          <h3 className="problem">{this.state.status}</h3>
        </div>
      )
    }   
  }
}

export default Authenticate;