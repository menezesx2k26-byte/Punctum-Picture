declare module "cloudflare:workers" {
  // The test pool requires declaration merging with the generated Worker Env.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProvidedEnv extends Env {}
}

declare module "*.sql?raw" {
  const value: string;
  export default value;
}
