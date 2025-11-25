// Supported languages
export type Language = 'en' | 'hr' | 'de' | 'es' | 'fr' | 'it' | 'pt' | 'nl' | 'pl' | 'ru';

export const LANGUAGE_CONFIG: Record<Language, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  hr: { name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
};

// Translation keys
interface Translations {
  // Common
  loading: string;
  error: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  close: string;
  confirm: string;
  yes: string;
  no: string;
  
  // Trainer Selection
  selectTrainer: string;
  createCustomTrainer: string;
  createShort: string;
  builtInTrainers: string;
  customTrainers: string;
  select: string;
  catchphrases: string;
  noCatchphrases: string;
  whyRecommended: string;
  deleteTrainerConfirm: string;
  
  // Chat Interface
  chatHistory: string;
  history: string;
  newChat: string;
  newShort: string;
  profile: string;
  changeTrainer: string;
  change: string;
  askTrainer: string;
  send: string;
  
  // Chat History
  chatHistoryTitle: string;
  newConversation: string;
  noPreviousChats: string;
  chatsCount: string;
  today: string;
  yesterday: string;
  daysAgo: string;
  messages: string;
  clickToDelete: string;
  
  // Plans
  nutritionPlan: string;
  workoutPlan: string;
  generateNutritionPlan: string;
  generateWorkoutPlan: string;
  noPlanYet: string;
  
  // Onboarding
  whatsYourName: string;
  enterName: string;
  preferredLanguage: string;
  iPrefer: string;
  
  // Profile related
  editProfile: string;
  
  // Voice
  recordingVoice: string;
  generatingAudio: string;
  voiceSummary: string;
  clickToPlay: string;
  voiceGenerationFailed: string;
  textSummaryAvailable: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    
    // Trainer Selection
    selectTrainer: 'Select a Trainer',
    createCustomTrainer: '+ Create Custom Trainer',
    createShort: '+ Create',
    builtInTrainers: 'Built-in Trainers',
    customTrainers: 'Custom Trainers',
    select: 'Select',
    catchphrases: 'Catchphrases:',
    noCatchphrases: 'No catchphrases',
    whyRecommended: 'Why recommended:',
    deleteTrainerConfirm: 'Are you sure you want to delete this trainer?',
    
    // Chat Interface
    chatHistory: 'Chat History',
    history: 'History',
    newChat: 'New Chat',
    newShort: 'New',
    profile: 'Profile',
    changeTrainer: 'Change Trainer',
    change: 'Change',
    askTrainer: 'Ask your trainer anything...',
    send: 'Send',
    
    // Chat History
    chatHistoryTitle: '📜 Chat History',
    newConversation: 'New Chat',
    noPreviousChats: 'No previous chats',
    chatsCount: 'chats saved',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',
    messages: 'messages',
    clickToDelete: 'Click again to delete',
    
    // Plans
    nutritionPlan: 'Nutrition Plan',
    workoutPlan: 'Workout Plan',
    generateNutritionPlan: 'Generate Nutrition Plan',
    generateWorkoutPlan: 'Generate Workout Plan',
    noPlanYet: 'No plan yet',
    
    // Onboarding
    whatsYourName: "What's your name?",
    enterName: 'Enter your name',
    preferredLanguage: 'Preferred Language',
    iPrefer: 'I prefer',
    
    // Profile
    editProfile: '✏️ Edit profile',
    
