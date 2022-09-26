import { URL, FOURHOURS } from './constants';
import {
  Word,
  ReqResponse,
  ReqData,
  signinResponse,
  UsersWordsResponse,
  UsrAggrWrdsReq,
  UsersAggrWordsResponse,
  UsersWordData,
  Statistics,
  Settings,
  TUser,
  TAuth,
  TUserAuth,
  METHOD,
} from './types/index';

class Api {
  private token = localStorage.getItem('refreshToken')?.slice(1, -1) || ''; // JWT token for requests with authorization

  private userId = localStorage.getItem('userId')?.slice(1, -1) || ''; // user id like '62ffed00299cea0016064168'

  private expire = 0; // token expiration time

  // common request
  // req: ReqData - {url: str, method: 'GET' etc, auth?: bool, body?: str}
  // T: type of result
  // return: [T, null] | [null, Error]
  private async request<T>(req: ReqData): Promise<ReqResponse<T>> {
    const headers: HeadersInit = { Accept: 'application/json' };
    if (req.auth) {
      if (Math.floor(Date.now() / 1000) - this.expire > FOURHOURS) {
        await this.getNewToken(this.userId, this.token);
      }
      headers.Authorization = `Bearer ${this.token}`;
    }
    if (req.body) headers['Content-Type'] = 'application/json';
    const { method } = req;
    const options: RequestInit = { headers, method };
    if (req.body) options.body = req.body;
    try {
      const response = await fetch(req.url, options);
      if (response.status === 204) {
        return [null, null];
      }
      if (response.status === 200) {
        const data = await response.json();
        return [data, null];
      }
      throw (new Error(`(${response.status}) ${response.statusText}`));
    } catch (error: unknown) {
      return [null, error];
    }
  }

  // ===== Words requests =====

  // get word list
  // group: 0..5 -- difficulty group
  // page: 0..29 -- 30 pages in each group
  // return: [Word[20], null] | [null, Error]
  async getWords(group = 0, page = 0): Promise<ReqResponse<Array<Word>>> {
    const url = `${URL}words?page=${page}&group=${group}`;
    const method = METHOD.GET;
    const result = await this.request<Array<Word>>({ url, method });
    return result;
  }

  // get word by id
  // id: word id like '5e9f5ee35eb9e72bc21af4a0'
  // return: [Word, null] | [null, Error]
  async getWord(id: string): Promise<ReqResponse<Word>> {
    const url = `${URL}words/${id}`;
    const method = METHOD.GET;
    const result = await this.request<Word>({ url, method });
    return result;
  }

  // ===== Users/Words requests =====

  // get all user words
  // return: [Word[], null] | [null, Error]
  async getUsersWords(): Promise<ReqResponse<Array<UsersWordsResponse>>> {
    const url = `${URL}users/${this.userId}/words`;
    const method = METHOD.GET;
    const auth = true;
    const result = await this.request<Array<UsersWordsResponse>>({ url, method, auth });
    return result;
  }

  // add word to user words
  // wordId: word id like '5e9f5ee35eb9e72bc21af4a0'
  // difficulty: word difficulty like 'hard', 'weak' etc
  // optional: object with additional caustom data // TODO: need to describe
  // return: [Word[], null] | [null, Error]
  // Errors:
  // 400 - Bad request
  // 401 - Access token is missing or invalid
  // 417 - such user word already exists
  async postUsersWord(wordId: string, wordData: UsersWordData): Promise<ReqResponse<string>> {
    const url = `${URL}users/${this.userId}/words/${wordId}`;
    const method = METHOD.POST;
    const auth = true;
    const body = JSON.stringify(wordData);
    const result = await this.request<string>({
      url, method, auth, body,
    });
    return result;
  }

  // get a user word by id
  // id: user id like '62ffed00299cea0016064168'
  // wordId: word id like '5e9f5ee35eb9e72bc21af4a0'
  // return:
  // return: [usersWordsResponse, null] | [null, Error]
  async getUsersWordById(wordId: string): Promise<ReqResponse<UsersWordsResponse>> {
    const url = `${URL}users/${this.userId}/words/${wordId}`;
    const method = METHOD.GET;
    const auth = true;
    const result = await this.request<UsersWordsResponse>({
      url, method, auth,
    });
    return result;
  }

  // update word in user words
  // wordId: word id like '5e9f5ee35eb9e72bc21af4a0'
  // difficulty: word difficulty like 'hard', 'weak' etc
  // optional: UsersWordData
  // return: [usersWordsResponse, null] | [null, Error]
  // Errors:
  // 400 - Bad request
  // 401 - Access token is missing or invalid
  async updateUsersWord(
    wordId: string,
    wordData: UsersWordData,
  ):
    Promise<ReqResponse<UsersWordsResponse>> {
    const url = `${URL}users/${this.userId}/words/${wordId}`;
    const method = METHOD.PUT;
    const auth = true;
    const body = JSON.stringify(wordData);
    const result = await this.request<UsersWordsResponse>({
      url, method, auth, body,
    });
    return result;
  }

  // delete word from user words
  // wordId: word id like '5e9f5ee35eb9e72bc21af4a0'
  // return: [null, null] | [null, Error]
  // Errors:
  // 401 - Access token is missing or invalid
  async deleteUsersWord(wordId: string): Promise<ReqResponse<null>> {
    const url = `${URL}users/${this.userId}/words/${wordId}`;
    const method = METHOD.DELETE;
    const auth = true;
    const result = await this.request<null>({
      url, method, auth,
    });
    return result;
  }

  // ===== Users/AggregatedWords requests =====

