<?php
/**
 * Anamnesebogen & Zoom Booking API Handler
 * 
 * Handles form submission, creates Zoom meetings, and sends confirmation emails
 * 
 * @author Wohlfuehlgesundheit - Holistische Darmtherapie
 * @version 1.0
 */

// ============================================================================
// CONFIGURATION - BITTE ANPASSEN
// ============================================================================

// Zoom Server-to-Server OAuth Credentials
// Erstellen Sie eine Server-to-Server OAuth App unter: https://marketplace.zoom.us/
define('ZOOM_ACCOUNT_ID', 'eoPCE1FcSxShFq-2opjjZA');
define('ZOOM_CLIENT_ID', 'Ue1txJL0SxKvAOsy1LMl9Q');
define('ZOOM_CLIENT_SECRET', '0khVoIrVoQoAU0kqQrtScNk1xn6vbt12');

// Admin E-Mail für Benachrichtigungen
define('ADMIN_EMAIL', 'root@xn--wohlfhlgesundheit-62b.de');
define('ADMIN_NAME', 'Holistische Darmtherapie');

// E-Mail Absender
define('FROM_EMAIL', 'root@xn--wohlfhlgesundheit-62b.de');
define('FROM_NAME', 'Wohlfuehlgesundheit');

// ============================================================================
// SECURITY & HEADERS
// ============================================================================

// CORS Headers (falls Frontend auf anderem Domain läuft)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Nur POST-Anfragen sind erlaubt.');
    exit();
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

try {
    // 1. Validate and sanitize input
    $formData = validateAndSanitizeInput();
    
    // 2. Get Zoom Access Token
    $accessToken = getZoomAccessToken();
    
    // 3. Create Zoom Meeting
    $meetingData = createZoomMeeting($accessToken, $formData);
    
    // 4. Send confirmation email to user
    sendUserConfirmationEmail($formData, $meetingData);
    
    // 5. Send notification email to admin
    sendAdminNotificationEmail($formData, $meetingData);
    
    // 6. Success response
    sendJsonResponse(
        true, 
        'Vielen Dank! Dein Termin wurde erfolgreich gebucht. Du erhälst in Kürze eine Bestätigungsmail mit den Zoom-Zugangsdaten.'
    );
    
} catch (Exception $e) {
    // Log error for debugging
    error_log('Anamnese Booking Error: ' . $e->getMessage());
    
    // Send user-friendly error message
    sendJsonResponse(false, 'Es ist ein Fehler aufgetreten: ' . $e->getMessage());
}

// ============================================================================
// VALIDATION & SANITIZATION
// ============================================================================

/**
 * Validate and sanitize all form inputs
 * 
 * @return array Sanitized form data
 * @throws Exception if validation fails
 */
function validateAndSanitizeInput() {
    $data = [];
    
    // Required fields
    $requiredFields = [
        'vorname' => 'Vorname',
        'nachname' => 'Nachname',
        'email' => 'E-Mail-Adresse',
        'telefon' => 'Telefonnummer',
        'hauptbeschwerde' => 'Hauptbeschwerde',
        'datum' => 'Datum',
        'uhrzeit' => 'Uhrzeit'
    ];
    
    // Check required fields
    foreach ($requiredFields as $field => $label) {
        if (empty($_POST[$field])) {
            throw new Exception("Pflichtfeld fehlt: $label");
        }
        $data[$field] = sanitizeInput($_POST[$field]);
    }
    
    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Ungültige E-Mail-Adresse.');
    }
    
    // Validate date (must be in the future)
    $selectedDate = strtotime($data['datum']);
    $tomorrow = strtotime('tomorrow');
    if ($selectedDate < $tomorrow) {
        throw new Exception('Das gewählte Datum muss in der Zukunft liegen.');
    }
    
    // Validate time format
    if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $data['uhrzeit'])) {
        throw new Exception('Ungültiges Uhrzeitformat.');
    }
    
    // Optional fields
    $data['vorerkrankungen'] = sanitizeInput($_POST['vorerkrankungen'] ?? '');
    $data['medikamente'] = sanitizeInput($_POST['medikamente'] ?? '');
    $data['ernaehrung'] = sanitizeInput($_POST['ernaehrung'] ?? 'mischkost');
    $data['anmerkungen'] = sanitizeInput($_POST['anmerkungen'] ?? '');
    $data['dauer'] = intval($_POST['dauer'] ?? 60);
    
    // Validate duration
    if (!in_array($data['dauer'], [30, 60])) {
        $data['dauer'] = 60; // Default to 60 minutes
    }
    
    // Check privacy policy acceptance
    if (empty($_POST['datenschutz'])) {
        throw new Exception('Bitte akzeptieren Sie die Datenschutzerklärung.');
    }
    
    return $data;
}

