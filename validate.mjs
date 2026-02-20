import { ParliamentAPI, House } from './dist/index.mjs';

const api = new ParliamentAPI();
let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    const msg = `  ✗ ${name}${detail ? ': ' + detail : ''}`;
    console.log(msg);
    failures.push(msg);
  }
}

function hasKeys(obj, keys, prefix = '') {
  for (const key of keys) {
    if (!(key in obj)) {
      return `missing key "${prefix}${key}" — got keys: ${Object.keys(obj).join(', ')}`;
    }
  }
  return null;
}

// ─── Members API ───────────────────────────────────────────

console.log('\n=== Members API ===\n');

// search
const search = await api.members.search({ house: House.Commons, isCurrentMember: true, take: 2 });
check('search: paginated response', hasKeys(search, ['items', 'totalResults', 'skip', 'take']) === null, hasKeys(search, ['items', 'totalResults', 'skip', 'take']));
check('search: has items', search.items.length > 0);
const member = search.items[0].value;
const memberKeys = hasKeys(member, ['id', 'nameDisplayAs', 'nameListAs', 'nameFullTitle', 'nameAddressAs', 'latestParty', 'gender', 'latestHouseMembership', 'thumbnailUrl']);
check('search: member fields', memberKeys === null, memberKeys);
const partyKeys = hasKeys(member.latestParty, ['id', 'name', 'abbreviation', 'backgroundColour', 'foregroundColour', 'isIndependentParty']);
check('search: party fields', partyKeys === null, partyKeys);
const hmKeys = hasKeys(member.latestHouseMembership, ['membershipFrom', 'membershipFromId', 'house', 'membershipStartDate', 'membershipEndDate']);
check('search: houseMembership fields', hmKeys === null, hmKeys);

// getById
const byId = await api.members.getById(172);
check('getById: returns { value, links }', 'value' in byId && 'links' in byId);
check('getById: value.id matches', byId.value.id === 172);

// getBiography
const bio = await api.members.getBiography(172);
const bioKeys = hasKeys(bio.value, ['representations', 'electionsContested', 'houseMemberships', 'governmentPosts', 'oppositionPosts', 'otherPosts', 'partyAffiliations', 'committeeMemberships']);
check('getBiography: fields', bioKeys === null, bioKeys);
if (bio.value.governmentPosts?.length > 0) {
  const gpKeys = hasKeys(bio.value.governmentPosts[0], ['house', 'name', 'id', 'startDate']);
  check('getBiography: biography item fields', gpKeys === null, gpKeys);
}

// getContact
const contact = await api.members.getContact(172);
check('getContact: value is array', Array.isArray(contact.value));
if (contact.value.length > 0) {
  const cKeys = hasKeys(contact.value[0], ['type', 'typeDescription', 'typeId', 'isPreferred', 'isWebAddress', 'email', 'website']);
  check('getContact: contact fields', cKeys === null, cKeys);
}

// getFocus
const focus = await api.members.getFocus(172);
check('getFocus: value is array', Array.isArray(focus.value));
if (focus.value.length > 0) {
  check('getFocus: has category', typeof focus.value[0].category === 'string');
  check('getFocus: focus is array', Array.isArray(focus.value[0].focus));
}

// getLatestElectionResult
const election = await api.members.getLatestElectionResult(172);
const elKeys = hasKeys(election.value, ['result', 'isNotional', 'electorate', 'turnout', 'majority', 'winningParty', 'electionTitle', 'electionDate', 'electionId', 'isGeneralElection', 'constituencyName', 'candidates']);
check('getLatestElectionResult: fields', elKeys === null, elKeys);
if (election.value.candidates?.length > 0) {
  const candKeys = hasKeys(election.value.candidates[0], ['memberId', 'name', 'party', 'rankOrder', 'votes', 'voteShare']);
  check('getLatestElectionResult: candidate fields', candKeys === null, candKeys);
}

// getRegisteredInterests
const interests = await api.members.getRegisteredInterests(172);
check('getRegisteredInterests: value is array', Array.isArray(interests.value));
if (interests.value.length > 0) {
  const riKeys = hasKeys(interests.value[0], ['id', 'name', 'sortOrder', 'interests']);
  check('getRegisteredInterests: category fields', riKeys === null, riKeys);
  if (interests.value[0].interests?.length > 0) {
    const iKeys = hasKeys(interests.value[0].interests[0], ['id', 'interest', 'createdWhen', 'isCorrection', 'childInterests']);
    check('getRegisteredInterests: interest fields', iKeys === null, iKeys);
  }
}

