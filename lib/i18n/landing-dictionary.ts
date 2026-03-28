export type LandingLocale = "es" | "en"

export const LANDING_LOCALE_STORAGE = "welltracker-landing-locale"

export type LandingCopy = {
  localeToggle: { es: string; en: string; label: string }
  authEntry: {
    backAria: string
    headerLabel: string
    sub: string
    create: string
    login: string
    monitoredIntro: string
    monitoredLink: string
    monitoredOutro: string
  }
  nav: { features: string; how: string; audience: string; cta: string }
  hero: {
    badge: string
    title: string
    titleHighlight: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
  }
  stats: { families: string; familiesLabel: string; realtime: string; realtimeLabel: string; secure: string; secureLabel: string }
  purpose: { title: string; body: string }
  audience: { title: string; caregiverTitle: string; caregiverBody: string; recipientTitle: string; recipientBody: string }
  features: { title: string; items: [string, string][] }
  how: { title: string; steps: { title: string; body: string }[] }
  cta: { title: string; body: string; button: string }
  footer: { tagline: string; product: string; legal: string; rights: string; terms: string; privacy: string }
}

const es: LandingCopy = {
  localeToggle: { es: "ES", en: "EN", label: "Idioma" },
  authEntry: {
    backAria: "Volver al inicio",
    headerLabel: "Acceso",
    sub: "Elegí cómo querés continuar: crear una cuenta nueva o ingresar si ya tenés una.",
    create: "Crear cuenta",
    login: "Ya tengo cuenta — Iniciar sesión",
    monitoredIntro: "¿Sos la persona monitoreada? Usá el correo y la contraseña que te dio tu cuidador. ",
    monitoredLink: "Iniciar sesión",
    monitoredOutro: "",
  },
  nav: {
    features: "Funciones",
    how: "Cómo funciona",
    audience: "Para quién",
    cta: "Ingresar",
  },
  hero: {
    badge: "Cuidado conectado en tiempo real",
    title: "La salud de quienes amás,",
    titleHighlight: "visible y tranquila.",
    subtitle:
      "WellTracker alinea al cuidador y a la persona cuidada: medicación, signos vitales, citas, alertas y un QR de emergencia — todo en un solo lugar.",
    primaryCta: "Comenzar",
    secondaryCta: "Ver cómo funciona",
  },
  stats: {
    families: "Familias",
    familiesLabel: "usan WellTracker para coordinarse",
    realtime: "Tiempo real",
    realtimeLabel: "sincronización de datos",
    secure: "Privado",
    secureLabel: "diseñado para el cuidado",
  },
  purpose: {
    title: "¿Por qué WellTracker?",
    body:
      "Reducir la incertidumbre del día a día: saber si tomó la medicación, cómo están los signos vitales y recibir avisos cuando importa. La persona cuidada ve una interfaz simple, con botones grandes y recordatorios claros.",
  },
  audience: {
    title: "Hecho para ambos lados del cuidado",
    caregiverTitle: "Cuidadores",
    caregiverBody:
      "Seguí medicación, vitales, citas y alertas. Enviá mensajes de apoyo y mantené el panorama claro sin hojas sueltas ni grupos de chat perdidos.",
    recipientTitle: "Persona cuidada",
    recipientBody:
      "Confirmá medicación con un toque, consultá tu salud y alertas, y llevá un QR médico con datos críticos por si necesitás ayuda.",
  },
  features: {
    title: "Todo lo esencial, sin ruido",
    items: [
      ["Medicación", "Recordatorios y confirmación del lado del paciente; estado claro para el cuidador."],
      ["Signos vitales", "Pulso, presión, oxígeno, temperatura y actividad en un vistazo."],
      ["Alertas y mensajes", "Avisos urgentes y notificaciones del cuidador cuando haga falta."],
    ] as [string, string][],
  },
  how: {
    title: "Cómo funciona",
    steps: [
      {
        title: "Creá tu acceso",
        body: "El cuidador se registra y puede vincular el perfil de quien cuida.",
      },
      {
        title: "Seguimiento diario",
        body: "Cada uno ve lo que le corresponde: simple para quien recibe cuidado, completo para quien coordina.",
      },
      {
        title: "Actuá a tiempo",
        body: "Alertas, citas y QR de emergencia para cuando los minutos importan.",
      },
    ],
  },
  cta: {
    title: "Empezá cuando quieras",
    body: "Creá tu cuenta o ingresá si ya formás parte de WellTracker.",
    button: "Ingresar",
  },
  footer: {
    tagline: "Cuidado conectado.",
    product: "Producto",
    legal: "Legal",
    rights: "Todos los derechos reservados.",
    terms: "Términos",
    privacy: "Privacidad",
  },
}

