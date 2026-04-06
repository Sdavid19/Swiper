import * as streamingAvailability from "streaming-availability"

const client = new streamingAvailability.Client(
  new streamingAvailability.Configuration({
    apiKey: process.env.RAPID_API_KEY
  })
)

export default client;