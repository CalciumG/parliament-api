// src/client.ts
import pLimit from "p-limit";
var DEFAULT_OPTIONS = {
  concurrency: 5,
  retries: 3,
  retryDelay: 1e3
};
var BaseClient = class {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.limit = pLimit(opts.concurrency);
    this.retries = opts.retries;
    this.retryDelay = opts.retryDelay;
  }
  limit;
  retries;
  retryDelay;
  async request(path, params) {
    return this.limit(() => this.fetchWithRetry(path, params));
  }
  async fetchWithRetry(path, params) {
    const base = this.baseUrl.endsWith("/") ? this.baseUrl : this.baseUrl + "/";
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(cleanPath, base);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== void 0 && value !== null) {
          if (Array.isArray(value)) {
            for (const v of value) {
              url.searchParams.append(key, String(v));
            }
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }
    let lastError;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url.toString(), {
          headers: { Accept: "application/json" }
        });
        if (response.status === 429 || response.status >= 500) {
          const retryAfter = response.headers.get("Retry-After");
          const delay = retryAfter ? parseInt(retryAfter, 10) * 1e3 : this.retryDelay * Math.pow(2, attempt);
          if (attempt < this.retries) {
            await this.sleep(delay);
            continue;
          }
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url.toString()}`);
        }
        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.retries) {
          await this.sleep(this.retryDelay * Math.pow(2, attempt));
          continue;
        }
      }
    }
    throw lastError ?? new Error(`Request failed after ${this.retries} retries`);
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

// src/members/index.ts
var BASE_URL = "https://members-api.parliament.uk/api/";
var MembersClient = class extends BaseClient {
  constructor(options) {
    super(BASE_URL, options);
  }
  // ─── Member Search ─────────────────────────────────────────
  async search(params) {
    return this.request("/Members/Search", params);
  }
  async searchHistorical(params) {
    return this.request("/Members/SearchHistorical", params);
  }
  /** Auto-paginating search that yields each page */
  async *searchAll(params) {
    let skip = params?.skip ?? 0;
    const take = params?.take ?? 20;
    while (true) {
      const page = await this.search({ ...params, skip, take });
      if (page.items.length === 0) break;
      yield page.items;
      skip += take;
      if (skip >= page.totalResults) break;
    }
  }
  // ─── Member Details ────────────────────────────────────────
  async getById(id) {
    return this.request(`/Members/${id}`);
  }
  async getBiography(id) {
    return this.request(`/Members/${id}/Biography`);
  }
  async getContact(id) {
    return this.request(`/Members/${id}/Contact`);
  }
  async getContributionSummary(id, params) {
    return this.request(`/Members/${id}/ContributionSummary`, params);
  }
  async getEdms(id, params) {
    return this.request(`/Members/${id}/Edms`, params);
  }
  async getExperience(id) {
    return this.request(`/Members/${id}/Experience`);
  }
  async getFocus(id) {
    return this.request(`/Members/${id}/Focus`);
  }
  async getLatestElectionResult(id) {
    return this.request(`/Members/${id}/LatestElectionResult`);
  }
  async getRegisteredInterests(id) {
    return this.request(`/Members/${id}/RegisteredInterests`);
  }
  async getStaff(id) {
    return this.request(`/Members/${id}/Staff`);
  }
  /** Returns the member's synopsis as an HTML string */
  async getSynopsis(id) {
    return this.request(`/Members/${id}/Synopsis`);
  }
  async getVoting(id, params) {
    return this.request(`/Members/${id}/Voting`, params);
  }
  async getWrittenQuestions(id, params) {
    return this.request(`/Members/${id}/WrittenQuestions`, params);
  }
  async getPortraitUrl(id) {
    return this.request(`/Members/${id}/PortraitUrl`);
  }
  async getThumbnailUrl(id) {
    return this.request(`/Members/${id}/ThumbnailUrl`);
  }
  // ─── Posts ─────────────────────────────────────────────────
  /** Returns an array of government posts (not paginated) */
  async getGovernmentPosts() {
    return this.request("/Posts/GovernmentPosts");
  }
  /** Returns an array of opposition posts (not paginated) */
  async getOppositionPosts() {
    return this.request("/Posts/OppositionPosts");
  }
  /** Returns an array of spokesperson posts (not paginated) */
  async getSpokespersons() {
    return this.request("/Posts/Spokespersons");
  }
  // ─── Parties ───────────────────────────────────────────────
  async getActiveParties(house) {
    return this.request(`/Parties/GetActive/${house}`);
  }
  async getStateOfTheParties(house, date) {
    return this.request(`/Parties/StateOfTheParties/${house}/${date}`);
  }
  // ─── Constituencies ────────────────────────────────────────
  async searchConstituencies(params) {
    return this.request("/Location/Constituency/Search", params);
  }
  async getConstituency(id) {
    return this.request(`/Location/Constituency/${id}`);
  }
  async getConstituencyElectionResults(id) {
    return this.request(`/Location/Constituency/${id}/ElectionResults`);
  }
};

// src/questions/types.ts
var AnsweredStatus = /* @__PURE__ */ ((AnsweredStatus2) => {
  AnsweredStatus2["Any"] = "Any";
  AnsweredStatus2["Answered"] = "Answered";
  AnsweredStatus2["Unanswered"] = "Unanswered";
  return AnsweredStatus2;
})(AnsweredStatus || {});

// src/questions/index.ts
var BASE_URL2 = "https://questions-statements-api.parliament.uk/api/";
var QuestionsClient = class extends BaseClient {
  constructor(options) {
    super(BASE_URL2, options);
  }
  // ─── Written Questions ─────────────────────────────────────
  async searchWrittenQuestions(params) {
    return this.request("/writtenquestions/questions", params);
  }
  async getWrittenQuestion(id) {
    return this.request(`/writtenquestions/questions/${id}`);
  }
  /** Auto-paginating search that yields each page */
  async *searchAllWrittenQuestions(params) {
    let skip = params?.skip ?? 0;
    const take = params?.take ?? 20;
    while (true) {
      const page = await this.searchWrittenQuestions({ ...params, skip, take });
      if (page.results.length === 0) break;
      yield page.results;
      skip += take;
      if (skip >= page.totalResults) break;
    }
  }
  // ─── Written Statements ────────────────────────────────────
  async searchWrittenStatements(params) {
    return this.request("/writtenstatements/statements", params);
  }
  async getWrittenStatement(id) {
    return this.request(`/writtenstatements/statements/${id}`);
  }
  /** Auto-paginating search that yields each page */
  async *searchAllWrittenStatements(params) {
    let skip = params?.skip ?? 0;
    const take = params?.take ?? 20;
    while (true) {
      const page = await this.searchWrittenStatements({ ...params, skip, take });
      if (page.results.length === 0) break;
      yield page.results;
      skip += take;
      if (skip >= page.totalResults) break;
    }
  }
  // ─── Daily Reports ─────────────────────────────────────────
  async getDailyReports(params) {
    return this.request("/dailyreports/dailyreports", params);
  }
};

// src/hansard/index.ts
var BASE_URL3 = "https://hansard-api.parliament.uk/";
var HansardClient = class extends BaseClient {
  constructor(options) {
    super(BASE_URL3, options);
  }
  // ─── Search ────────────────────────────────────────────────
  /** Full-text search across all Hansard content */
  async search(params) {
    return this.request("/search.json", params);
  }
  /** Search debates specifically — returns paginated results */
  async searchDebates(params) {
    return this.request("/search/debates.json", params);
  }
  /** Search divisions specifically — returns paginated results */
  async searchDivisions(params) {
    return this.request("/search/divisions.json", params);
  }
  /** Search members by name */
  async searchMembers(params) {
    return this.request("/search/members.json", params);
  }
  // ─── Debates ───────────────────────────────────────────────
  /** Get a full debate with all contributions */
  async getDebate(id) {
    return this.request(`/debates/debate/${id}.json`);
  }
  /** Get the speaker list for a debate */
  async getDebateSpeakers(id) {
    return this.request(`/debates/speakerslist/${id}.json`);
  }
  /** Get divisions within a debate */
  async getDebateDivisions(id) {
    return this.request(`/debates/divisions/${id}.json`);
  }
  /** Get a member's contributions within a debate */
  async getMemberDebateContributions(id) {
    return this.request(`/debates/memberdebatecontributions/${id}.json`);
  }
};

// src/types.ts
var House = /* @__PURE__ */ ((House2) => {
  House2[House2["Commons"] = 1] = "Commons";
  House2[House2["Lords"] = 2] = "Lords";
  return House2;
})(House || {});

// src/index.ts
var ParliamentAPI = class {
  members;
  questions;
  hansard;
  constructor(options) {
    this.members = new MembersClient(options);
    this.questions = new QuestionsClient(options);
    this.hansard = new HansardClient(options);
  }
};
export {
  AnsweredStatus,
  BaseClient,
  HansardClient,
  House,
  MembersClient,
  ParliamentAPI,
  QuestionsClient
};
//# sourceMappingURL=index.mjs.map