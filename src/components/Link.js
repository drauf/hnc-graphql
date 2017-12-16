import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'
import { GC_USER_ID } from '../constants'

class Link extends Component {

  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    return (
      <div className='flex mt2 items-start'>
        <div className='flex items-center'>
          <span className='gray'>{this.props.index + 1}.</span>
          {userId && <div className='ml1 gray f11' onClick={this._voteForLink}>▲</div>}
        </div>
        <div className='ml1'>
          <div>
            {this.props.link.description}
            <span className='ml1 gray f11'>({this.props.link.url})</span>
          </div>
          <div className='f6 lh-copy gray'>{this._getFootnoteText()}</div>
        </div>
      </div>
    )
  }

  _getFootnoteText = () => {
    return (
      this.props.link.votes.length
      + ' votes by '
      + (this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown')
      + ' '
      + moment(this.props.link.createdAt).fromNow()
    )
  }

  _voteForLink = async () => {
    const userId = localStorage.getItem(GC_USER_ID)
    const voterIds = this.props.link.votes.map(vote => vote.user.id)
    if (voterIds.includes(userId)) {
      console.log(`User (${userId}) already voted for this link.`)
      return
    }

    const linkId = this.props.link.id
    await this.props.voteMutation({
      variables: {
        linkId
      }
    })
  }

}

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
    }
  }
`

export default graphql(VOTE_MUTATION, { name: 'voteMutation' })(Link)