/**
 * Sanitize input string
 * 
 * @param string $input Raw input
 * @return string Sanitized input
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// ============================================================================
// ZOOM API INTEGRATION
// ============================================================================

/**
 * Get Zoom Access Token using Server-to-Server OAuth
 * 
 * @return string Access token
 * @throws Exception if authentication fails
 */
function getZoomAccessToken() {
    $url = 'https://zoom.us/oauth/token';
    
    $auth = base64_encode(ZOOM_CLIENT_ID . ':' . ZOOM_CLIENT_SECRET);
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url . '?grant_type=account_credentials&account_id=' . ZOOM_ACCOUNT_ID,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Basic ' . $auth,
            'Content-Type: application/x-www-form-urlencoded'
        ],
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        error_log('Zoom OAuth Error: ' . $response);
        throw new Exception('Fehler bei der Zoom-Authentifizierung.');
    }
    
    $data = json_decode($response, true);
    
    if (!isset($data['access_token'])) {
        throw new Exception('Kein Access Token von Zoom erhalten.');
    }
    
    return $data['access_token'];
}

/**
 * Create a scheduled Zoom meeting
 * 
 * @param string $accessToken Zoom access token
 * @param array $formData Form data
 * @return array Meeting data
 * @throws Exception if meeting creation fails
 */
function createZoomMeeting($accessToken, $formData) {
    $url = 'https://api.zoom.us/v2/users/me/meetings';
    
    // Combine date and time
    $dateTime = $formData['datum'] . ' ' . $formData['uhrzeit'];
    $startTime = date('Y-m-d\TH:i:s', strtotime($dateTime));
    
    // Meeting topic
    $topic = 'Erstgespräch: ' . $formData['vorname'] . ' ' . $formData['nachname'];
    
    // Meeting payload
    $meetingData = [
        'topic' => $topic,
        'type' => 2, // Scheduled meeting
        'start_time' => $startTime,
        'duration' => $formData['dauer'],
        'timezone' => 'Europe/Berlin',
        'agenda' => 'Anamnesegespräch - Holistische Darmtherapie',
        'settings' => [
            'host_video' => true,
            'participant_video' => true,
            'join_before_host' => false,
            'mute_upon_entry' => false,
            'watermark' => false,
            'use_pmi' => false,
            'approval_type' => 2, // No registration required
            'audio' => 'both',
            'auto_recording' => 'none',
            'waiting_room' => true,
            'meeting_authentication' => false
        ]
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json'
        ],
        CURLOPT_POSTFIELDS => json_encode($meetingData)
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 201) {
        error_log('Zoom Meeting Creation Error: ' . $response);
        throw new Exception('Fehler beim Erstellen des Zoom-Meetings.');
    }
    
    $meeting = json_decode($response, true);
    
    if (!isset($meeting['id'])) {
        throw new Exception('Keine Meeting-ID von Zoom erhalten.');
    }
    
    return $meeting;
}

// ============================================================================
// EMAIL FUNCTIONS
// ============================================================================

/**
 * Send confirmation email to user
 * 
 * @param array $formData Form data
 * @param array $meetingData Zoom meeting data
 */
