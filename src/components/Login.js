import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
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
            onClick={this._submit}
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

  _handleChange = ({ target }) => {
    this.setState({
      [target.id]: target.value
    })
  }

  _changeMode = () => {
    this.setState({
      login: !this.state.login
    })
  }

  _submit = async () => {
    if (this.state.login) {
      await this._authenticateUser()
    } else {
      await this._signupUser()
    }
    this.props.history.push('/')
  }

  _authenticateUser = async () => {
    const { email, password } = this.state
    const result = await this.props.authenticateUserMutation({
      variables: {
        email,
        password
      }
    })
    const { id, token } = result.data.authenticateUser
    this._saveUserData(id, token)
  }

  _signupUser = async () => {
    const { name, email, password } = this.state
    const result = await this.props.signupUserMutation({
      variables: {
        name,
        email,
        password
      }
    })
    const { id, token } = result.data.signupUser
    this._saveUserData(id, token)
  }

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation($email: String!, $password: String!, $name: String!) {
    signupUser(
      email: $email,
      password: $password,
      name: $name
    ) {
      id
      token
    }
  }
`

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUser(
      email: $email,
      password: $password
    ) {
      id
      token
    }
  }
`

export default compose(
  graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' }),
  graphql(AUTHENTICATE_USER_MUTATION, { name: 'authenticateUserMutation' })
)(Login)