  // gets all user aggregated word
  // params: UsrAggrWrdsReq
  // === about UsrAggrWrdsReq.filter:
  // Filter by aggreagted word fields.
  // It should be a stringified object which meet MongoDB Query object conditions.
  // Get all words that have difficulte="hard AND optional.key="value
  // {"$and":[{"userWord.difficulty":"hard", "userWord.optional.key":"value"}]}
  // Get all words that have difficulty equal="easy" OR do not have the linked userWord
  // {"$or":[{"userWord.difficulty":"easy"},{"userWord":null}]}
  // Get all words that have BOTH
  // difficulty equal = "easy" AND optional.repeat = true, OR do not have the linked userWord
  // {"$or":[{"$and":[{"userWord.difficulty":"easy", "userWord.optional.repeat":true}]}
  // ,{ "userWord": null }]}
  // ===
  // return: [UsersAggrWordsResponse, null] | [null, Error]
  async getUsrAggrWords(params: UsrAggrWrdsReq): Promise<ReqResponse<UsersAggrWordsResponse>> {
    const {
      group, page, wordsPerPage, filter,
    } = params;
    let url = `${URL}users/${this.userId}/aggregatedWords?wordsPerPage=${wordsPerPage}&filter=${filter}`;
    if (group) url = `${url}&group=${group}`;
    if (page) url = `${url}&page=${page}`;
    url = encodeURI(url);
    const method = METHOD.GET;
    const auth = true;
    const result = await this.request<UsersAggrWordsResponse>({
      url, method, auth,
    });
    return result;
  }

  // gets a user aggregated word by id
  // wordId: word id like '5e9f5ee35eb9e72bc21af4a0'
  // return: [UsersWordData, null] | [null, Error]
  async getUsrAggrWordById(wordId: string): Promise<ReqResponse<UsersWordData>> {
    const url = `${URL}users/${this.userId}/aggregatedWords/${wordId}`;
    const method = METHOD.GET;
    const auth = true;
    const result = await this.request<UsersWordData>({
      url, method, auth,
    });
    return result;
  }

  // ===== Users Statistics requests =====

  // Gets statistics
  // return: [Statistics, null] | [null, Error]
  async getUsersStats(): Promise<ReqResponse<Statistics>> {
    const url = `${URL}users/${this.userId}/statistics`;
    const method = METHOD.GET;
    const auth = true;
    const result = await this.request<Statistics>({
      url, method, auth,
    });
    return result;
  }

  // Upserts new statistics
  // stat: Statistics <- { "learnedWords": number, "optional": {} }
  // return: [Statistics, null] | [null, Error]
  async updateUsersStats(stat: Statistics): Promise<ReqResponse<Statistics>> {
    console.log(stat);
    const url = `${URL}users/${this.userId}/statistics`;
    const method = METHOD.PUT;
    const auth = true;
    const body = JSON.stringify(stat);
    const result = await this.request<Statistics>({
      url, method, auth, body,
    });
    return result;
  }

  // ===== Users Settings requests =====

  // Gets settings
  // return: [Settings, null] | [null, Error]
  async getUsersSettings(): Promise<ReqResponse<Settings>> {
    const url = `${URL}users/${this.userId}/settings`;
    const method = METHOD.GET;
    const auth = true;
    const result = await this.request<Settings>({
      url, method, auth,
    });
    return result;
  }

  // Upserts settings
  // stat: Statistics <- { "wordsPerDay": number, "optional": {} }
  // return: [Settings, null] | [null, Error]
  async updateUsersSettings(data: Settings): Promise<ReqResponse<Settings>> {
    const url = `${URL}users/${this.userId}/settings`;
    const method = METHOD.PUT;
    const auth = true;
    const body = JSON.stringify(data);
    const result = await this.request<Settings>({
      url, method, auth, body,
    });
    return result;
  }

  // ===== Sign In request =====

  // sign in
  // email, password: string
  // return: [signinResponse, null] | [null, Error]
  async signin(email: string, password: string): Promise<ReqResponse<signinResponse>> {
    const url = `${URL}signin`;
    const method = METHOD.POST;
    const body = JSON.stringify({ email, password });
    const result = await this.request<signinResponse>({ url, method, body });
    if (result[0]) {
      this.setExpire(Date.now());
      this.setToken(result[0].token);
      this.setUserId(result[0].userId);
    }
    return result;
  }

  // ===== Setters =====

  // this.token setter
  setToken(token: string): void {
    this.token = token;
  }

  // this.userId setter
  setUserId(id: string): void {
    this.userId = id;
  }

  // this.expire setter
  setExpire(dt: number): void {
    this.expire = Math.floor(dt / 1000); // ms to seconds
  }

  async getUser(user: TAuth): Promise<TUserAuth> {
    try {
      const { userId, token } = user;
      const rawResponse = await fetch(`${URL}users/${userId}`, {
        method: METHOD.GET,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const content = await rawResponse.json();
      return content;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async createUser(user: TUser): Promise<ReqResponse<TUserAuth>> {
    const url = `${URL}users`;
    const method = METHOD.POST;
    const body = JSON.stringify(user);
    const result = await this.request<TUserAuth>({ url, method, body });
    return result;
  }

  async getNewToken(userId?: string, refreshToken?: string): Promise<void> {
    try {
      const rawResponse = await fetch(`${URL}users/${userId}/tokens`, {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          Accept: 'application/json',
        },
      });
      const content = await rawResponse.json();
      if (rawResponse.ok) {
        this.setExpire(Date.now());
        this.setToken(content.token);
      }
      localStorage.setItem('token', JSON.stringify(content.token));
      localStorage.setItem('refreshToken', JSON.stringify(content.refreshToken));
      // TODO: move localStorage.setItem to upper level
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export default Api;
