import { computed, ref } from "vue";

export const supportedLanguages = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

const messages = {
    en: {
        nav: { findHelpers: "Find Helpers", bookings: "Bookings", messages: "Messages", dashboard: "Dashboard", login: "Login", signUp: "Sign Up", myProfile: "My Profile", logout: "Logout", language: "Language" },
        home: { emergencySOS: "Emergency SOS", emergencySOSDes:"Instant alert system for safety concerns", liveTracking:"Live Tracking", liveTrackingDes: "Track helper location during active jobs", securePayment: "Secure Payments", ecurePaymentDes: "Escrow-based payment system for your protection", verifiedHelpers: "Verified Helpers",verifiedHelpersDes: "All helpers undergo ID and background verification", heroTitle: "Find Trusted Help\nFor Every Moment", heroSubtitle: "Connect with verified helpers for events, errands, elder care, and more", becomeHelper: "Become a Helper", popularCategories: "Popular Categories", helpersAvailable: "{count} helpers available", topRated: "Top Rated Helpers", trusted: "Verified professionals trusted by thousands", whyChoose: "Why Choose TimeBuddy?", ready: "Ready to Get Started?", join: "Join thousands of satisfied customers and helpers", signUpNow: "Sign Up Now" },
        categories: { title: "Categories", add: "Add Category", name: "Name", description: "Description", icon: "Icon", helpers: "Helpers", actions: "Actions", edit: "Edit", delete: "Delete", create: "Create Category", update: "Edit Category", save: "Save", cancel: "Cancel", loading: "Loading categories...", noCategories: "No categories found", createFirst: "Create your first category", languageName: "Name ({language})", languageDescription: "Description ({language})" },
    },
    hi: {
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
