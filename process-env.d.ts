declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      MONGO: string;
      ENDPOIN: string;
      SUBSCRIPTION_KEY: string;
      // add more environment variables and their types here
    }
  }
}
