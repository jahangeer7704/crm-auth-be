export interface ISessionStore {
    addSession(sessionId: string, data: any): Promise<void>;
    removeSession(sessionId: string): Promise<void>;
    getSession(sessionId: string): Promise<any>;
  }
  