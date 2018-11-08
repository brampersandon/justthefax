const axios = require('axios')
const querystring = require('querystring')
const { ApolloServer, gql } = require('apollo-server');

const TWLO_SID = process.env.TWLO_SID || ''
const TWLO_KEY = process.env.TWLO_KEY || ''

const createClient = (sid, key) => {
    const ax =  axios.create({
        baseURL: 'https://fax.twilio.com',
        auth: {
            username: sid,
            password: key
        }
    })

    return {
        fetchFaxes: async () => ax.get('/v1/Faxes'),
        fetchFax: async  (faxSid) => 
            ax.get(`/v1/Faxes/${faxSid}`),
        sendFax: async (From, To, MediaUrl) =>
            ax.post('/v1/Faxes', querystring.stringify({From, To, MediaUrl}), { headers: {"content-type": "application/x-www-form-urlencoded"}})
    }
}

const client = createClient(TWLO_SID, TWLO_KEY)

const typeDefs = gql`

  type FaxLink {
      media: String
  }

  # Faxes
  type Fax {
    account_sid: String
    api_version: String
    date_created: String # should be Date
    date_updated: String # should be Date
    sid: String 
    url: String
    direction: String
    duration: Int
    from: String
    links: [FaxLink] 
    media_sid: String
    media_url: String
    num_pages: Int
    price: Float
    price_unit:  String
    quality: String 
    status: String
    to: String
  }

  type FaxMedia {
    account_sid: String
    api_version: String
    date_created: String # should be Date
    date_updated: String # should be Date
    sid: String 
    url: String
    content_type: String 
    fax_sid: String
  }

  type Query {
    getFaxes: [Fax]
    getFax(sid: String): Fax
  }

  type Mutation {
    sendFax(from: String, to: String, media_url: String): Fax
  }


`

const resolvers = {
  Query: {
    getFaxes: async () => {
        try {
            const res = await client.fetchFaxes()
            if (!res.data || !res.data.faxes) return []
            return res.data.faxes
        } catch (e) {
            console.log(e)
            return []
        }
    },
    getFax: async (_, {sid}) => {
        try {
            const res = await client.fetchFax(sid)
            if (!res.data) return null
            return res.data
        } catch (e) {
            console.log(e)
            return null
        }
    }
  },
  Mutation: {
      sendFax: async (_, {from, to, media_url}) => {
        try {
            const res = await client.sendFax(from, to, media_url)
            if (!res.data) return null
            return res.data
        } catch (e) {
            console.log(e)
            return null
        }
      }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});