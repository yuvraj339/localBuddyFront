import { computed, ref } from "vue";

export const supportedLanguages = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

const messages = {
    en: {
        chat: {
            messagesTitle: "Messages",
            chatSubtitle: "Chat with helpers and customers",
            searchConversations: "Search conversations...",
            selectConversation: "Select a conversation",
            chooseChatPrompt: "Choose a chat to start messaging",
            typeMessagePlaceholder: "Type a message...",
            sendBtn: "Send"
        },
        auth:{
            setNewPasswordTitle: "Set a new password",
            chooseNewPasswordDesc: "Choose a new password for your TimeBuddy account.",
            newPasswordLabel: "New password",
            passwordHint: "At least 8 characters",
            confirmNewPasswordLabel: "Confirm new password",
            confirmPasswordPlaceholder: "Re-enter your password",
            resetPasswordBtn: "Reset password",
            resetYourPassword: "Reset your password",
            enterEmailInstructions: "Enter your email, and we'll send you instructions to reset your password.",
            resetInstructionsSent: "If an account exists for this email address, password reset instructions have been sent.",
            sendInstructionsBtn: "Send reset instructions",
            welcomeBack: "Welcome Back",signInAccount: "Sign in to your account",emailAddress: "Email Address",password: "Password",phoneNumber: "Phone Number",rememberMe: "Remember me",forgotPassword: "Forgot password?",signIn: "Sign In",noAccount: "Don't have an account? ",createAccountTitle: "Create Account",joinToday: "Join TimeBuddy today",iWantTo: "I want to",findHelp: "Find Help",offerHelp: "Offer Help",fullName: "Full Name",termsAgreement: "I agree to the Terms of Service and Privacy Policy",createAccountBtn: "Create Account",hasAccount: "Already have an account?"
          },
        booking: { cancelBooking:"Cancel Booking",trackLocation:"Track Location",date: "Date",time: "Time",duration: "Duration",message: "Message",total: "Total", myBookings: "My Bookings", myBookingsDes: "View and manage your bookings", no:"No", bookings:"bookings", your:"Your", bookingsDes:" bookings will appear here", findHelpers: "Find Helpers", },
        status: {upcoming: "Upcoming",pending: "Pending",accepted: "Accepted",rejected: "Rejected",in_progress: "In Progress",completed: "Completed",cancelled: "Cancelled",disputed: "Disputed" },
        nav: { findHelpers: "Find Helpers", bookings: "Bookings", messages: "Messages", dashboard: "Dashboard", login: "Login", signUp: "Sign Up", myProfile: "My Profile", logout: "Logout", language: "Language" },
        home: { emergencySOS: "Emergency SOS", emergencySOSDes:"Instant alert system for safety concerns", liveTracking:"Live Tracking", liveTrackingDes: "Track helper location during active jobs", securePayment: "Secure Payments", ecurePaymentDes: "Escrow-based payment system for your protection", verifiedHelpers: "Verified Helpers",verifiedHelpersDes: "All helpers undergo ID and background verification", heroTitle: "Find Trusted Help\nFor Every Moment", heroSubtitle: "Connect with verified helpers for events, errands, elder care, and more", becomeHelper: "Become a Helper", popularCategories: "Popular Categories", helpersAvailable: "{count} helpers available", topRated: "Top Rated Helpers", trusted: "Verified professionals trusted by thousands", whyChoose: "Why Choose TimeBuddy?", ready: "Ready to Get Started?", join: "Join thousands of satisfied customers and helpers", signUpNow: "Sign Up Now" },
        categories: { title: "Categories", add: "Add Category", name: "Name", description: "Description", icon: "Icon", helpers: "Helpers", actions: "Actions", edit: "Edit", delete: "Delete", create: "Create Category", update: "Edit Category", save: "Save", cancel: "Cancel", loading: "Loading categories...", noCategories: "No categories found", createFirst: "Create your first category", languageName: "Name ({language})", languageDescription: "Description ({language})" },
    },
    hi: {
        chat: {
            messagesTitle: "मैसेज",
            chatSubtitle: "हेल्पर और कस्टमर के साथ चैट करें",
            searchConversations: "बातचीत खोजें...",
            selectConversation: "कोई बातचीत चुनें",
            chooseChatPrompt: "मैसेज करना शुरू करने के लिए कोई चैट चुनें",
            typeMessagePlaceholder: "मैसेज लिखें...",
            sendBtn: "भेजें"
        },
        auth:{
            setNewPasswordTitle: "नया पासवर्ड सेट करें",
            chooseNewPasswordDesc: "अपने TimeBuddy अकाउंट के लिए नया पासवर्ड चुनें।",
            newPasswordLabel: "नया पासवर्ड",
            passwordHint: "कम से कम 8 कैरेक्टर",
            confirmNewPasswordLabel: "नया पासवर्ड कन्फ़र्म करें",
            confirmPasswordPlaceholder: "अपना पासवर्ड दोबारा डालें",
            resetPasswordBtn: "पासवर्ड रीसेट करें",
            resetYourPassword: "अपना पासवर्ड रीसेट करें",
            enterEmailInstructions: "अपना ईमेल डालें, और हम आपको पासवर्ड रीसेट करने के निर्देश भेजेंगे।",
            resetInstructionsSent: "अगर इस ईमेल एड्रेस से कोई अकाउंट जुड़ा है, तो पासवर्ड रीसेट करने के निर्देश भेज दिए गए हैं।",
            sendInstructionsBtn: "रीसेट करने के निर्देश भेजें",
            welcomeBack: "वापसी पर स्वागत है", signInAccount: "अपने अकाउंट में साइन इन करें", emailAddress: "ईमेल एड्रेस", password: "पासवर्ड", phoneNumber: "फ़ोन नंबर", rememberMe: "मुझे याद रखें", forgotPassword: "पासवर्ड भूल गए?", signIn: "साइन इन करें", noAccount: "अकाउंट नहीं है? ", createAccountTitle: "अकाउंट बनाएँ", joinToday: "आज ही TimeBuddy से जुड़ें", iWantTo: "मैं चाहता हूँ", findHelp: "मदद ढूँढना", offerHelp: "मदद की पेशकश करना", fullName: "पूरा नाम", termsAgreement: "मैं सेवा की शर्तों और प्राइवेसी पॉलिसी से सहमत हूँ", createAccountBtn: "अकाउंट बनाएँ", hasAccount: "पहले से अकाउंट है?"
          },
        booking: { cancelBooking:"बुकिंग रद्द करें",trackLocation:"लोकेशन ट्रैक करें", date: "तारीख",time: "समय",duration: "अवधि",message: "संदेश",total: "कुल", myBookings: "मेरी बुकिंग्स", myBookingsDes: "अपनी बुकिंग्स देखें और मैनेज करें", no:"नहीं है", bookings:"कोई बुकिंग", your:"आपकी", bookingsDes:" बुकिंग यहाँ दिखाई देंगी", findHelpers: "मदद करने वालों को खोजें"},
        status: {upcoming: "आने वाली",pending: "पेंडिंग",accepted: "स्वीकार की गईं",rejected: "अस्वीकार की गईं",in_progress: "प्रगति पर",completed: "पूरी हो चुकीं",cancelled: "कैंसल की गईं",disputed: "विवादित" },
        nav: { findHelpers: "सहायक खोजें", bookings: "बुकिंग", messages: "संदेश", dashboard: "डैशबोर्ड", login: "लॉग इन", signUp: "साइन अप", myProfile: "मेरी प्रोफ़ाइल", logout: "लॉग आउट", language: "भाषा" },
        home: {  emergencySOS: "इमरजेंसी SOS", emergencySOSDes:"सुरक्षा से जुड़ी चिंताओं के लिए तुरंत अलर्ट करने वाला सिस्टम", liveTracking:"लाइव ट्रैकिंग", liveTrackingDes: "एक्टिव जॉब्स के दौरान हेल्पर की लोकेशन ट्रैक करें", securePayment: "सुरक्षित भुगतान", securePaymentDes: "आपकी सुरक्षा के लिए एस्क्रो-आधारित पेमेंट सिस्टम", verifiedHelpers: "सत्यापित मददगार", verifiedHelpersDes: "सभी हेल्पर्स की ID और बैकग्राउंड की जाँच की जाती है।", heroTitle: "हर पल के लिए\nविश्वसनीय सहायता खोजें", heroSubtitle: "कार्यक्रमों, काम-काज, बुज़ुर्गों की देखभाल और अन्य सेवाओं के लिए सत्यापित सहायकों से जुड़ें", becomeHelper: "सहायक बनें", popularCategories: "लोकप्रिय श्रेणियाँ", helpersAvailable: "{count} सहायक उपलब्ध हैं", topRated: "सर्वश्रेष्ठ रेटेड सहायक", trusted: "हजारों लोगों के विश्वसनीय सत्यापित पेशेवर", whyChoose: "TimeBuddy क्यों चुनें?", ready: "शुरू करने के लिए तैयार हैं?", join: "हजारों संतुष्ट ग्राहकों और सहायकों से जुड़ें", signUpNow: "अभी साइन अप करें" },
        categories: { title: "श्रेणियाँ", add: "श्रेणी जोड़ें", name: "नाम", description: "विवरण", icon: "आइकन", helpers: "सहायक", actions: "कार्रवाइयाँ", edit: "संपादित करें", delete: "हटाएँ", create: "श्रेणी बनाएँ", update: "श्रेणी संपादित करें", save: "सहेजें", cancel: "रद्द करें", loading: "श्रेणियाँ लोड हो रही हैं...", noCategories: "कोई श्रेणी नहीं मिली", createFirst: "अपनी पहली श्रेणी बनाएँ", languageName: "नाम ({language})", languageDescription: "विवरण ({language})" },
    },
};

const selectedLocale = ref(localStorage.getItem("locale") || "en");

function lookup(locale, key) {
    return key.split(".").reduce((value, part) => value?.[part], messages[locale]);
}

export const i18n = {
    locale: computed(() => selectedLocale.value),
    supportedLanguages,
    setLocale(locale) {
        if (!messages[locale]) return;
        selectedLocale.value = locale;
        localStorage.setItem("locale", locale);
        document.documentElement.lang = locale;
    },
    t(key, params = {}) {
        const text = lookup(selectedLocale.value, key) ?? lookup("en", key) ?? key;
        return Object.entries(params).reduce(
            (result, [name, value]) => result.replaceAll(`{${name}}`, value),
            text,
        );
    },
};

export function useI18n() {
    return i18n;
}

export function localizeCategory(category, locale = selectedLocale.value) {
    return {
        name: category.name_translations?.[locale] || category.name_translations?.en || category.name,
        description: category.description_translations?.[locale] || category.description_translations?.en || category.description || "",
    };
}
