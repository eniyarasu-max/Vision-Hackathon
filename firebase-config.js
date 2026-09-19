// Firebase Configuration for Vision Hackathon
// -------------------------------------------------------------
// Firebase project: vision-9a49b
// -------------------------------------------------------------

export const firebaseConfig = {
    apiKey: "AIzaSyDDHULArYzoqwH_NZ_skkJ5ztmakg6kfT0",
    authDomain: "vision-9a49b.firebaseapp.com",
    projectId: "vision-9a49b",
    storageBucket: "vision-9a49b.firebasestorage.app",
    messagingSenderId: "528028288699",
    appId: "1:528028288699:web:6a2474a4db5f0a3ed2cb9e",
    measurementId: "G-QP3DMJHPK1"
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
