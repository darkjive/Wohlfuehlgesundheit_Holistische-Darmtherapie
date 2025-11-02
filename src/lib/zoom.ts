// src/lib/zoom.ts
// Zoom API Integration für Meeting-Buchungen

interface ZoomConfig {
  accountId: string;
  clientId: string;
  clientSecret: string;
}

interface ZoomMeetingOptions {
  topic: string;
  startTime: string; // ISO 8601 format
  duration: number; // in minutes
  timezone?: string;
  agenda?: string;
  password?: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    join_before_host?: boolean;
    mute_upon_entry?: boolean;
    waiting_room?: boolean;
    audio?: 'both' | 'telephony' | 'voip';
  };
}

class ZoomService {
  private config: ZoomConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: ZoomConfig) {
    this.config = config;
  }

  /**
   * Holt oder erneuert das OAuth Access Token
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    // Token wiederverwenden wenn noch gültig
    if (this.accessToken && this.tokenExpiry > now) {
      return this.accessToken;
    }

    const authString = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString('base64');

    const response = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.config.accountId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Zoom OAuth failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    // Token läuft in ~1 Stunde ab, erneuern wir 5 Min früher
    this.tokenExpiry = now + (data.expires_in - 300) * 1000;
    
    return this.accessToken;
  }

  /**
   * Erstellt ein neues Zoom Meeting
   */
  async createMeeting(options: ZoomMeetingOptions) {
    const token = await this.getAccessToken();

    const meetingData = {
      topic: options.topic,
      type: 2, // Geplantes Meeting
      start_time: options.startTime,
      duration: options.duration,
      timezone: options.timezone || 'Europe/Berlin',
      agenda: options.agenda || '',
      password: options.password || this.generatePassword(),
      settings: {
        host_video: options.settings?.host_video ?? true,
        participant_video: options.settings?.participant_video ?? true,
        join_before_host: options.settings?.join_before_host ?? false,
        mute_upon_entry: options.settings?.mute_upon_entry ?? true,
        waiting_room: options.settings?.waiting_room ?? true,
        audio: options.settings?.audio || 'both',
        auto_recording: 'none',
        approval_type: 2 // Keine Registrierung erforderlich
      }
    };

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Meeting erstellen fehlgeschlagen: ${error}`);
    }

    return await response.json();
  }

  /**
   * Löscht ein Meeting
   */
  async deleteMeeting(meetingId: string) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Meeting löschen fehlgeschlagen: ${response.statusText}`);
    }

    return true;
  }

  /**
   * Holt Meeting-Details
   */
  async getMeeting(meetingId: string) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Meeting abrufen fehlgeschlagen: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Generiert ein sicheres Meeting-Passwort
   */
  private generatePassword(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

// Singleton Instance
let zoomService: ZoomService | null = null;

export function getZoomService(): ZoomService {
  if (!zoomService) {
    const config = {
      accountId: import.meta.env.ZOOM_ACCOUNT_ID || '',
      clientId: import.meta.env.ZOOM_CLIENT_ID || '',
      clientSecret: import.meta.env.ZOOM_CLIENT_SECRET || ''
    };

    if (!config.accountId || !config.clientId || !config.clientSecret) {
      throw new Error('Zoom credentials nicht konfiguriert. Bitte .env Datei prüfen.');
    }

    zoomService = new ZoomService(config);
  }

  return zoomService;
}

export type { ZoomMeetingOptions };