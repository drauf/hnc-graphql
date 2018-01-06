import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

class Search extends Component {

  state = {
    links: [],
    searchText: ''
  }

  render() {
    return (
      <div>
        <div>
          Search
          <input
            className='ml2'
            id='searchText'
            type='text'
            onChange={this._handleInputChange}
          />
          <button
            className='ml1'
            onClick={this._executeSearch}
          >
            OK
          </button>
        </div>
        {this.state.links.map((link, index) => <Link key={link.id} link={link} index={index} />)}
      </div>
    )
  }

  _handleInputChange = ({ target }) => {
    this.setState({
      [target.id]: target.value
    })
  }

  _executeSearch = async () => {
    // todo
  }
}

export default withApollo(Search)
