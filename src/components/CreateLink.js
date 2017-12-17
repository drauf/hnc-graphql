import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_LINKS_QUERY } from './LinkList'
import { GC_USER_ID } from '../constants'

class CreateLink extends Component {

  state = {
    description: '',
    url: ''
  }

  render() {
    return (
      <div>
        <div className='flex flex-column mt3'>
          <input
            className='mb2'
            id='description'
            value={this.state.description}
            onChange={this._handleInputChange}
            type='text'
            placeholder='A description for the link'
          />
          <input
            className='mb2'
            id='url'
            value={this.state.url}
            onChange={this._handleInputChange}
            type='text'
            placeholder='The URL for the link'
          />
        </div>
        <button
          className='pointer button'
          onClick={this._createLink}
        >
          Submit
        </button>
      </div>
    )
  }

  _handleInputChange = ({ target }) => {
    this.setState({
      [target.id]: target.value
    })
  }

  _createLink = async () => {
    const postedById = localStorage.getItem(GC_USER_ID)
    if (!postedById) {
      console.error('No user logged in')
      return
    }

    const { description, url } = this.state
    await this.props.createLinkMutation({
      variables: {
        description,
        url,
        postedById
      },
      update: (store, { data: { createLink } }) => {
        const data = store.readQuery({ query: ALL_LINKS_QUERY })
        data.allLinks.splice(0, 0, createLink)
        store.writeQuery({
          query: ALL_LINKS_QUERY,
          data
        })
      }
    })
    this.props.history.push('/')
  }

}

const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($description: String!, $url: String!, $postedById: ID!) {
    createLink(
      description: $description,
      url: $url,
      postedById: $postedById
    ) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink)