const en: LandingCopy = {
  localeToggle: { es: "ES", en: "EN", label: "Language" },
  authEntry: {
    backAria: "Back to home",
    headerLabel: "Access",
    sub: "Choose how to continue: create a new account or sign in if you already have one.",
    create: "Create account",
    login: "I have an account — Sign in",
    monitoredIntro: "Are you the monitored person? Use the email and password your caregiver gave you. ",
    monitoredLink: "Sign in",
    monitoredOutro: "",
  },
  nav: {
    features: "Features",
    how: "How it works",
    audience: "Who it's for",
    cta: "Sign in",
  },
  hero: {
    badge: "Connected care in real time",
    title: "The health of the people you love,",
    titleHighlight: "clear and calm.",
    subtitle:
      "WellTracker aligns caregivers and care recipients: medications, vitals, appointments, alerts, and an emergency QR — all in one place.",
    primaryCta: "Get started",
    secondaryCta: "See how it works",
  },
  stats: {
    families: "Families",
    familiesLabel: "use WellTracker to stay in sync",
    realtime: "Real time",
    realtimeLabel: "data kept in step",
    secure: "Private",
    secureLabel: "built for caregiving",
  },
  purpose: {
    title: "Why WellTracker?",
    body:
      "Reduce day-to-day uncertainty: know if medication was taken, how vitals look, and get notified when it matters. The care recipient gets a simple interface with large buttons and clear reminders.",
  },
  audience: {
    title: "Built for both sides of care",
    caregiverTitle: "Caregivers",
    caregiverBody:
      "Track medications, vitals, appointments, and alerts. Send supportive nudges and keep the full picture without scattered notes or lost chats.",
    recipientTitle: "Care recipient",
    recipientBody:
      "Confirm meds in one tap, check health and alerts, and carry a medical QR with critical info if you need help.",
  },
  features: {
    title: "Everything essential, nothing noisy",
    items: [
      ["Medication", "Reminders and confirmation on the patient side; clear status for the caregiver."],
      ["Vitals", "Heart rate, blood pressure, oxygen, temperature, and activity at a glance."],
      ["Alerts & messages", "Urgent notices and caregiver messages when they matter."],
    ] as [string, string][],
  },
  how: {
    title: "How it works",
    steps: [
      {
        title: "Create access",
        body: "The caregiver signs up and can link the person they support.",
      },
      {
        title: "Daily follow-up",
        body: "Each role sees what they need: simple for the recipient, complete for the coordinator.",
      },
      {
        title: "Act in time",
        body: "Alerts, appointments, and an emergency QR for when minutes count.",
      },
    ],
  },
  cta: {
    title: "Start whenever you’re ready",
    body: "Create an account or sign in if you’re already on WellTracker.",
    button: "Sign in",
  },
  footer: {
    tagline: "Connected care.",
    product: "Product",
    legal: "Legal",
    rights: "All rights reserved.",
    terms: "Terms",
    privacy: "Privacy",
  },
}

export const landingDictionary: Record<LandingLocale, LandingCopy> = { es, en }
