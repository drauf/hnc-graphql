import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'

class Login extends Component {

  state = {
    login: true, // switch between login and signup
    name: '',
    email: '',
    password: ''
  }

  render() {
    return (
      <div>
        <h4 className='mv3'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className='flex flex-column'>
          {!this.state.login &&
            <input
              id="name"
              value={this.state.name}
              onChange={this._handleChange}
              type='text'
              placeholder='Your name'
            />}
          <input
            id="email"
            value={this.state.email}
            onChange={this._handleChange}
            type='text'
            placeholder='Your email address'
          />
          <input
            id="password"
            value={this.state.password}
            onChange={this._handleChange}
            type='password'
            placeholder='Choose a safe password'
          />
        </div>
        <div className='flex mt3'>
          <div
            className='pointer mr2 button'
            onClick={this._confirm}
          >
            {this.state.login ? 'login' : 'create account'}
          </div>
          <div
            className='pointer button'
            onClick={this._changeMode}
          >
            {this.state.login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }

  _confirm = async () => {
  }

  _handleChange = ({target}) => {
    this.setState({
      [target.id]: target.value
    })
  }

  _changeMode = () => {
    this.setState({
      login: !this.state.login
    })
  }

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

}

export default Login
