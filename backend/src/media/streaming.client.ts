import { Configuration, Client } from 'streaming-availability';


export function createStreamingClient() {
  const apiKey = process.env.RAPID_API_KEY;

  if (!apiKey) {
    return null;
  }

  const config = new Configuration({
    apiKey,
  });

  return new Client(config);
}