    // Voice
    recordingVoice: 'Recording voice...',
    generatingAudio: 'Generating audio summary',
    voiceSummary: 'Voice Summary',
    clickToPlay: 'Click to play audio summary',
    voiceGenerationFailed: 'Voice generation failed',
    textSummaryAvailable: 'Text summary is still available above',
  },
  
  hr: {
    // Common
    loading: 'Učitavanje...',
    error: 'Greška',
    save: 'Spremi',
    cancel: 'Odustani',
    delete: 'Obriši',
    edit: 'Uredi',
    close: 'Zatvori',
    confirm: 'Potvrdi',
    yes: 'Da',
    no: 'Ne',
    
    // Trainer Selection
    selectTrainer: 'Odaberi Trenera',
    createCustomTrainer: '+ Kreiraj Prilagođenog Trenera',
    createShort: '+ Kreiraj',
    builtInTrainers: 'Ugrađeni Treneri',
    customTrainers: 'Prilagođeni Treneri',
    select: 'Odaberi',
    catchphrases: 'Catchphrases:',
    noCatchphrases: 'Nema catchphrases',
    whyRecommended: 'Zašto preporučamo:',
    deleteTrainerConfirm: 'Jeste li sigurni da želite obrisati ovog trenera?',
    
    // Chat Interface
    chatHistory: 'Povijest Razgovora',
    history: 'Povijest',
    newChat: 'Novi Razgovor',
    newShort: 'Novi',
    profile: 'Profil',
    changeTrainer: 'Promijeni Trenera',
    change: 'Promijeni',
    askTrainer: 'Pitajte svog trenera bilo što...',
    send: 'Pošalji',
    
    // Chat History
    chatHistoryTitle: '📜 Povijest Razgovora',
    newConversation: 'Novi Razgovor',
    noPreviousChats: 'Nema prethodnih razgovora',
    chatsCount: 'razgovora spremljeno',
    today: 'Danas',
    yesterday: 'Jučer',
    daysAgo: 'dana',
    messages: 'poruka',
    clickToDelete: 'Klikni ponovo za brisanje',
    
    // Plans
    nutritionPlan: 'Plan Prehrane',
    workoutPlan: 'Plan Treninga',
    generateNutritionPlan: 'Generiraj Plan Prehrane',
    generateWorkoutPlan: 'Generiraj Plan Treninga',
    noPlanYet: 'Još nema plana',
    
    // Onboarding
    whatsYourName: 'Kako se zoveš?',
    enterName: 'Unesite svoje ime',
    preferredLanguage: 'Preferirani Jezik',
    iPrefer: 'Preferiram',
    
    // Profile
    editProfile: '✏️ Uredi profil',
    
    // Voice
    recordingVoice: 'Snimanje glasa...',
    generatingAudio: 'Generiranje audio sažetka',
    voiceSummary: 'Glasovni Sažetak',
    clickToPlay: 'Kliknite za reprodukciju',
    voiceGenerationFailed: 'Generiranje glasa nije uspjelo',
    textSummaryAvailable: 'Tekstualni sažetak je dostupan iznad',
  },
  
  de: {
    // Common
    loading: 'Laden...',
    error: 'Fehler',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen',
    confirm: 'Bestätigen',
    yes: 'Ja',
    no: 'Nein',
    
    // Trainer Selection
    selectTrainer: 'Trainer auswählen',
    createCustomTrainer: '+ Eigenen Trainer erstellen',
    createShort: '+ Erstellen',
    builtInTrainers: 'Integrierte Trainer',
    customTrainers: 'Eigene Trainer',
    select: 'Auswählen',
    catchphrases: 'Sprüche:',
    noCatchphrases: 'Keine Sprüche',
    whyRecommended: 'Warum empfohlen:',
    deleteTrainerConfirm: 'Sind Sie sicher, dass Sie diesen Trainer löschen möchten?',
    
    // Chat Interface
    chatHistory: 'Chat-Verlauf',
    history: 'Verlauf',
    newChat: 'Neuer Chat',
    newShort: 'Neu',
    profile: 'Profil',
    changeTrainer: 'Trainer wechseln',
    change: 'Wechseln',
    askTrainer: 'Fragen Sie Ihren Trainer...',
    send: 'Senden',
    
    // Chat History
    chatHistoryTitle: '📜 Chat-Verlauf',
    newConversation: 'Neuer Chat',
    noPreviousChats: 'Keine vorherigen Chats',
    chatsCount: 'Chats gespeichert',
    today: 'Heute',
    yesterday: 'Gestern',
    daysAgo: 'Tagen',
    messages: 'Nachrichten',
    clickToDelete: 'Erneut klicken zum Löschen',
    
    // Plans
    nutritionPlan: 'Ernährungsplan',
    workoutPlan: 'Trainingsplan',
    generateNutritionPlan: 'Ernährungsplan erstellen',
    generateWorkoutPlan: 'Trainingsplan erstellen',
    noPlanYet: 'Noch kein Plan',
    
    // Onboarding
    whatsYourName: 'Wie heißt du?',
    enterName: 'Namen eingeben',
    preferredLanguage: 'Bevorzugte Sprache',
    iPrefer: 'Ich bevorzuge',
    
    // Profile
    editProfile: '✏️ Profil bearbeiten',
    
    // Voice
    recordingVoice: 'Aufnahme läuft...',
    generatingAudio: 'Audio wird generiert',
    voiceSummary: 'Sprachzusammenfassung',
    clickToPlay: 'Zum Abspielen klicken',
    voiceGenerationFailed: 'Sprachgenerierung fehlgeschlagen',
    textSummaryAvailable: 'Textzusammenfassung ist oben verfügbar',
  },
  
  es: {
    // Common
    loading: 'Cargando...',
    error: 'Error',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    
    // Trainer Selection
    selectTrainer: 'Seleccionar Entrenador',
    createCustomTrainer: '+ Crear Entrenador Personalizado',
    createShort: '+ Crear',
    builtInTrainers: 'Entrenadores Integrados',
    customTrainers: 'Entrenadores Personalizados',
    select: 'Seleccionar',
    catchphrases: 'Frases:',
    noCatchphrases: 'Sin frases',
    whyRecommended: 'Por qué recomendado:',
    deleteTrainerConfirm: '¿Estás seguro de que quieres eliminar este entrenador?',
    
    // Chat Interface
    chatHistory: 'Historial de Chat',
    history: 'Historial',
    newChat: 'Nuevo Chat',
    newShort: 'Nuevo',
    profile: 'Perfil',
    changeTrainer: 'Cambiar Entrenador',
    change: 'Cambiar',
    askTrainer: 'Pregunta a tu entrenador...',
    send: 'Enviar',
    
    // Chat History
    chatHistoryTitle: '📜 Historial de Chat',
    newConversation: 'Nuevo Chat',
    noPreviousChats: 'No hay chats anteriores',
    chatsCount: 'chats guardados',
    today: 'Hoy',
    yesterday: 'Ayer',
    daysAgo: 'días',
    messages: 'mensajes',
    clickToDelete: 'Haz clic de nuevo para eliminar',
    
    // Plans
    nutritionPlan: 'Plan de Nutrición',
    workoutPlan: 'Plan de Entrenamiento',
    generateNutritionPlan: 'Generar Plan de Nutrición',
    generateWorkoutPlan: 'Generar Plan de Entrenamiento',
    noPlanYet: 'Sin plan aún',
    
    // Onboarding
    whatsYourName: '¿Cómo te llamas?',
    enterName: 'Ingresa tu nombre',
    preferredLanguage: 'Idioma Preferido',
    iPrefer: 'Prefiero',
    
    // Profile
    editProfile: '✏️ Editar perfil',
    
    // Voice
    recordingVoice: 'Grabando voz...',
    generatingAudio: 'Generando resumen de audio',
    voiceSummary: 'Resumen de Voz',
    clickToPlay: 'Haz clic para reproducir',
    voiceGenerationFailed: 'Error en la generación de voz',
    textSummaryAvailable: 'El resumen de texto está disponible arriba',
  },
  
  fr: {
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    
    // Trainer Selection
    selectTrainer: 'Choisir un Coach',
    createCustomTrainer: '+ Créer un Coach Personnalisé',
    createShort: '+ Créer',
    builtInTrainers: 'Coachs Intégrés',
    customTrainers: 'Coachs Personnalisés',
    select: 'Choisir',
    catchphrases: 'Phrases:',
    noCatchphrases: 'Pas de phrases',
    whyRecommended: 'Pourquoi recommandé:',
    deleteTrainerConfirm: 'Êtes-vous sûr de vouloir supprimer ce coach?',
    
    // Chat Interface
    chatHistory: 'Historique des Chats',
    history: 'Historique',
    newChat: 'Nouveau Chat',
    newShort: 'Nouveau',
    profile: 'Profil',
    changeTrainer: 'Changer de Coach',
    change: 'Changer',
    askTrainer: 'Posez une question à votre coach...',
    send: 'Envoyer',
    
    // Chat History
    chatHistoryTitle: '📜 Historique des Chats',
    newConversation: 'Nouveau Chat',
    noPreviousChats: 'Pas de chats précédents',
    chatsCount: 'chats enregistrés',
    today: "Aujourd'hui",
    yesterday: 'Hier',
    daysAgo: 'jours',
    messages: 'messages',
    clickToDelete: 'Cliquez à nouveau pour supprimer',
    
    // Plans
    nutritionPlan: 'Plan Nutritionnel',
    workoutPlan: "Plan d'Entraînement",
    generateNutritionPlan: 'Générer un Plan Nutritionnel',
    generateWorkoutPlan: "Générer un Plan d'Entraînement",
    noPlanYet: 'Pas encore de plan',
    
    // Onboarding
    whatsYourName: 'Comment vous appelez-vous?',
    enterName: 'Entrez votre nom',
    preferredLanguage: 'Langue Préférée',
    iPrefer: 'Je préfère',
    
    // Profile
    editProfile: '✏️ Modifier le profil',
    
    // Voice
    recordingVoice: 'Enregistrement en cours...',
    generatingAudio: 'Génération du résumé audio',
    voiceSummary: 'Résumé Vocal',
    clickToPlay: 'Cliquez pour écouter',
    voiceGenerationFailed: 'Échec de la génération vocale',
    textSummaryAvailable: 'Le résumé textuel est disponible ci-dessus',
  },
  
  it: {
    // Common
    loading: 'Caricamento...',
    error: 'Errore',
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica',
    close: 'Chiudi',
    confirm: 'Conferma',
    yes: 'Sì',
    no: 'No',
    
    // Trainer Selection
    selectTrainer: 'Seleziona Allenatore',
    createCustomTrainer: '+ Crea Allenatore Personalizzato',
    createShort: '+ Crea',
    builtInTrainers: 'Allenatori Integrati',
    customTrainers: 'Allenatori Personalizzati',
    select: 'Seleziona',
    catchphrases: 'Frasi:',
    noCatchphrases: 'Nessuna frase',
    whyRecommended: 'Perché consigliato:',
    deleteTrainerConfirm: 'Sei sicuro di voler eliminare questo allenatore?',
    
    // Chat Interface
    chatHistory: 'Cronologia Chat',
    history: 'Cronologia',
    newChat: 'Nuova Chat',
    newShort: 'Nuova',
    profile: 'Profilo',
    changeTrainer: 'Cambia Allenatore',
    change: 'Cambia',
    askTrainer: 'Chiedi al tuo allenatore...',
    send: 'Invia',
    
    // Chat History
    chatHistoryTitle: '📜 Cronologia Chat',
    newConversation: 'Nuova Chat',
    noPreviousChats: 'Nessuna chat precedente',
    chatsCount: 'chat salvate',
    today: 'Oggi',
    yesterday: 'Ieri',
    daysAgo: 'giorni fa',
    messages: 'messaggi',
    clickToDelete: 'Clicca di nuovo per eliminare',
    
    // Plans
    nutritionPlan: 'Piano Nutrizionale',
    workoutPlan: 'Piano di Allenamento',
    generateNutritionPlan: 'Genera Piano Nutrizionale',
    generateWorkoutPlan: 'Genera Piano di Allenamento',
    noPlanYet: 'Nessun piano ancora',
    
    // Onboarding
    whatsYourName: 'Come ti chiami?',
    enterName: 'Inserisci il tuo nome',
    preferredLanguage: 'Lingua Preferita',
    iPrefer: 'Preferisco',
    
    // Profile
    editProfile: '✏️ Modifica profilo',
    
    // Voice
    recordingVoice: 'Registrazione in corso...',
    generatingAudio: 'Generazione riassunto audio',
    voiceSummary: 'Riassunto Vocale',
    clickToPlay: 'Clicca per riprodurre',
    voiceGenerationFailed: 'Generazione voce fallita',
    textSummaryAvailable: 'Il riassunto testuale è disponibile sopra',
  },
  
  pt: {
    // Common
    loading: 'Carregando...',
    error: 'Erro',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    confirm: 'Confirmar',
    yes: 'Sim',
    no: 'Não',
    
    // Trainer Selection
    selectTrainer: 'Selecionar Treinador',
    createCustomTrainer: '+ Criar Treinador Personalizado',
    createShort: '+ Criar',
    builtInTrainers: 'Treinadores Integrados',
    customTrainers: 'Treinadores Personalizados',
    select: 'Selecionar',
    catchphrases: 'Frases:',
    noCatchphrases: 'Sem frases',
    whyRecommended: 'Por que recomendado:',
    deleteTrainerConfirm: 'Tem certeza de que deseja excluir este treinador?',
    
    // Chat Interface
    chatHistory: 'Histórico de Chat',
    history: 'Histórico',
    newChat: 'Novo Chat',
    newShort: 'Novo',
    profile: 'Perfil',
    changeTrainer: 'Mudar Treinador',
    change: 'Mudar',
    askTrainer: 'Pergunte ao seu treinador...',
    send: 'Enviar',
    
    // Chat History
    chatHistoryTitle: '📜 Histórico de Chat',
    newConversation: 'Novo Chat',
    noPreviousChats: 'Sem chats anteriores',
    chatsCount: 'chats salvos',
    today: 'Hoje',
    yesterday: 'Ontem',
    daysAgo: 'dias atrás',
    messages: 'mensagens',
    clickToDelete: 'Clique novamente para excluir',
    
    // Plans
    nutritionPlan: 'Plano Nutricional',
    workoutPlan: 'Plano de Treino',
    generateNutritionPlan: 'Gerar Plano Nutricional',
    generateWorkoutPlan: 'Gerar Plano de Treino',
    noPlanYet: 'Sem plano ainda',
    
    // Onboarding
    whatsYourName: 'Qual é o seu nome?',
    enterName: 'Digite seu nome',
    preferredLanguage: 'Idioma Preferido',
    iPrefer: 'Eu prefiro',
    
    // Profile
    editProfile: '✏️ Editar perfil',
    
    // Voice
    recordingVoice: 'Gravando voz...',
    generatingAudio: 'Gerando resumo de áudio',
    voiceSummary: 'Resumo de Voz',
    clickToPlay: 'Clique para reproduzir',
    voiceGenerationFailed: 'Falha na geração de voz',
    textSummaryAvailable: 'O resumo de texto está disponível acima',
  },
  
  nl: {
    // Common
    loading: 'Laden...',
    error: 'Fout',
    save: 'Opslaan',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    edit: 'Bewerken',
    close: 'Sluiten',
    confirm: 'Bevestigen',
    yes: 'Ja',
    no: 'Nee',
    
    // Trainer Selection
    selectTrainer: 'Kies een Trainer',
    createCustomTrainer: '+ Maak Aangepaste Trainer',
    createShort: '+ Maken',
    builtInTrainers: 'Ingebouwde Trainers',
    customTrainers: 'Aangepaste Trainers',
    select: 'Selecteren',
    catchphrases: 'Uitspraken:',
    noCatchphrases: 'Geen uitspraken',
    whyRecommended: 'Waarom aanbevolen:',
    deleteTrainerConfirm: 'Weet je zeker dat je deze trainer wilt verwijderen?',
    
    // Chat Interface
    chatHistory: 'Chatgeschiedenis',
    history: 'Geschiedenis',
    newChat: 'Nieuwe Chat',
    newShort: 'Nieuw',
    profile: 'Profiel',
    changeTrainer: 'Trainer Wisselen',
    change: 'Wisselen',
    askTrainer: 'Vraag je trainer...',
    send: 'Versturen',
    
    // Chat History
    chatHistoryTitle: '📜 Chatgeschiedenis',
    newConversation: 'Nieuwe Chat',
    noPreviousChats: 'Geen eerdere chats',
    chatsCount: 'chats opgeslagen',
    today: 'Vandaag',
    yesterday: 'Gisteren',
    daysAgo: 'dagen geleden',
    messages: 'berichten',
    clickToDelete: 'Klik opnieuw om te verwijderen',
    
    // Plans
    nutritionPlan: 'Voedingsplan',
    workoutPlan: 'Trainingsplan',
    generateNutritionPlan: 'Voedingsplan Genereren',
    generateWorkoutPlan: 'Trainingsplan Genereren',
    noPlanYet: 'Nog geen plan',
    
    // Onboarding
    whatsYourName: 'Hoe heet je?',
    enterName: 'Voer je naam in',
    preferredLanguage: 'Voorkeurstaal',
    iPrefer: 'Ik prefereer',
    
    // Profile
    editProfile: '✏️ Profiel bewerken',
    
    // Voice
    recordingVoice: 'Stem opnemen...',
    generatingAudio: 'Audio-samenvatting genereren',
    voiceSummary: 'Stemoverzicht',
    clickToPlay: 'Klik om af te spelen',
    voiceGenerationFailed: 'Stemgeneratie mislukt',
    textSummaryAvailable: 'Tekstsamenvatting is hierboven beschikbaar',
  },
  
  pl: {
    // Common
    loading: 'Ładowanie...',
    error: 'Błąd',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    close: 'Zamknij',
    confirm: 'Potwierdź',
    yes: 'Tak',
    no: 'Nie',
    
    // Trainer Selection
    selectTrainer: 'Wybierz Trenera',
    createCustomTrainer: '+ Utwórz Własnego Trenera',
    createShort: '+ Utwórz',
    builtInTrainers: 'Wbudowani Trenerzy',
    customTrainers: 'Własni Trenerzy',
    select: 'Wybierz',
    catchphrases: 'Hasła:',
    noCatchphrases: 'Brak haseł',
    whyRecommended: 'Dlaczego polecany:',
    deleteTrainerConfirm: 'Czy na pewno chcesz usunąć tego trenera?',
    
    // Chat Interface
    chatHistory: 'Historia Czatu',
    history: 'Historia',
    newChat: 'Nowy Czat',
    newShort: 'Nowy',
    profile: 'Profil',
    changeTrainer: 'Zmień Trenera',
    change: 'Zmień',
    askTrainer: 'Zapytaj trenera...',
    send: 'Wyślij',
    
    // Chat History
    chatHistoryTitle: '📜 Historia Czatu',
    newConversation: 'Nowy Czat',
    noPreviousChats: 'Brak poprzednich czatów',
    chatsCount: 'zapisanych czatów',
    today: 'Dzisiaj',
    yesterday: 'Wczoraj',
    daysAgo: 'dni temu',
    messages: 'wiadomości',
    clickToDelete: 'Kliknij ponownie, aby usunąć',
    
    // Plans
    nutritionPlan: 'Plan Żywieniowy',
    workoutPlan: 'Plan Treningowy',
    generateNutritionPlan: 'Generuj Plan Żywieniowy',
    generateWorkoutPlan: 'Generuj Plan Treningowy',
    noPlanYet: 'Brak planu',
    
    // Onboarding
    whatsYourName: 'Jak masz na imię?',
    enterName: 'Wpisz swoje imię',
    preferredLanguage: 'Preferowany Język',
    iPrefer: 'Wolę',
    
    // Profile
    editProfile: '✏️ Edytuj profil',
    
    // Voice
    recordingVoice: 'Nagrywanie głosu...',
    generatingAudio: 'Generowanie podsumowania audio',
    voiceSummary: 'Podsumowanie Głosowe',
    clickToPlay: 'Kliknij, aby odtworzyć',
    voiceGenerationFailed: 'Generowanie głosu nie powiodło się',
    textSummaryAvailable: 'Podsumowanie tekstowe jest dostępne powyżej',
  },
  
  ru: {
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
    
    // Trainer Selection
    selectTrainer: 'Выбрать Тренера',
    createCustomTrainer: '+ Создать Своего Тренера',
    createShort: '+ Создать',
    builtInTrainers: 'Встроенные Тренеры',
    customTrainers: 'Свои Тренеры',
    select: 'Выбрать',
    catchphrases: 'Фразы:',
    noCatchphrases: 'Нет фраз',
    whyRecommended: 'Почему рекомендуем:',
    deleteTrainerConfirm: 'Вы уверены, что хотите удалить этого тренера?',
    
    // Chat Interface
    chatHistory: 'История Чата',
    history: 'История',
    newChat: 'Новый Чат',
    newShort: 'Новый',
    profile: 'Профиль',
    changeTrainer: 'Сменить Тренера',
    change: 'Сменить',
    askTrainer: 'Спросите тренера...',
    send: 'Отправить',
    
    // Chat History
    chatHistoryTitle: '📜 История Чата',
    newConversation: 'Новый Чат',
    noPreviousChats: 'Нет предыдущих чатов',
    chatsCount: 'чатов сохранено',
    today: 'Сегодня',
    yesterday: 'Вчера',
    daysAgo: 'дней назад',
    messages: 'сообщений',
    clickToDelete: 'Нажмите ещё раз для удаления',
    
    // Plans
    nutritionPlan: 'План Питания',
    workoutPlan: 'План Тренировок',
    generateNutritionPlan: 'Создать План Питания',
    generateWorkoutPlan: 'Создать План Тренировок',
    noPlanYet: 'Пока нет плана',
    
    // Onboarding
    whatsYourName: 'Как вас зовут?',
    enterName: 'Введите ваше имя',
    preferredLanguage: 'Предпочитаемый Язык',
    iPrefer: 'Я предпочитаю',
    
    // Profile
    editProfile: '✏️ Редактировать профиль',
    
    // Voice
    recordingVoice: 'Запись голоса...',
    generatingAudio: 'Генерация аудио',
    voiceSummary: 'Голосовое Резюме',
    clickToPlay: 'Нажмите для воспроизведения',
    voiceGenerationFailed: 'Ошибка генерации голоса',
    textSummaryAvailable: 'Текстовое резюме доступно выше',
  },
};

// Helper function to get translations
export function t(language: Language, key: keyof Translations): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

// Helper function to get all translations for a language
export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}

// Get language name for AI instructions
export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    hr: 'Croatian (Hrvatski)',
    de: 'German (Deutsch)',
    es: 'Spanish (Español)',
    fr: 'French (Français)',
    it: 'Italian (Italiano)',
    pt: 'Portuguese (Português)',
    nl: 'Dutch (Nederlands)',
    pl: 'Polish (Polski)',
    ru: 'Russian (Русский)',
  };
  return names[language] || 'English';
}

