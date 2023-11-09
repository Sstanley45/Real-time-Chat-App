import { Client, Databases, Account } from "appwrite";



//client
const client = new Client();
//account(auth)
export const account = new Account(client);
//database
export const databases = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_PROJECT_ID);

export default client;