// getExperience
const exp = await api.members.getExperience(172);
check('getExperience: value is array', Array.isArray(exp.value));

// getStaff
const staff = await api.members.getStaff(172);
check('getStaff: value is array', Array.isArray(staff.value));

// getSynopsis
const syn = await api.members.getSynopsis(172);
check('getSynopsis: value is string', typeof syn.value === 'string');

// getEdms
const edms = await api.members.getEdms(172, { take: 1 });
check('getEdms: paginated response', hasKeys(edms, ['items', 'totalResults']) === null);
if (edms.items.length > 0) {
  const edmKeys = hasKeys(edms.items[0].value, ['id', 'title', 'number', 'isPrayer', 'isAmendment', 'dateTabled', 'sponsorsCount']);
  check('getEdms: edm fields', edmKeys === null, edmKeys);
}

// getVoting — Parliament API currently returns 500 for this endpoint
try {
  const voting = await api.members.getVoting(172, { take: 1 });
  check('getVoting: paginated response', hasKeys(voting, ['items', 'totalResults']) === null);
} catch (e) {
  console.log('  ⚠ getVoting: skipped (Parliament API returns 500)');
}

// getWrittenQuestions
const wq = await api.members.getWrittenQuestions(172, { take: 1 });
check('getWrittenQuestions: paginated response', hasKeys(wq, ['items', 'totalResults']) === null);

// getPortraitUrl
const portrait = await api.members.getPortraitUrl(172);
check('getPortraitUrl: value is string', typeof portrait.value === 'string');

// getThumbnailUrl
const thumb = await api.members.getThumbnailUrl(172);
check('getThumbnailUrl: value is string', typeof thumb.value === 'string');

// getGovernmentPosts
const govPosts = await api.members.getGovernmentPosts();
check('getGovernmentPosts: returns array', Array.isArray(govPosts));
check('getGovernmentPosts: has items', govPosts.length > 0);
if (govPosts.length > 0) {
  check('getGovernmentPosts: item has value/links', 'value' in govPosts[0] && 'links' in govPosts[0]);
  const gpKeys = hasKeys(govPosts[0].value, ['type', 'name', 'hansardName', 'id', 'postHolders', 'governmentDepartments', 'createdWhen', 'order']);
  check('getGovernmentPosts: post fields', gpKeys === null, gpKeys);
}

// getOppositionPosts
const oppPosts = await api.members.getOppositionPosts();
check('getOppositionPosts: returns array', Array.isArray(oppPosts));
check('getOppositionPosts: has items', oppPosts.length > 0);

// getSpokespersons — skipped, Parliament API returns 400 regardless of params

// getActiveParties
const parties = await api.members.getActiveParties(House.Commons);
check('getActiveParties: paginated response', hasKeys(parties, ['items', 'totalResults']) === null, hasKeys(parties, ['items', 'totalResults']));
if (parties.items.length > 0) {
  const pKeys = hasKeys(parties.items[0].value, ['id', 'name', 'abbreviation', 'backgroundColour', 'foregroundColour', 'isIndependentParty']);
  check('getActiveParties: party fields', pKeys === null, pKeys);
}

// getStateOfTheParties
const stateOfParties = await api.members.getStateOfTheParties(House.Commons, '2025-01-01');
check('getStateOfTheParties: paginated response', hasKeys(stateOfParties, ['items', 'totalResults']) === null);
if (stateOfParties.items.length > 0) {
  const sopKeys = hasKeys(stateOfParties.items[0].value, ['party', 'male', 'female', 'nonBinary', 'total']);
  check('getStateOfTheParties: fields', sopKeys === null, sopKeys);
}

// searchConstituencies
const constits = await api.members.searchConstituencies({ searchText: 'Manchester', take: 1 });
check('searchConstituencies: paginated response', hasKeys(constits, ['items', 'totalResults']) === null);
if (constits.items.length > 0) {
  const cstKeys = hasKeys(constits.items[0].value, ['id', 'name', 'startDate', 'currentRepresentation']);
  check('searchConstituencies: fields', cstKeys === null, cstKeys);
}

