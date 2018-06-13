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
      userIsAuthenticated: false,
    };
    this.handleUserNameInput = this.handleUserNameInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    console.log('submitted');
    e.preventDefault();
    var credentials = {
      username: this.state.username,
      password: this.state.password,
    }
    axios.post(`/${this.props.thisPage}`, credentials)
    .then(res => {
      console.log('res.data is', res.data, 'res.status is', res.status);
      if (res.status === 202) {
        this.setState({
          status: res.data,
        })
      } else if (res.status === 201) {
        this.setState({
          userIsAuthenticated: true,
        })
      }
    }).catch(err => {
      console.error(err);
    })
  }

  render() {
    if (this.state.userIsAuthenticated) {
      return <Redirect to="/matchMe" />
    } else {
      return (
        <div className="authentication-page">
          <h1>{this.props.thisPage}</h1>
          <form onSubmit={this.handleSubmit}>
            <input placeholder="username" value={this.state.username} onChange={this.handleUserNameInput} />
            <input placeholder="password" value={this.state.password} onChange={this.handlePasswordInput} />
            <button>Submit</button>
          </form>
          <Link to={`/${this.props.otherPage}`}>{this.props.otherPage} Here</Link>
          <h2 className="problem">{this.state.status}</h2>
        </div>
      )
    }   
  }
}

export default Authenticate;