// src/pages/api/booking/create-meeting.ts
// API Endpoint für Zoom Meeting-Buchungen

import type { APIRoute } from 'astro';
import { getZoomService } from '../../../lib/zoom';

/**
 * POST /api/booking/create-meeting
 * Erstellt ein neues Zoom Meeting basierend auf Buchungsdaten
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Request Body parsen
    const body = await request.json();
    const { patientName, email, date, time, duration, notes } = body;

    // Validierung der Pflichtfelder
    if (!patientName || !email || !date || !time) {
      return new Response(
        JSON.stringify({ 
          error: 'Fehlende Pflichtfelder',
          required: ['patientName', 'email', 'date', 'time']
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // E-Mail Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Ungültige E-Mail-Adresse' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Datum validieren (muss in der Zukunft liegen)
    const meetingDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();
    
    if (meetingDateTime <= now) {
      return new Response(
        JSON.stringify({ error: 'Meeting-Termin muss in der Zukunft liegen' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Startzeit im ISO 8601 Format
    const startTime = meetingDateTime.toISOString();

    // Zoom Service initialisieren und Meeting erstellen
    const zoomService = getZoomService();
    
    const meeting = await zoomService.createMeeting({
      topic: `Beratungsgespräch mit ${patientName}`,
      startTime: startTime,
      duration: duration || 60,
      timezone: 'Europe/Berlin',
      agenda: notes || 'Holistische Darmtherapie - Beratungsgespräch',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        audio: 'both'
      }
    });

    // Optional: E-Mail-Benachrichtigung senden
    // Auskommentiert - aktivieren Sie dies wenn Sie E-Mail-Integration haben
    /*
    try {
      await sendBookingConfirmation(email, {
        patientName,
        meeting,
        date,
        time
      });
    } catch (emailError) {
      console.error('E-Mail konnte nicht gesendet werden:', emailError);
      // Meeting wurde trotzdem erstellt, daher kein Fehler zurückgeben
    }
    */

    // Erfolgreiche Antwort
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Meeting erfolgreich erstellt',
        meeting: {
          id: meeting.id,
          joinUrl: meeting.join_url,
          password: meeting.password,
          startTime: meeting.start_time,
          duration: meeting.duration,
          topic: meeting.topic
        }
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    // Fehlerbehandlung
    console.error('Zoom Meeting Fehler:', error);
    
    // Detaillierte Fehlermeldung für Entwicklung
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    
    return new Response(
      JSON.stringify({ 
        error: 'Meeting konnte nicht erstellt werden',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

/**
 * GET /api/booking/create-meeting
 * Info-Endpoint (optional)
 */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      endpoint: '/api/booking/create-meeting',
      method: 'POST',
      description: 'Erstellt ein neues Zoom Meeting',
      requiredFields: {
        patientName: 'string',
        email: 'string',
        date: 'string (YYYY-MM-DD)',
        time: 'string (HH:MM)'
      },
      optionalFields: {
        duration: 'number (Minuten, default: 60)',
        notes: 'string'
      }
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
};