// getConstituency
const constit = await api.members.getConstituency(3709);
check('getConstituency: has value', 'value' in constit);
const constitKeys = hasKeys(constit.value, ['id', 'name', 'startDate', 'currentRepresentation']);
check('getConstituency: fields', constitKeys === null, constitKeys);

// getConstituencyElectionResults
const constElec = await api.members.getConstituencyElectionResults(3709);
check('getConstituencyElectionResults: value is array', Array.isArray(constElec.value));

// ─── Questions API ─────────────────────────────────────────

console.log('\n=== Questions API ===\n');

// searchWrittenQuestions
const questions = await api.questions.searchWrittenQuestions({ askingMemberId: 172, take: 1 });
check('searchWrittenQuestions: has totalResults/results', hasKeys(questions, ['totalResults', 'results']) === null);
if (questions.results.length > 0) {
  const qKeys = hasKeys(questions.results[0].value, ['id', 'askingMemberId', 'house', 'dateTabled', 'uin', 'questionText', 'answeringBodyId', 'answeringBodyName', 'heading']);
  check('searchWrittenQuestions: question fields', qKeys === null, qKeys);
}

// getWrittenQuestion
if (questions.results.length > 0) {
  const qId = questions.results[0].value.id;
  const singleQ = await api.questions.getWrittenQuestion(qId);
  check('getWrittenQuestion: has value', 'value' in singleQ);
  check('getWrittenQuestion: id matches', singleQ.value.id === qId);
}

// searchWrittenStatements
const statements = await api.questions.searchWrittenStatements({ take: 1 });
check('searchWrittenStatements: has totalResults/results', hasKeys(statements, ['totalResults', 'results']) === null);
if (statements.results.length > 0) {
  const sKeys = hasKeys(statements.results[0].value, ['id', 'memberId', 'uin', 'dateMade', 'answeringBodyId', 'answeringBodyName', 'title', 'text', 'house']);
  check('searchWrittenStatements: statement fields', sKeys === null, sKeys);
}

// getWrittenStatement
if (statements.results.length > 0) {
  const sId = statements.results[0].value.id;
  const singleS = await api.questions.getWrittenStatement(sId);
  check('getWrittenStatement: has value', 'value' in singleS);
}

// getDailyReports
const reports = await api.questions.getDailyReports({ take: 1 });
check('getDailyReports: has totalResults/results', hasKeys(reports, ['totalResults', 'results']) === null);

// ─── Hansard API ───────────────────────────────────────────

console.log('\n=== Hansard API ===\n');

// search
const hansard = await api.hansard.search({ searchTerm: 'climate', take: 1 });
const hKeys = hasKeys(hansard, ['TotalMembers', 'TotalContributions', 'TotalWrittenStatements', 'TotalDebates', 'TotalDivisions', 'SearchTerms', 'Members', 'Contributions', 'Debates', 'Divisions']);
check('search: response fields', hKeys === null, hKeys);
if (hansard.Contributions.length > 0) {
  const contribKeys = hasKeys(hansard.Contributions[0], ['MemberName', 'MemberId', 'ItemId', 'ContributionText', 'SittingDate', 'House', 'DebateSection']);
  check('search: contribution fields', contribKeys === null, contribKeys);
}

// searchDebates
const debates = await api.hansard.searchDebates({ searchTerm: 'education', take: 1 });
check('searchDebates: has Results/TotalResultCount', hasKeys(debates, ['Results', 'TotalResultCount']) === null, hasKeys(debates, ['Results', 'TotalResultCount']));
check('searchDebates: has results', debates.Results.length > 0);
if (debates.Results.length > 0) {
  const debKeys = hasKeys(debates.Results[0], ['DebateSection', 'SittingDate', 'House', 'Title']);
  check('searchDebates: result fields', debKeys === null, debKeys);
}

// searchDivisions
const divisions = await api.hansard.searchDivisions({ searchTerm: 'tax', take: 1 });
check('searchDivisions: has Results/TotalResultCount', hasKeys(divisions, ['Results', 'TotalResultCount']) === null, hasKeys(divisions, ['Results', 'TotalResultCount']));

// ─── Summary ───────────────────────────────────────────────

console.log(`\n${'='.repeat(50)}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
if (failures.length > 0) {
  console.log(`\nFailures:`);
  failures.forEach(f => console.log(f));
}
console.log(`${'='.repeat(50)}\n`);

process.exit(failed > 0 ? 1 : 0);
