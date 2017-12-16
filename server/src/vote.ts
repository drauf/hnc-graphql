import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface Vote {
  id: string
}

interface EventData {
  linkId: string
}

export default async (event: FunctionEvent<EventData>) => {
  console.log(event)

  try {
    // no logged in user
    if (!event.context.auth || !event.context.auth.nodeId) {
      return { data: null }
    }

    const userId = event.context.auth.nodeId
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { linkId } = event.data

    // check if user already voted for selected link
    const vote: Vote = await getVote(api, linkId, userId)
      .then(r => r.Vote)

    if (vote && vote.id) {
      return { data: null }
    }

    // create new vote
    const createdVote: Vote = await submitVote(api, linkId, userId)
      .then(r => r.Vote)

    return { data: { id: createdVote.id } }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured during submitting a vote.' }
  }
}

async function getVote(api: GraphQLClient, linkId: string, userId: string): Promise<{ Vote }> {
  const query = `
    query getVote($linkId: ID!, $userId: ID!) {
      allVotes(
        first: 1,
        filter: {
          link: { id: $linkId },
          user: { id: $userId }
      }) {
        id
      }
    }
  `

  const variables = {
    linkId,
    userId
  }

  return api.request<{ Vote }>(query, variables)
}

async function submitVote(api: GraphQLClient, linkId: string, userId: string): Promise<{ Vote }> {
  const query = `
    mutation submitVote($linkId: ID!, $userId: ID!) {
      createVote(linkId: $linkId, userId: $userId) {
        id
      }
    }
  `

  const variables = {
    linkId,
    userId
  }

  return api.request<{ Vote }>(query, variables)
}
