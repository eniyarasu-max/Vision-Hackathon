// Firebase Configuration for Vision Hackathon
// -------------------------------------------------------------
// Paste your Firebase web app configuration below.
// You can obtain these keys from the Firebase Console:
// Project Settings > General > Your apps > Web app (</>)
// -------------------------------------------------------------

export const firebaseConfig = {
    apiKey: "AIzaSyD-kDEL1Wp1yJyO_cPZg2x6-qFFm7t4pgU",
    authDomain: "vision-hackathon-f153c.firebaseapp.com",
    projectId: "vision-hackathon-f153c",
    storageBucket: "vision-hackathon-f153c.firebasestorage.app",
    messagingSenderId: "667872339478",
    appId: "1:667872339478:web:d04973a9e8acfbf050b737",
    measurementId: "G-Z1H8TGQL53"
};

// Check if valid credentials are configured
export function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" &&
           firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

// Organizer WhatsApp & Alerts Configuration
export const organizerConfig = {
    whatsappPhone: "917339436468",
    organizerName: "Eniyan S",
    telegramBotToken: "",
    telegramChatId: ""
};
