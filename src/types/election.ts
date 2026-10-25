/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Party = 'DEM' | 'REP' | 'IND' | 'LIB' | 'GRN' | 'OTH';

export type RaceStatus =
  | 'uncalled'
  | 'called_dem'
  | 'called_rep'
  | 'called_ind'
  | 'too_close_to_call'
  | 'polls_open'
  | 'reporting';

export interface RaceCallDetails {
  calledBy: string; // e.g. 'Decision Desk HQ / Associated Press'
  calledAt: string; // ISO string
  confidence: 'projected' | 'certified';
}

export interface Candidate {
  id: string;
  name: string;
  party: Party;
  isIncumbent: boolean;
  votes: number;
  votePercentage: number;
  isWinner?: boolean;
  isProjectedWinner?: boolean;
}

export interface SenateRace {
  id: string;
  state: string; // 2-letter abbreviation
  stateName: string;
  seatType: 'regular' | 'special';
  status: RaceStatus;
  winnerParty?: Party;
  precinctsReportingPct: number;
  totalVotes: number;
  candidates: Candidate[];
  lastUpdated: string; // ISO string
  dataSource: string;
  isCertified: boolean;
  keyRace: boolean;
  pollCloseTimeET: string;
  previousHolderParty: Party;
  raceCallDetails?: RaceCallDetails;
}

export interface HouseDistrict {
  id: string;
  state: string;
  districtNumber: number;
  stateName: string;
  status: RaceStatus;
  winnerParty?: Party;
  precinctsReportingPct: number;
  totalVotes: number;
  candidates: Candidate[];
  lastUpdated: string;
  dataSource: string;
  isCertified: boolean;
  isCompetitive: boolean;
  previousHolderParty: Party;
  raceCallDetails?: RaceCallDetails;
}

export interface GovernorRace {
  id: string;
  state: string;
  stateName: string;
  status: RaceStatus;
  winnerParty?: Party;
  precinctsReportingPct: number;
  totalVotes: number;
  candidates: Candidate[];
  lastUpdated: string;
  dataSource: string;
  isCertified: boolean;
  isCompetitive: boolean;
  incumbentName: string;
  incumbentParty: Party;
  pollCloseTimeET: string;
  raceCallDetails?: RaceCallDetails;
}

export interface NationalOverview {
  lastUpdated: string;
  electionDate: string; // '2026-11-03'
  isElectionDay: boolean;
  isLiveReporting: boolean;
  dataFreshnessSeconds: number;
  dataSource: string;
  senate: {
    totalSeats: number;
    majorityThreshold: number;
    demSeatsHeld: number; // Seats won + not up for re-election
    repSeatsHeld: number;
    indSeatsHeld: number;
    uncalledSeats: number;
    seatsNotUp: {
      dem: number;
      rep: number;
      ind: number;
    };
    netGain: {
      dem: number;
      rep: number;
    };
    calledRacesCount: number;
    uncalledRacesCount: number;
  };
  house: {
    totalSeats: number;
    majorityThreshold: number;
    demSeatsWon: number;
    repSeatsWon: number;
    indSeatsWon: number;
    uncalledSeats: number;
    netGain: {
      dem: number;
      rep: number;
    };
    projectedBalance?: {
      demMin: number;
      demMax: number;
      repMin: number;
      repMax: number;
      source: string;
    };
  };
  governors: {
    totalRaces: number; // 36 in 2026
    demWon: number;
    repWon: number;
    indWon: number;
    uncalled: number;
    currentHolding: {
      dem: number;
      rep: number;
    };
  };
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  publisher: string;
  publishedAt: string; // ISO
  url: string;
  category:
    | 'Breaking News'
    | 'Senate'
    | 'House'
    | 'Governors'
    | 'Campaigns'
    | 'Election Administration'
    | 'Voting'
    | 'Analysis'
    | 'Official Statements';
  isBreaking: boolean;
  imageUrl?: string;
}

export interface TimelineEvent {
  id: string;
  timeET: string; // e.g., '19:00 ET'
  timestamp: string;
  title: string;
  description: string;
  type: 'call' | 'poll_close' | 'projection' | 'milestone' | 'statement';
  category: 'senate' | 'house' | 'governor' | 'general';
  party?: Party;
  source: string;
}

export interface AdminConfig {
  mode: 'countdown' | 'live_simulation' | 'external_api';
  activeProvider: 'AP' | 'FEC' | 'STATE_ELECTIONS' | 'DECISION_DESK';
  pollingIntervalSeconds: number;
  youtubeVideoId: string;
  broadcastTitle: string;
  broadcastDescription: string;
  enableNewsFeed: boolean;
  simulationProgressPct: number; // 0 to 100% of election night completed
  hasAPCredentials: boolean;
  hasFECCredentials: boolean;
}
