import { Injectable } from '@angular/core';
import type { Session } from '../models';
import { AuthService } from '../services';
import accountJson from './account.json';
import type { SampleAccount } from './sample-types';

const profile = (accountJson as unknown as SampleAccount).profile;

/** In-memory auth (Phase 1). Starts signed in as the sample reader; any password works. */
@Injectable()
export class SampleAuthService extends AuthService {
  private current: Session | null = {
    userId: profile.id,
    email: profile.email,
    fullName: profile.fullName,
  };

  async session(): Promise<Session | null> {
    return this.current;
  }

  async signIn(email: string, _password: string): Promise<Session> {
    const known = email === profile.email;
    this.current = {
      userId: known ? profile.id : `user-${email}`,
      email,
      fullName: known ? profile.fullName : email.split('@')[0],
    };
    return this.current;
  }

  async signUp(fullName: string, email: string, _password: string): Promise<Session> {
    this.current = { userId: `user-${email}`, email, fullName };
    return this.current;
  }

  async signOut(): Promise<void> {
    this.current = null;
  }
}
