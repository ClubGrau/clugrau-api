export interface TokenDecoderPort<T extends object> {
  decode(token: string): T;
}
