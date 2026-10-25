/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.resolve(DATA_DIR, 'cms_db.json');

export type UserRole = 'Super Admin' | 'Editor' | 'Analyst';

export interface CMSUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CMSSession {
  token: string;
  userId: string;
  username: string;
  role: UserRole;
  expiresAt: number; // timestamp in ms
}

export interface CMSSettings {
  // Target: November 3, 2026, 9:00 AM IST (Indian Standard Time: UTC+05:30)
  // 9:00 AM IST = 03:30 AM UTC = 2026-11-03T03:30:00.000Z
  countdownTargetISO: string;
  targetDescription: string;
  forcedElectionDayMode: boolean; // CMS forced override
  autoOpenElectionDayDesk: boolean; // automatically opens /election-day-desk for visitors when countdown expires
  broadcastTitle: string;
  broadcastDescription: string;
  breakingAnnouncement: {
    active: boolean;
    text: string;
    alertLevel: 'red' | 'amber' | 'blue';
  };
  youtubeVideoId: string;
  youtubeAutoPlay: boolean;
  audio: {
    enableChimes: boolean;
    breakingAlertSound: boolean;
    volume: number; // 0 to 100
  };
  layouts: {
    showChamberCounters: boolean;
    showMap: boolean;
    showNewsWire: boolean;
    showTimeline: boolean;
    showAnalysis: boolean;
    defaultMapView: '3D' | '2D';
    defaultTheme: 'light' | 'dark';
  };
  simulation: {
    mode: 'countdown' | 'live_simulation' | 'external_api';
    progressPct: number;
    pollingIntervalSeconds: number;
    activeProvider: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  role: string;
  action: string;
  details: string;
  ip?: string;
}

export interface CMSDatabaseSchema {
  isInitialized: boolean;
  users: CMSUser[];
  sessions: CMSSession[];
  settings: CMSSettings;
  auditLogs: AuditLogEntry[];
  newsOverrides: any[];
  raceOverrides: Record<string, any>;
}

// Default initial settings
const DEFAULT_SETTINGS: CMSSettings = {
  countdownTargetISO: '2026-11-03T03:30:00.000Z', // Nov 3, 2026 9:00 AM IST
  targetDescription: 'Tuesday, November 3, 2026 at 9:00 AM IST',
  forcedElectionDayMode: false,
  autoOpenElectionDayDesk: true,
  broadcastTitle: 'Decision Desk 2026: U.S. Midterm Election Live',
  broadcastDescription: 'Real-time race calls, Senate and House balance of power, and battleground analysis.',
  breakingAnnouncement: {
    active: true,
    text: 'Decision Desk CMS Connected · Official 2026 Midterm Countdown Synchronized with Indian Standard Time (IST)',
    alertLevel: 'blue'
  },
  youtubeVideoId: 'f0lYkdA-Gtw',
  youtubeAutoPlay: true,
  audio: {
    enableChimes: true,
    breakingAlertSound: true,
    volume: 80
  },
  layouts: {
    showChamberCounters: true,
    showMap: true,
    showNewsWire: true,
    showTimeline: true,
    showAnalysis: true,
    defaultMapView: '3D',
    defaultTheme: 'light'
  },
  simulation: {
    mode: 'countdown',
    progressPct: 0,
    pollingIntervalSeconds: 30,
    activeProvider: 'DECISION_DESK'
  }
};

class CMSDatabase {
  private data: CMSDatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.load();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): CMSDatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, reinitializing:', err);
      }
    }

    // Initialize default database
    const initialDb: CMSDatabaseSchema = {
      isInitialized: false, // will require password setup on first visit unless seeded
      users: [],
      sessions: [],
      settings: DEFAULT_SETTINGS,
      auditLogs: [
        {
          id: 'audit-init',
          timestamp: new Date().toISOString(),
          username: 'System',
          role: 'System',
          action: 'DATABASE_BOOTSTRAP',
          details: 'Initialized secure CMS database with IST target (Nov 3, 2026, 9:00 AM IST)'
        }
      ],
      newsOverrides: [],
      raceOverrides: {}
    };

    // If CMS_ADMIN_PASSWORD env var is present, automatically initialize Upasyo2007
    if (process.env.CMS_ADMIN_PASSWORD) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = this.hashPassword(process.env.CMS_ADMIN_PASSWORD, salt);
      initialDb.users.push({
        id: 'usr-upasyo-1',
        username: 'Upasyo2007',
        passwordHash: hash,
        salt,
        role: 'Super Admin',
        createdAt: new Date().toISOString()
      });
      initialDb.isInitialized = true;
    }

    this.save(initialDb);
    return initialDb;
  }

  private save(dataToSave?: CMSDatabaseSchema) {
    const d = dataToSave || this.data;
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save CMS database to file:', err);
    }
  }

  // Password hashing using Node's native crypto (scrypt)
  public hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  public verifyPassword(password: string, hash: string, salt: string): boolean {
    const key = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(hash, 'hex');
    return crypto.timingSafeEqual(key, keyBuffer);
  }

  // Auth Operations
  public isInitialized(): boolean {
    return this.data.isInitialized && this.data.users.length > 0;
  }

  public setupInitialAdmin(password: string, ip?: string): { success: boolean; error?: string } {
    if (this.isInitialized()) {
      return { success: false, error: 'Administrator account already initialized.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters in length.' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);

    const adminUser: CMSUser = {
      id: 'usr-admin-master',
      username: 'Upasyo2007',
      passwordHash,
      salt,
      role: 'Super Admin',
      createdAt: new Date().toISOString()
    };

    this.data.users = [adminUser];
    this.data.isInitialized = true;
    this.logAudit('Upasyo2007', 'INITIAL_PASSWORD_SETUP', 'Created master Super Admin credentials', ip);
    this.save();

    return { success: true };
  }

  public authenticate(username: string, password: string, ip?: string): { user?: CMSUser; token?: string; error?: string } {
    const cleanUser = username.trim();
    const user = this.data.users.find((u) => u.username.toLowerCase() === cleanUser.toLowerCase());

    if (!user) {
      this.logAudit(cleanUser || 'Anonymous', 'AUTH_FAILED', 'User not found', ip);
      return { error: 'Invalid username or password.' };
    }

    const valid = this.verifyPassword(password, user.passwordHash, user.salt);
    if (!valid) {
      this.logAudit(cleanUser, 'AUTH_FAILED', 'Incorrect password attempt', ip);
      return { error: 'Invalid username or password.' };
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();

    // Create session token (valid for 8 hours)
    const token = crypto.randomBytes(32).toString('hex');
    const session: CMSSession = {
      token,
      userId: user.id,
      username: user.username,
      role: user.role,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000
    };

    // Clean expired sessions
    this.data.sessions = this.data.sessions.filter((s) => s.expiresAt > Date.now());
    this.data.sessions.push(session);

    this.logAudit(user.username, 'LOGIN_SUCCESS', `Session created for role: ${user.role}`, ip);
    this.save();

    return { user, token };
  }

  public validateSession(token?: string): CMSSession | null {
    if (!token) return null;
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
      this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
      this.save();
      return null;
    }

    return session;
  }

  public revokeSession(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // Settings
  public getSettings(): CMSSettings {
    return this.data.settings;
  }

  public updateSettings(partial: Partial<CMSSettings>, actor: string, ip?: string): CMSSettings {
    this.data.settings = {
      ...this.data.settings,
      ...partial
    };

    this.logAudit(actor, 'SETTINGS_UPDATE', `Updated configuration sections: ${Object.keys(partial).join(', ')}`, ip);
    this.save();
    return this.data.settings;
  }

  // Audit Logs
  public getAuditLogs(): AuditLogEntry[] {
    return this.data.auditLogs.slice(-200).reverse(); // latest 200 logs
  }

  public logAudit(username: string, action: string, details: string, ip?: string) {
    const entry: AuditLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      username,
      role: this.getUserRole(username),
      action,
      details,
      ip: ip || 'internal'
    };
    this.data.auditLogs.push(entry);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(-500);
    }
    this.save();
  }

  private getUserRole(username: string): string {
    const u = this.data.users.find((user) => user.username.toLowerCase() === username.toLowerCase());
    return u?.role || 'Guest';
  }

  // Users
  public getUsers(): Omit<CMSUser, 'passwordHash' | 'salt'>[] {
    return this.data.users.map(({ passwordHash, salt, ...rest }) => rest);
  }

  public changePassword(username: string, newPass: string, actor: string, ip?: string): boolean {
    const user = this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return false;
    user.salt = crypto.randomBytes(16).toString('hex');
    user.passwordHash = this.hashPassword(newPass, user.salt);
    this.logAudit(actor, 'PASSWORD_CHANGE', `Password updated for user: ${username}`, ip);
    this.save();
    return true;
  }
}

export const cmsDb = new CMSDatabase();