function sendUserConfirmationEmail($formData, $meetingData) {
    $to = $formData['email'];
    $subject = 'Terminbestätigung - Ihr Zoom-Erstgespräch';
    
    // Format date and time in German
    $datumFormatiert = date('d.m.Y', strtotime($formData['datum']));
    $startTime = date('H:i', strtotime($meetingData['start_time']));
    
    // HTML email body
    $message = "
    <!DOCTYPE html>
    <html lang='de'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #047857; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .meeting-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #047857; }
            .button { display: inline-block; background-color: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            strong { color: #047857; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Terminbestätigung</h1>
            </div>
            <div class='content'>
                <p>Liebe/r {$formData['vorname']} {$formData['nachname']},</p>
                
                <p>vielen Dank für Ihr Vertrauen! Ihr Zoom-Erstgespräch wurde erfolgreich gebucht.</p>
                
                <div class='meeting-details'>
                    <h2 style='margin-top: 0; color: #047857;'>Ihre Termin-Details</h2>
                    <p><strong>Datum:</strong> {$datumFormatiert}</p>
                    <p><strong>Uhrzeit:</strong> {$startTime} Uhr</p>
                    <p><strong>Dauer:</strong> {$formData['dauer']} Minuten</p>
                    <p><strong>Meeting-ID:</strong> {$meetingData['id']}</p>
                    <p><strong>Passcode:</strong> {$meetingData['password']}</p>
                </div>
                
                <p><strong>So nehmen Sie am Meeting teil:</strong></p>
                <p>Klicken Sie zum gewählten Zeitpunkt einfach auf folgenden Link:</p>
                
                <p style='text-align: center;'>
                    <a href='{$meetingData['join_url']}' class='button'>Zum Zoom-Meeting</a>
                </p>
                
                <p style='font-size: 14px; color: #666;'>
                    Alternativ können Sie auch die Zoom-App öffnen und die Meeting-ID manuell eingeben.
                </p>
                
                <p><strong>Wichtige Hinweise:</strong></p>
                <ul>
                    <li>Bitte stellen Sie sicher, dass Sie Zoom installiert haben oder nutzen Sie die Browser-Version</li>
                    <li>Testen Sie vorab Ihre Kamera und Ihr Mikrofon</li>
                    <li>Suchen Sie sich einen ruhigen Ort für das Gespräch</li>
                </ul>
                
                <p>Wir freuen uns auf das Gespräch mit Ihnen!</p>
                
                <p>Mit herzlichen Grüßen,<br>
                Ihr Team von Wohlfuehlgesundheit</p>
                
                <div class='footer'>
                    <p>Bei Fragen oder Änderungswünschen kontaktieren Sie uns bitte unter:<br>
                    <a href='mailto:" . ADMIN_EMAIL . "'>" . ADMIN_EMAIL . "</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
        'Reply-To: ' . ADMIN_EMAIL,
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Send email
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if (!$success) {
        error_log('Failed to send user confirmation email to: ' . $to);
    }
}

/**
 * Send notification email to admin
 * 
 * @param array $formData Form data
 * @param array $meetingData Zoom meeting data
 */
function sendAdminNotificationEmail($formData, $meetingData) {
    $to = ADMIN_EMAIL;
    $subject = 'Neue Anamnese & Terminbuchung: ' . $formData['vorname'] . ' ' . $formData['nachname'];
    
    // Format date and time
    $datumFormatiert = date('d.m.Y', strtotime($formData['datum']));
    $startTime = date('H:i', strtotime($meetingData['start_time']));
    
    // Plain text message for admin
    $message = "
Neue Anamnese und Terminbuchung
================================

PERSÖNLICHE DATEN:
------------------
Name: {$formData['vorname']} {$formData['nachname']}
E-Mail: {$formData['email']}
Telefon: {$formData['telefon']}

GESUNDHEITSINFORMATIONEN:
-------------------------
Hauptbeschwerde(n):
{$formData['hauptbeschwerde']}

Vorerkrankungen:
{$formData['vorerkrankungen']}

Aktuelle Medikamente:
{$formData['medikamente']}

Ernährungsgewohnheiten: {$formData['ernaehrung']}

Weitere Anmerkungen:
{$formData['anmerkungen']}

TERMIN-DETAILS:
---------------
Datum: {$datumFormatiert}
Uhrzeit: {$startTime} Uhr
Dauer: {$formData['dauer']} Minuten

ZOOM-MEETING:
-------------
Meeting-ID: {$meetingData['id']}
Passcode: {$meetingData['password']}

Als Host teilnehmen:
{$meetingData['start_url']}

Meeting-Link für Teilnehmer:
{$meetingData['join_url']}

================================
Automatische Benachrichtigung vom Anamnese-System
    ";
    
    // Email headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/plain; charset=UTF-8',
        'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
        'Reply-To: ' . $formData['email'],
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Send email
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if (!$success) {
        error_log('Failed to send admin notification email');
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Send JSON response and exit
 * 
 * @param bool $success Success status
 * @param string $message Message to user
 */
function sendJsonResponse($success, $message) {
    echo json_encode([
        'success' => $success,
        'message' => $message
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ============================================================================
// FUTURE ENHANCEMENTS (TODO)
// ============================================================================

/*
 * Rate Limiting:
 * - Implementieren Sie eine Datenbank oder Redis-basierte Rate-Limiting-Lösung
 * - Begrenzen Sie Anfragen pro IP-Adresse (z.B. max. 5 pro Stunde)
 * 
 * Database Integration:
 * - Speichern Sie alle Buchungen in einer Datenbank
 * - Ermöglichen Sie Admin-Dashboard für Terminverwaltung
 * 
 * Calendar Integration:
 * - Synchronisieren Sie Termine mit Google Calendar oder Outlook
 * - Senden Sie iCal-Anhänge in Bestätigungsmails
 * 
 * SMS Notifications:
 * - Implementieren Sie SMS-Erinnerungen via Twilio oder ähnlichem Service
 * 
 * Webhook für Zoom Events:
 * - Empfangen Sie Webhooks bei Meeting-Start, -Ende, Teilnahme, etc.
 * 
 * DSGVO Compliance:
 * - Implementieren Sie Datenminimierung
 * - Ermöglichen Sie Datenlöschung nach Ablauf
 * - Logging von Verarbeitungsaktivitäten
 */
