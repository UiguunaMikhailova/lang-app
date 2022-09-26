import { METHOD } from './enums';

interface ReqData {
  url: string,
  method: METHOD,
  auth?: boolean,
  body?: string
}

interface UsrAggrWrdsReq {
  group?: string;
  page?: string;
  wordsPerPage?: string;
  filter?: string;
}

export { ReqData, UsrAggrWrdsReq };
