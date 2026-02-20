# parliament-api

Typed TypeScript client for the UK Parliament APIs.

Covers three public APIs:
- **Members API** — MPs, Lords, parties, constituencies
- **Questions & Statements API** — Written questions, written statements, daily reports
- **Hansard API** — Debates, divisions, contributions, search

## Install

```bash
npm install parliament-api
```

Requires Node.js 18+ (uses native `fetch`).

## Usage

```typescript
import { ParliamentAPI, House } from 'parliament-api';

const api = new ParliamentAPI();

// Search current MPs
const mps = await api.members.search({ house: House.Commons, isCurrentMember: true });

// Get a specific member
const member = await api.members.getById(4514);
console.log(member.value.nameDisplayAs); // "Sir Keir Starmer"

// Search written questions
const questions = await api.questions.searchWrittenQuestions({
  askingMemberId: 4514,
  tabledWhenFrom: '2025-01-01',
});
console.log(questions.totalResults);
console.log(questions.results[0].value.heading);

// Search Hansard
const hansard = await api.hansard.search({
  searchTerm: 'climate change',
  house: 'Commons',
});
console.log(hansard.TotalContributions);

// Auto-paginate through all results
for await (const page of api.members.searchAll({ house: House.Commons, isCurrentMember: true })) {
  for (const mp of page) {
    console.log(mp.value.nameDisplayAs);
  }
}
```

## Configuration

```typescript
const api = new ParliamentAPI({
  concurrency: 10,  // max concurrent requests (default: 5)
  retries: 5,       // retry attempts on 429/5xx (default: 3)
  retryDelay: 2000, // base delay in ms for backoff (default: 1000)
});
```

You can also use individual clients directly:

```typescript
import { MembersClient, QuestionsClient, HansardClient } from 'parliament-api';

const members = new MembersClient({ concurrency: 10 });
const questions = new QuestionsClient();
const hansard = new HansardClient();
```

## API Reference

### `api.members`

| Method | Description |
|---|---|
| `search(params)` | Search current MPs/Lords |
| `searchHistorical(params)` | Search former members |
| `searchAll(params)` | Auto-paginating search (async generator) |
| `getById(id)` | Single member details |
| `getBiography(id)` | Career history, posts, committees |
| `getContact(id)` | Contact details |
| `getContributionSummary(id, params)` | Activity breakdown |
| `getEdms(id, params)` | Early Day Motions |
| `getExperience(id)` | Member experience |
| `getFocus(id)` | Policy interest areas |
| `getLatestElectionResult(id)` | Election result + majority |
| `getRegisteredInterests(id)` | Financial interests |
| `getStaff(id)` | Staff list |
| `getSynopsis(id)` | Member synopsis |
| `getVoting(id, params)` | Voting record |
| `getWrittenQuestions(id, params)` | Written questions |
| `getPortraitUrl(id)` | Portrait image URL |
| `getThumbnailUrl(id)` | Thumbnail image URL |
| `getGovernmentPosts()` | Government posts + holders |
| `getOppositionPosts()` | Opposition posts + holders |
| `getSpokespersons()` | Spokespersons |
| `getActiveParties(house)` | Active parties |
| `getStateOfTheParties(house, date)` | Party seat counts |
| `searchConstituencies(params)` | Search constituencies |
| `getConstituency(id)` | Constituency details |
| `getConstituencyElectionResults(id)` | Election results |

### `api.questions`

| Method | Description |
|---|---|
| `searchWrittenQuestions(params)` | Search written questions |
| `searchAllWrittenQuestions(params)` | Auto-paginating search (async generator) |
| `getWrittenQuestion(id)` | Single written question |
| `searchWrittenStatements(params)` | Search written statements |
| `searchAllWrittenStatements(params)` | Auto-paginating search (async generator) |
| `getWrittenStatement(id)` | Single written statement |
| `getDailyReports(params)` | Daily report listings |

### `api.hansard`

| Method | Description |
|---|---|
| `search(params)` | Full-text search across Hansard |
| `searchDebates(params)` | Search debates (paginated) |
| `searchDivisions(params)` | Search divisions (paginated) |
| `searchMembers(params)` | Search members |
| `getDebate(id)` | Full debate with contributions |
| `getDebateSpeakers(id)` | Speaker list for debate |
| `getDebateDivisions(id)` | Divisions in debate |
| `getMemberDebateContributions(id)` | Member's debate contributions |

## Response shapes

The Members API and Questions API wrap responses differently:

```typescript
// Members API: items in PaginatedResponse
const mps = await api.members.search({ house: House.Commons });
mps.items       // MemberApiItem<Member>[]
mps.totalResults // number

// Questions API: results in QuestionsApiResponse
const qs = await api.questions.searchWrittenQuestions({ askingMemberId: 4514 });
qs.results      // MemberApiItem<WrittenQuestion>[]
qs.totalResults // number

// Individual items are wrapped in { value, links }
const member = await api.members.getById(4514);
member.value // Member
member.links // Link[]

// Hansard API: flat response with PascalCase fields
const h = await api.hansard.search({ searchTerm: 'climate' });
h.TotalContributions // number
h.Contributions      // HansardContribution[]
h.Debates            // HansardDebateSummary[]
```

## License

MIT
