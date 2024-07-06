export enum HttpMethod {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
}

export interface Endpoint {
  readonly path: string;
  readonly verb: HttpMethod;
  readonly name?: string;
}

export interface EndpointGroup {
  readonly prefix: string;
  readonly endpoints: Array<Endpoint>;
}

export interface Request {
  id?: string | number;
  language?: string;
  requestToken?: string;
}

export interface Response {}

export interface AuthenticationToken extends Response {
  success?: boolean;
  expiresAt?: string;
  requestToken?: string;
}

export interface RequestParams {
  id?: string | number;
  language?: string;
}

export interface SessionRequestParams extends RequestParams {
  requestToken: string;
}

export interface SessionResponse extends Response {
  sessionId?: string;
}

export interface RequestOptions {
  appendToResponse?: string;
  timeout?: number;
}

export interface Genre {
  id?: number;
  name?: string;
}

export interface ProductionCompany {
  name?: string;
  id?: number;
  logoPath?: string;
  originCountry?: string;
}

export interface ProductionCountry {
  name?: string;
  iso31661?: string;
}

export interface SpokenLanguage {
  iso6391?: string;
  name?: string;
}
