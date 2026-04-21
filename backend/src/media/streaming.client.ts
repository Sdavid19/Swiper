import { Client, Configuration } from 'streaming-availability';

const client = new Client(
  new Configuration({
    apiKey: process.env.RAPID_API_KEY,
  }),
);

export default client;
