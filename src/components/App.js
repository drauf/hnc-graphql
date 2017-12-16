import React, { Component } from 'react'
import CreateLink from './CreateLink'
import LinkList from './LinkList'

class App extends Component {

  render() {
    return (
      <div>
        <CreateLink />
        <LinkList />
      </div>
    )
  }

}

export default App
