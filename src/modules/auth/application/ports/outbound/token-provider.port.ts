export interface TokenProviderPort<T extends object> {
  generateToken(payload: T): Promise<string>;
}
