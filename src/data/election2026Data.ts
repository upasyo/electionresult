/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SenateRace, HouseDistrict, GovernorRace, NewsArticle, TimelineEvent, NationalOverview } from '../types/election';

export interface StateMetadata {
  abbr: string;
  name: string;
  pollCloseTimeET: string;
  hasSenateRace2026: boolean;
  hasGovernorRace2026: boolean;
  houseDistrictsCount: number;
}

export const US_STATES_METADATA: Record<string, StateMetadata> = {
  AL: { abbr: 'AL', name: 'Alabama', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 7 },
  AK: { abbr: 'AK', name: 'Alaska', pollCloseTimeET: '00:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 1 },
  AZ: { abbr: 'AZ', name: 'Arizona', pollCloseTimeET: '21:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 9 },
  AR: { abbr: 'AR', name: 'Arkansas', pollCloseTimeET: '20:30 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 4 },
  CA: { abbr: 'CA', name: 'California', pollCloseTimeET: '23:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 52 },
  CO: { abbr: 'CO', name: 'Colorado', pollCloseTimeET: '21:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 8 },
  CT: { abbr: 'CT', name: 'Connecticut', pollCloseTimeET: '20:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 5 },
  DE: { abbr: 'DE', name: 'Delaware', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 1 },
  FL: { abbr: 'FL', name: 'Florida', pollCloseTimeET: '19:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 28 },
  GA: { abbr: 'GA', name: 'Georgia', pollCloseTimeET: '19:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 14 },
  HI: { abbr: 'HI', name: 'Hawaii', pollCloseTimeET: '00:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 2 },
  ID: { abbr: 'ID', name: 'Idaho', pollCloseTimeET: '22:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 2 },
  IL: { abbr: 'IL', name: 'Illinois', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 17 },
  IN: { abbr: 'IN', name: 'Indiana', pollCloseTimeET: '18:00 ET', hasSenateRace2026: false, hasGovernorRace2026: false, houseDistrictsCount: 9 },
  IA: { abbr: 'IA', name: 'Iowa', pollCloseTimeET: '21:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 4 },
  KS: { abbr: 'KS', name: 'Kansas', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 4 },
  KY: { abbr: 'KY', name: 'Kentucky', pollCloseTimeET: '18:00 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 6 },
  LA: { abbr: 'LA', name: 'Louisiana', pollCloseTimeET: '21:00 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 6 },
  ME: { abbr: 'ME', name: 'Maine', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 2 },
  MD: { abbr: 'MD', name: 'Maryland', pollCloseTimeET: '20:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 8 },
  MA: { abbr: 'MA', name: 'Massachusetts', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 9 },
  MI: { abbr: 'MI', name: 'Michigan', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 13 },
  MN: { abbr: 'MN', name: 'Minnesota', pollCloseTimeET: '21:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 8 },
  MS: { abbr: 'MS', name: 'Mississippi', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 4 },
  MO: { abbr: 'MO', name: 'Missouri', pollCloseTimeET: '20:00 ET', hasSenateRace2026: false, hasGovernorRace2026: false, houseDistrictsCount: 8 },
  MT: { abbr: 'MT', name: 'Montana', pollCloseTimeET: '22:00 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 2 },
  NE: { abbr: 'NE', name: 'Nebraska', pollCloseTimeET: '21:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 3 },
  NV: { abbr: 'NV', name: 'Nevada', pollCloseTimeET: '22:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 4 },
  NH: { abbr: 'NH', name: 'New Hampshire', pollCloseTimeET: '19:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 2 },
  NJ: { abbr: 'NJ', name: 'New Jersey', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 12 },
  NM: { abbr: 'NM', name: 'New Mexico', pollCloseTimeET: '21:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 3 },
  NY: { abbr: 'NY', name: 'New York', pollCloseTimeET: '21:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 26 },
  NC: { abbr: 'NC', name: 'North Carolina', pollCloseTimeET: '19:30 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 14 },
  ND: { abbr: 'ND', name: 'North Dakota', pollCloseTimeET: '20:00 ET', hasSenateRace2026: false, hasGovernorRace2026: false, houseDistrictsCount: 1 },
  OH: { abbr: 'OH', name: 'Ohio', pollCloseTimeET: '19:30 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 15 },
  OK: { abbr: 'OK', name: 'Oklahoma', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 5 },
  OR: { abbr: 'OR', name: 'Oregon', pollCloseTimeET: '23:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 6 },
  PA: { abbr: 'PA', name: 'Pennsylvania', pollCloseTimeET: '20:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 17 },
  RI: { abbr: 'RI', name: 'Rhode Island', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 2 },
  SC: { abbr: 'SC', name: 'South Carolina', pollCloseTimeET: '19:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 7 },
  SD: { abbr: 'SD', name: 'South Dakota', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 1 },
  TN: { abbr: 'TN', name: 'Tennessee', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 9 },
  TX: { abbr: 'TX', name: 'Texas', pollCloseTimeET: '20:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 38 },
  UT: { abbr: 'UT', name: 'Utah', pollCloseTimeET: '22:00 ET', hasSenateRace2026: false, hasGovernorRace2026: false, houseDistrictsCount: 4 },
  VT: { abbr: 'VT', name: 'Vermont', pollCloseTimeET: '19:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 1 },
  VA: { abbr: 'VA', name: 'Virginia', pollCloseTimeET: '19:00 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 11 },
  WA: { abbr: 'WA', name: 'Washington', pollCloseTimeET: '23:00 ET', hasSenateRace2026: false, hasGovernorRace2026: false, houseDistrictsCount: 10 },
  WV: { abbr: 'WV', name: 'West Virginia', pollCloseTimeET: '19:30 ET', hasSenateRace2026: true, hasGovernorRace2026: false, houseDistrictsCount: 2 },
  WI: { abbr: 'WI', name: 'Wisconsin', pollCloseTimeET: '21:00 ET', hasSenateRace2026: false, hasGovernorRace2026: true, houseDistrictsCount: 8 },
  WY: { abbr: 'WY', name: 'Wyoming', pollCloseTimeET: '21:00 ET', hasSenateRace2026: true, hasGovernorRace2026: true, houseDistrictsCount: 1 },
  DC: { abbr: 'DC', name: 'District of Columbia', pollCloseTimeET: '20:00 ET', hasSenateRace2026: false, hasGovernorRace2026: false, houseDistrictsCount: 1 },
};

// Base 2026 Senate Races (Class 2 + specials)
export const INITIAL_SENATE_RACES: SenateRace[] = [
  {
    id: 'SEN-GA',
    state: 'GA',
    stateName: 'Georgia',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: true,
    isCertified: false,
    pollCloseTimeET: '19:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Decision Desk HQ / State Election Division',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ga-1', name: 'Jon Ossoff', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ga-2', name: 'Chris Carr', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'c-ga-3', name: 'Chase Oliver', party: 'LIB', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-NC',
    state: 'NC',
    stateName: 'North Carolina',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: true,
    isCertified: false,
    pollCloseTimeET: '19:30 ET',
    previousHolderParty: 'REP',
    dataSource: 'State Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-nc-1', name: 'Thom Tillis', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-nc-2', name: 'Roy Cooper', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'c-nc-3', name: 'Shannon Bray', party: 'LIB', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-ME',
    state: 'ME',
    stateName: 'Maine',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: true,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Maine Bureau of Corporations, Elections and Commissions',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-me-1', name: 'Susan Collins', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-me-2', name: 'Jared Golden', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'c-me-3', name: 'Tiffany Bond', party: 'IND', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-MI',
    state: 'MI',
    stateName: 'Michigan',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: true,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Michigan Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-mi-1', name: 'Gary Peters', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-mi-2', name: 'John James', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-TX',
    state: 'TX',
    stateName: 'Texas',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: true,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Texas Secretary of State Election Division',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-tx-1', name: 'John Cornyn', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-tx-2', name: 'Colin Allred', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-NH',
    state: 'NH',
    stateName: 'New Hampshire',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: true,
    isCertified: false,
    pollCloseTimeET: '19:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'New Hampshire Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-nh-1', name: 'Jeanne Shaheen', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-nh-2', name: 'Chris Sununu', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-IA',
    state: 'IA',
    stateName: 'Iowa',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '21:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Iowa Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ia-1', name: 'Joni Ernst', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ia-2', name: 'Michael Franken', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-CO',
    state: 'CO',
    stateName: 'Colorado',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '21:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Colorado Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-co-1', name: 'John Hickenlooper', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-co-2', name: 'Ken Buck', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-MN',
    state: 'MN',
    stateName: 'Minnesota',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '21:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Minnesota Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-mn-1', name: 'Tina Smith', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-mn-2', name: 'Royce White', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-NM',
    state: 'NM',
    stateName: 'New Mexico',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '21:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'New Mexico Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-nm-1', name: 'Ben Ray Luján', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-nm-2', name: 'Mark Ronchetti', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-VA',
    state: 'VA',
    stateName: 'Virginia',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '19:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Virginia Department of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-va-1', name: 'Mark Warner', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-va-2', name: 'Hung Cao', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-KY',
    state: 'KY',
    stateName: 'Kentucky',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '18:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Kentucky State Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ky-1', name: 'Mitch McConnell', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ky-2', name: 'Amy McGrath', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-SC',
    state: 'SC',
    stateName: 'South Carolina',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '19:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'South Carolina Election Commission',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-sc-1', name: 'Lindsey Graham', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-sc-2', name: 'Jaime Harrison', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-KS',
    state: 'KS',
    stateName: 'Kansas',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Kansas Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ks-1', name: 'Roger Marshall', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ks-2', name: 'Barbara Bollier', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-LA',
    state: 'LA',
    stateName: 'Louisiana',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '21:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Louisiana Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-la-1', name: 'Bill Cassidy', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-la-2', name: 'Adrian Perkins', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-AR',
    state: 'AR',
    stateName: 'Arkansas',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:30 ET',
    previousHolderParty: 'REP',
    dataSource: 'Arkansas Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ar-1', name: 'Tom Cotton', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ar-2', name: 'Ricky Dale Harrington Jr.', party: 'LIB', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-AL',
    state: 'AL',
    stateName: 'Alabama',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Alabama Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-al-1', name: 'Tommy Tuberville', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-al-2', name: 'Doug Jones', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-MS',
    state: 'MS',
    stateName: 'Mississippi',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Mississippi Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ms-1', name: 'Cindy Hyde-Smith', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ms-2', name: 'Mike Espy', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-OK',
    state: 'OK',
    stateName: 'Oklahoma',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Oklahoma State Election Board',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ok-1', name: 'Markwayne Mullin', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ok-2', name: 'Madison Horn', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-TN',
    state: 'TN',
    stateName: 'Tennessee',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Tennessee Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-tn-1', name: 'Bill Hagerty', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-tn-2', name: 'Gloria Johnson', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-WY',
    state: 'WY',
    stateName: 'Wyoming',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '21:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Wyoming Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-wy-1', name: 'Cynthia Lummis', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-wy-2', name: 'Merav Ben-David', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-WV',
    state: 'WV',
    stateName: 'West Virginia',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '19:30 ET',
    previousHolderParty: 'REP',
    dataSource: 'West Virginia Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-wv-1', name: 'Shelley Moore Capito', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-wv-2', name: 'Paula Jean Swearengin', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-MA',
    state: 'MA',
    stateName: 'Massachusetts',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Secretary of the Commonwealth of Massachusetts',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ma-1', name: 'Ed Markey', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ma-2', name: 'Kevin O’Connor', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-NJ',
    state: 'NJ',
    stateName: 'New Jersey',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'New Jersey Division of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-nj-1', name: 'Cory Booker', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-nj-2', name: 'Rikin Mehta', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-OR',
    state: 'OR',
    stateName: 'Oregon',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '23:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Oregon Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-or-1', name: 'Jeff Merkley', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-or-2', name: 'Jo Rae Perkins', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-RI',
    state: 'RI',
    stateName: 'Rhode Island',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Rhode Island Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ri-1', name: 'Jack Reed', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ri-2', name: 'Allen Waters', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-IL',
    state: 'IL',
    stateName: 'Illinois',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Illinois State Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-il-1', name: 'Dick Durbin', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-il-2', name: 'Mark Curran', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-DE',
    state: 'DE',
    stateName: 'Delaware',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'DEM',
    dataSource: 'Delaware Department of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-de-1', name: 'Chris Coons', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-de-2', name: 'Lauren Witzke', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-AK',
    state: 'AK',
    stateName: 'Alaska',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '00:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Alaska Division of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ak-1', name: 'Dan Sullivan', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ak-2', name: 'Al Gross', party: 'IND', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-ID',
    state: 'ID',
    stateName: 'Idaho',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '22:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Idaho Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-id-1', name: 'Jim Risch', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-id-2', name: 'Paulette Jordan', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-MT',
    state: 'MT',
    stateName: 'Montana',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: true,
    isCertified: false,
    pollCloseTimeET: '22:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Montana Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-mt-1', name: 'Steve Daines', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-mt-2', name: 'Steve Bullock', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-NE',
    state: 'NE',
    stateName: 'Nebraska',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '21:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'Nebraska Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-ne-1', name: 'Ben Sasse', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-ne-2', name: 'Dan Osborn', party: 'IND', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'SEN-SD',
    state: 'SD',
    stateName: 'South Dakota',
    seatType: 'regular',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    keyRace: false,
    isCertified: false,
    pollCloseTimeET: '20:00 ET',
    previousHolderParty: 'REP',
    dataSource: 'South Dakota Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'c-sd-1', name: 'Mike Rounds', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'c-sd-2', name: 'Dan Ahlers', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  }
];

// 2026 Governor Races (36 States)
export const INITIAL_GOVERNOR_RACES: GovernorRace[] = [
  {
    id: 'GOV-FL',
    state: 'FL',
    stateName: 'Florida',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Ron DeSantis (Term-Limited)',
    incumbentParty: 'REP',
    pollCloseTimeET: '19:00 ET',
    dataSource: 'Florida Division of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-fl-1', name: 'Byron Donalds', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'g-fl-2', name: 'Anna Eskamani', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-GA',
    state: 'GA',
    stateName: 'Georgia',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Brian Kemp (Term-Limited)',
    incumbentParty: 'REP',
    pollCloseTimeET: '19:00 ET',
    dataSource: 'Georgia Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-ga-1', name: 'Burt Jones', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'g-ga-2', name: 'Jason Carter', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-TX',
    state: 'TX',
    stateName: 'Texas',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Greg Abbott',
    incumbentParty: 'REP',
    pollCloseTimeET: '20:00 ET',
    dataSource: 'Texas Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-tx-1', name: 'Greg Abbott', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-tx-2', name: 'Beto O’Rourke', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-PA',
    state: 'PA',
    stateName: 'Pennsylvania',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Josh Shapiro',
    incumbentParty: 'DEM',
    pollCloseTimeET: '20:00 ET',
    dataSource: 'Pennsylvania Department of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-pa-1', name: 'Josh Shapiro', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-pa-2', name: 'Doug Mastriano', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-MI',
    state: 'MI',
    stateName: 'Michigan',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Gretchen Whitmer (Term-Limited)',
    incumbentParty: 'DEM',
    pollCloseTimeET: '20:00 ET',
    dataSource: 'Michigan Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-mi-1', name: 'Jocelyn Benson', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'g-mi-2', name: 'Tudor Dixon', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-AZ',
    state: 'AZ',
    stateName: 'Arizona',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Katie Hobbs',
    incumbentParty: 'DEM',
    pollCloseTimeET: '21:00 ET',
    dataSource: 'Arizona Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-az-1', name: 'Katie Hobbs', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-az-2', name: 'Kari Lake', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-NV',
    state: 'NV',
    stateName: 'Nevada',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Joe Lombardo',
    incumbentParty: 'REP',
    pollCloseTimeET: '22:00 ET',
    dataSource: 'Nevada Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-nv-1', name: 'Joe Lombardo', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-nv-2', name: 'Aaron Ford', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-WI',
    state: 'WI',
    stateName: 'Wisconsin',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Tony Evers',
    incumbentParty: 'DEM',
    pollCloseTimeET: '21:00 ET',
    dataSource: 'Wisconsin Elections Commission',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-wi-1', name: 'Tony Evers', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-wi-2', name: 'Bryan Steil', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-OH',
    state: 'OH',
    stateName: 'Ohio',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Mike DeWine (Term-Limited)',
    incumbentParty: 'REP',
    pollCloseTimeET: '19:30 ET',
    dataSource: 'Ohio Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-oh-1', name: 'Jon Husted', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'g-oh-2', name: 'Allison Russo', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-CA',
    state: 'CA',
    stateName: 'California',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: false,
    isCertified: false,
    incumbentName: 'Gavin Newsom (Term-Limited)',
    incumbentParty: 'DEM',
    pollCloseTimeET: '23:00 ET',
    dataSource: 'California Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-ca-1', name: 'Eleni Kounalakis', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'g-ca-2', name: 'Steve Hilton', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-NY',
    state: 'NY',
    stateName: 'New York',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Kathy Hochul',
    incumbentParty: 'DEM',
    pollCloseTimeET: '21:00 ET',
    dataSource: 'New York State Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-ny-1', name: 'Kathy Hochul', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-ny-2', name: 'Lee Zeldin', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-MD',
    state: 'MD',
    stateName: 'Maryland',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: false,
    isCertified: false,
    incumbentName: 'Wes Moore',
    incumbentParty: 'DEM',
    pollCloseTimeET: '20:00 ET',
    dataSource: 'Maryland State Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-md-1', name: 'Wes Moore', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-md-2', name: 'Dan Cox', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-CO',
    state: 'CO',
    stateName: 'Colorado',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: false,
    isCertified: false,
    incumbentName: 'Jared Polis (Term-Limited)',
    incumbentParty: 'DEM',
    pollCloseTimeET: '21:00 ET',
    dataSource: 'Colorado Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-co-1', name: 'Phil Weiser', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'g-co-2', name: 'Heidi Ganahl', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-MN',
    state: 'MN',
    stateName: 'Minnesota',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    incumbentName: 'Tim Walz',
    incumbentParty: 'DEM',
    pollCloseTimeET: '21:00 ET',
    dataSource: 'Minnesota Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-mn-1', name: 'Tim Walz', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-mn-2', name: 'Scott Jensen', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-IL',
    state: 'IL',
    stateName: 'Illinois',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: false,
    isCertified: false,
    incumbentName: 'JB Pritzker',
    incumbentParty: 'DEM',
    pollCloseTimeET: '20:00 ET',
    dataSource: 'Illinois State Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-il-1', name: 'JB Pritzker', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-il-2', name: 'Darren Bailey', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'GOV-MA',
    state: 'MA',
    stateName: 'Massachusetts',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: false,
    isCertified: false,
    incumbentName: 'Maura Healey',
    incumbentParty: 'DEM',
    pollCloseTimeET: '20:00 ET',
    dataSource: 'Secretary of the Commonwealth',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'g-ma-1', name: 'Maura Healey', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'g-ma-2', name: 'Geoff Diehl', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  }
];

// Key Competitive 2026 House Districts (Cross-section of critical battlegrounds)
export const INITIAL_HOUSE_DISTRICTS: HouseDistrict[] = [
  {
    id: 'H-NY-17',
    state: 'NY',
    districtNumber: 17,
    stateName: 'New York 17th',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'REP',
    dataSource: 'New York Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-ny17-1', name: 'Mike Lawler', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-ny17-2', name: 'Mondaire Jones', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-CA-22',
    state: 'CA',
    districtNumber: 22,
    stateName: 'California 22nd',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'REP',
    dataSource: 'California Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-ca22-1', name: 'David Valadao', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-ca22-2', name: 'Rudy Salas', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-VA-02',
    state: 'VA',
    districtNumber: 2,
    stateName: 'Virginia 2nd',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'REP',
    dataSource: 'Virginia Department of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-va2-1', name: 'Jen Kiggans', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-va2-2', name: 'Missy Cotter Smasal', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-PA-10',
    state: 'PA',
    districtNumber: 10,
    stateName: 'Pennsylvania 10th',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'REP',
    dataSource: 'Pennsylvania Department of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-pa10-1', name: 'Scott Perry', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-pa10-2', name: 'Janelle Stelson', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-MI-07',
    state: 'MI',
    districtNumber: 7,
    stateName: 'Michigan 7th',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'DEM',
    dataSource: 'Michigan Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-mi7-1', name: 'Curtis Hertel', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'ch-mi7-2', name: 'Tom Barrett', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-OH-09',
    state: 'OH',
    districtNumber: 9,
    stateName: 'Ohio 9th',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'DEM',
    dataSource: 'Ohio Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-oh9-1', name: 'Marcy Kaptur', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-oh9-2', name: 'Derek Merrin', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-NC-01',
    state: 'NC',
    districtNumber: 1,
    stateName: 'North Carolina 1st',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'DEM',
    dataSource: 'North Carolina State Board of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-nc1-1', name: 'Don Davis', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-nc1-2', name: 'Laurie Buckhout', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-AZ-06',
    state: 'AZ',
    districtNumber: 6,
    stateName: 'Arizona 6th',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'REP',
    dataSource: 'Arizona Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-az6-1', name: 'Juan Ciscomani', party: 'REP', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-az6-2', name: 'Kirsten Engel', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-TX-34',
    state: 'TX',
    districtNumber: 34,
    stateName: 'Texas 34th',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'DEM',
    dataSource: 'Texas Secretary of State',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-tx34-1', name: 'Vicente Gonzalez', party: 'DEM', isIncumbent: true, votes: 0, votePercentage: 0 },
      { id: 'ch-tx34-2', name: 'Mayra Flores', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  },
  {
    id: 'H-VA-07',
    state: 'VA',
    districtNumber: 7,
    stateName: 'Virginia 7th',
    status: 'uncalled',
    precinctsReportingPct: 0,
    totalVotes: 0,
    isCompetitive: true,
    isCertified: false,
    previousHolderParty: 'DEM',
    dataSource: 'Virginia Department of Elections',
    lastUpdated: '2026-10-25T04:00:00Z',
    candidates: [
      { id: 'ch-va7-1', name: 'Eugene Vindman', party: 'DEM', isIncumbent: false, votes: 0, votePercentage: 0 },
      { id: 'ch-va7-2', name: 'Derrick Anderson', party: 'REP', isIncumbent: false, votes: 0, votePercentage: 0 }
    ]
  }
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    headline: 'Polls Prepare to Open Nationwide for High-Stakes 2026 Midterm Elections',
    summary: 'Voters across 50 states head to ballot boxes as control of both the U.S. Senate and the House of Representatives hangs in the balance.',
    publisher: 'Associated Press',
    publishedAt: '2026-10-25T02:30:00Z',
    url: 'https://apnews.com/hub/election-2026',
    category: 'Breaking News',
    isBreaking: true
  },
  {
    id: 'news-2',
    headline: 'Senate Majority Battle Centers on Key Contests in Georgia, North Carolina, and Maine',
    summary: 'With 33 seats on the ballot, razor-thin margins in Sun Belt and Rust Belt battlegrounds will determine the next Senate majority leader.',
    publisher: 'Reuters',
    publishedAt: '2026-10-25T01:45:00Z',
    url: 'https://reuters.com/world/us/election-2026',
    category: 'Senate',
    isBreaking: false
  },
  {
    id: 'news-3',
    headline: 'House Map Shows 30 Tossup Districts Could Shift Gavel in Washington',
    summary: 'Suburban battlegrounds in California, New York, Pennsylvania, and Virginia are seeing record campaign ad spending in final 48 hours.',
    publisher: 'Decision Desk HQ',
    publishedAt: '2026-10-24T23:15:00Z',
    url: 'https://decisiondeskhq.com',
    category: 'House',
    isBreaking: false
  },
  {
    id: 'news-4',
    headline: 'Governors Races Across 36 States Test State-Level Agendas on Economy and Energy',
    summary: 'Open gubernatorial seats in Florida, Georgia, and California draw national attention as new governors prepare to take office in 2027.',
    publisher: 'National Public Radio',
    publishedAt: '2026-10-24T21:00:00Z',
    url: 'https://npr.org/sections/elections',
    category: 'Governors',
    isBreaking: false
  },
  {
    id: 'news-5',
    headline: 'Election Security Officials Confirm Voting Infrastructure Fully Operational Ahead of Polls',
    summary: 'Federal and state election directors report multi-layered physical audits, paper trails, and secure tabulation networks active in all jurisdictions.',
    publisher: 'CISA / Official Statement',
    publishedAt: '2026-10-24T18:20:00Z',
    url: 'https://cisa.gov/topics/election-security',
    category: 'Election Administration',
    isBreaking: false
  },
  {
    id: 'news-6',
    headline: 'Record Early and Mail-In Ballots Cast Across Battleground States',
    summary: 'Over 42 million voters have submitted mail-in or in-person advance ballots according to verified university election lab data.',
    publisher: 'Election Lab Archive',
    publishedAt: '2026-10-24T16:05:00Z',
    url: 'https://election.lab.ufl.edu',
    category: 'Voting',
    isBreaking: false
  }
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'time-1',
    timeET: '06:00 ET',
    timestamp: '2026-11-03T11:00:00Z',
    title: 'Polls Open on East Coast',
    description: 'First polling locations open across Indiana, Kentucky, Virginia, and New York.',
    type: 'poll_close',
    category: 'general',
    source: 'State Election Boards'
  },
  {
    id: 'time-2',
    timeET: '18:00 ET',
    timestamp: '2026-11-03T23:00:00Z',
    title: 'Polls Close in Parts of Indiana & Kentucky',
    description: 'Initial polling stations close in ET portions of IN and KY. Tabulation begins.',
    type: 'poll_close',
    category: 'general',
    source: 'State Election Authorities'
  },
  {
    id: 'time-3',
    timeET: '19:00 ET',
    timestamp: '2026-11-04T00:00:00Z',
    title: 'Polls Close in Georgia, Virginia, Florida (ET), South Carolina, Vermont',
    description: 'Major battleground Georgia closes polls. First batch of early votes expected soon.',
    type: 'poll_close',
    category: 'senate',
    source: 'Associated Press'
  },
  {
    id: 'time-4',
    timeET: '19:30 ET',
    timestamp: '2026-11-04T00:30:00Z',
    title: 'Polls Close in North Carolina & Ohio',
    description: 'Crucial Senate battleground North Carolina ends voting; early vote releases expected.',
    type: 'poll_close',
    category: 'senate',
    source: 'State Board of Elections'
  },
  {
    id: 'time-5',
    timeET: '20:00 ET',
    timestamp: '2026-11-04T01:00:00Z',
    title: 'Polls Close in Pennsylvania, Michigan, Texas, Maine, New Jersey, Alabama',
    description: 'Wave of key state closures across Midwest and East Coast.',
    type: 'poll_close',
    category: 'general',
    source: 'Decision Desk HQ'
  }
];

// Helper to calculate national overview given Senate, House, Governor states and simulation progress
export function calculateNationalOverview(
  senateRaces: SenateRace[],
  houseDistricts: HouseDistrict[],
  governorRaces: GovernorRace[],
  isSimulation: boolean,
  simPct: number
): NationalOverview {
  // Total Senate: 100 seats. 67 not up for re-election in 2026 (or seats already determined).
  // Current baseline not up: DEM ~38, REP ~28, IND ~1
  const notUp = { dem: 38, rep: 28, ind: 1 };

  let senateDemCalled = 0;
  let senateRepCalled = 0;
  let senateIndCalled = 0;
  let senateUncalled = 0;

  senateRaces.forEach((r) => {
    if (r.status === 'called_dem') senateDemCalled++;
    else if (r.status === 'called_rep') senateRepCalled++;
    else if (r.status === 'called_ind') senateIndCalled++;
    else senateUncalled++;
  });

  let houseDemWon = 0;
  let houseRepWon = 0;
  let houseIndWon = 0;
  let houseUncalled = 435;

  if (isSimulation && simPct > 0) {
    // In simulation mode, dynamically scale called house seats based on simPct
    const simulatedCalled = Math.round((simPct / 100) * 435);
    // Baseline competitive split
    houseDemWon = Math.round(simulatedCalled * 0.495);
    houseRepWon = simulatedCalled - houseDemWon;
    houseUncalled = 435 - simulatedCalled;
  }

  let govDemWon = 0;
  let govRepWon = 0;
  let govIndWon = 0;
  let govUncalled = 0;

  governorRaces.forEach((g) => {
    if (g.status === 'called_dem') govDemWon++;
    else if (g.status === 'called_rep') govRepWon++;
    else if (g.status === 'called_ind') govIndWon++;
    else govUncalled++;
  });

  return {
    lastUpdated: new Date().toISOString(),
    electionDate: '2026-11-03',
    isElectionDay: isSimulation || simPct > 0,
    isLiveReporting: isSimulation && simPct > 0,
    dataFreshnessSeconds: 12,
    dataSource: isSimulation ? 'Decision Desk Live Stream / AP Adapter' : 'Official State Pre-Election Board & FEC',
    senate: {
      totalSeats: 100,
      majorityThreshold: 51,
      demSeatsHeld: notUp.dem + senateDemCalled,
      repSeatsHeld: notUp.rep + senateRepCalled,
      indSeatsHeld: notUp.ind + senateIndCalled,
      uncalledSeats: senateUncalled,
      seatsNotUp: notUp,
      netGain: {
        dem: senateDemCalled > 10 ? 1 : 0,
        rep: senateRepCalled > 18 ? 1 : 0
      },
      calledRacesCount: senateDemCalled + senateRepCalled + senateIndCalled,
      uncalledRacesCount: senateUncalled
    },
    house: {
      totalSeats: 435,
      majorityThreshold: 218,
      demSeatsWon: houseDemWon,
      repSeatsWon: houseRepWon,
      indSeatsWon: houseIndWon,
      uncalledSeats: houseUncalled,
      netGain: {
        dem: houseDemWon > 210 ? 2 : 0,
        rep: houseRepWon > 215 ? 1 : 0
      },
      projectedBalance: {
        demMin: 212,
        demMax: 224,
        repMin: 211,
        repMax: 223,
        source: 'Decision Desk Consensus Model'
      }
    },
    governors: {
      totalRaces: 36,
      demWon: govDemWon,
      repWon: govRepWon,
      indWon: govIndWon,
      uncalled: govUncalled,
      currentHolding: {
        dem: 23,
        rep: 27
      }
    }
  };
}
