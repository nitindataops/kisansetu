import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  Volume2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  User,
  MessageSquare,
  Tag,
} from 'lucide-react';

import { FarmerDashboardTab, CropListing } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { queryVoiceMandiAssistant } from '../../services/mandiApiService';

interface VoiceAssistantViewProps {
  crops: CropListing[];
  onSelectTab: (tab: FarmerDashboardTab) => void;
  onOpenSellModal: () => void;
  currentLanguage: LanguageCode;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({
  crops,
  onSelectTab,
  onOpenSellModal,
  currentLanguage,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState(
    currentLanguage === 'hi'
      ? 'नमस्ते! मैं किसानसेतु वॉइस असिस्टेंट हूँ। आप मंडी भाव, फसल बेचने, प्रोफाइल या खरीदारों के बारे में पूछ सकते हैं।'
      : 'Hello! I am the KisanSetu Voice Assistant. You can ask about mandi prices, selling crops, your profile, or buyers.'
  );

  const recognitionRef = useRef<any>(null);

  /*
   * Stop all speech currently being played.
   */
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  /*
   * Speak text using browser Speech Synthesis.
   */
  const speakText = (text: string) => {
    if (!text || !text.trim()) {
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn(
        '[KisanSetu Voice] Speech synthesis is not supported.'
      );
      return;
    }

    const synth = window.speechSynthesis;

    synth.cancel();

    const cleanedText = text
      .replace(/[*#_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    const isHindi = currentLanguage === 'hi';

    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = isHindi ? 0.9 : 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synth.getVoices();

    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (isHindi) {
      selectedVoice =
        voices.find(
          (voice) =>
            voice.lang.toLowerCase() === 'hi-in'
        ) ||
        voices.find(
          (voice) =>
            voice.lang.toLowerCase().startsWith('hi')
        ) ||
        voices.find((voice) =>
          /hindi|india|indian/i.test(voice.name)
        );
    } else {
      selectedVoice =
        voices.find(
          (voice) =>
            voice.lang.toLowerCase() === 'en-in'
        ) ||
        voices.find(
          (voice) =>
            voice.lang.toLowerCase().startsWith('en')
        );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);

      console.log(
        '[KisanSetu Voice] Speech started:',
        selectedVoice?.name || 'Browser default'
      );
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error(
        '[KisanSetu Voice] Speech error:',
        event.error
      );

      setIsSpeaking(false);
    };

    synth.speak(utterance);

    /*
     * Chrome sometimes pauses speech automatically.
     * Resume it shortly after starting.
     */
    window.setTimeout(() => {
      if (synth.paused) {
        synth.resume();
      }
    }, 200);
  };

  /*
   * Stop voice systems when component is removed.
   */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Already stopped.
        }

        recognitionRef.current = null;
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /*
   * Process user's voice/text query.
   */
  const handleProcessQuery = async (query: string) => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return;
    }

    setTranscript(cleanQuery);

    const lowerQuery = cleanQuery.toLowerCase();

    /*
     * Mandi-related queries.
     */
    const mandiKeywords = [
      'mandi',
      'भाव',
      'bhav',
      'bhaav',
      'price',
      'rate',
      'daam',
      'कीमत',
      'गेहूं',
      'wheat',
      'धान',
      'rice',
      'basmati',
      'चावल',
      'सरसों',
      'mustard',
      'maize',
      'मक्का',
      'potato',
      'आलू',
      'tomato',
      'टमाटर',
    ];

    const isMandiQuery = mandiKeywords.some((keyword) =>
      lowerQuery.includes(keyword.toLowerCase())
    );

    if (isMandiQuery) {
      try {
        const language: 'hi' | 'en' =
          currentLanguage === 'hi' ? 'hi' : 'en';

        const result = await queryVoiceMandiAssistant(
          cleanQuery,
          language
        );

        const reply =
          result?.reply ||
          result?.message ||
          (currentLanguage === 'hi'
            ? 'माफ़ कीजिए, अभी मंडी की जानकारी उपलब्ध नहीं है।'
            : 'Sorry, mandi information is currently unavailable.');

        setAssistantReply(reply);

        speakText(reply);

        return;
      } catch (error) {
        console.error(
          '[KisanSetu Voice] Mandi assistant error:',
          error
        );

        const fallbackReply =
          currentLanguage === 'hi'
            ? 'माफ़ कीजिए, अभी मंडी की जानकारी प्राप्त नहीं हो पा रही है। कृपया थोड़ी देर बाद दोबारा प्रयास करें।'
            : 'Sorry, live mandi information is temporarily unavailable. Please try again later.';

        setAssistantReply(fallbackReply);
        speakText(fallbackReply);

        return;
      }
    }

    /*
     * Sell crop.
     */
    if (
      lowerQuery.includes('sell') ||
      lowerQuery.includes('बेच') ||
      lowerQuery.includes('बेचना')
    ) {
      const reply =
        currentLanguage === 'hi'
          ? 'आप अपनी फसल बेचने के लिए फसल की जानकारी जोड़ सकते हैं।'
          : 'You can add your crop details to list your crop for sale.';

      setAssistantReply(reply);
      speakText(reply);

      onOpenSellModal();

      return;
    }

    /*
     * Profile.
     */
    if (
      lowerQuery.includes('profile') ||
      lowerQuery.includes('प्रोफाइल')
    ) {
      const reply =
        currentLanguage === 'hi'
          ? 'आप किसान प्रोफाइल सेक्शन में अपनी जानकारी देख और अपडेट कर सकते हैं।'
          : 'You can view and update your farmer information from the profile section.';

      setAssistantReply(reply);
      speakText(reply);

      onSelectTab('profile' as FarmerDashboardTab);

      return;
    }

    /*
     * Orders / buyers.
     */
    if (
      lowerQuery.includes('order') ||
      lowerQuery.includes('ऑर्डर') ||
      lowerQuery.includes('buyer') ||
      lowerQuery.includes('खरीदार')
    ) {
      const reply =
        currentLanguage === 'hi'
          ? 'आप अपने खरीदारों और ऑर्डर की जानकारी किसान डैशबोर्ड से देख सकते हैं।'
          : 'You can view your buyers and orders from your farmer dashboard.';

      setAssistantReply(reply);
      speakText(reply);

      return;
    }

    /*
     * Default response.
     */
    const reply =
      currentLanguage === 'hi'
        ? 'मैं आपकी मदद कर सकता हूँ। आप मंडी भाव, फसल बेचने, प्रोफाइल या खरीदारों के बारे में पूछ सकते हैं।'
        : 'I can help you with mandi prices, selling crops, your profile, and buyers.';

    setAssistantReply(reply);
    speakText(reply);
  };

  /*
   * Start browser speech recognition.
   */
  const handleStartListening = () => {
    stopSpeech();

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const reply =
        currentLanguage === 'hi'
          ? 'आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया Google Chrome या Microsoft Edge का उपयोग करें।'
          : 'Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.';

      setAssistantReply(reply);
      speakText(reply);

      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped.
      }
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.lang =
      currentLanguage === 'hi'
        ? 'hi-IN'
        : 'en-IN';

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log(
        '[KisanSetu Voice] Listening started'
      );

      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const spokenText =
        event?.results?.[0]?.[0]?.transcript || '';

      console.log(
        '[KisanSetu Voice] User said:',
        spokenText
      );

      setIsListening(false);

      if (spokenText.trim()) {
        handleProcessQuery(spokenText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error(
        '[KisanSetu Voice] Recognition error:',
        event?.error
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      console.log(
        '[KisanSetu Voice] Listening ended'
      );

      setIsListening(false);

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        '[KisanSetu Voice] Failed to start recognition:',
        error
      );

      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  /*
   * Speak current assistant response.
   */
  const handleSpeakCurrentReply = () => {
    if (isSpeaking) {
      stopSpeech();
      return;
    }

    speakText(assistantReply);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />

          <h1 className="text-2xl font-bold">
            {currentLanguage === 'hi'
              ? 'वॉइस असिस्टेंट'
              : 'Voice Assistant'}
          </h1>
        </div>

        <p className="mt-1 text-sm opacity-70">
          {currentLanguage === 'hi'
            ? 'बोलकर किसानसेतु से जानकारी प्राप्त करें'
            : 'Talk to KisanSetu using your voice'}
        </p>
      </div>

      {/* Voice control */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            {isSpeaking ? (
              <Volume2 className="h-10 w-10 animate-pulse text-green-700" />
            ) : (
              <Mic className="h-10 w-10 text-green-700" />
            )}
          </div>

          <h2 className="text-xl font-semibold">
            {isListening
              ? currentLanguage === 'hi'
                ? 'मैं सुन रहा हूँ...'
                : 'Listening...'
              : isSpeaking
                ? currentLanguage === 'hi'
                  ? 'मैं बोल रहा हूँ...'
                  : 'Speaking...'
                : currentLanguage === 'hi'
                  ? 'वॉइस असिस्टेंट तैयार है'
                  : 'Voice Assistant Ready'}
          </h2>

          <p className="mt-2 max-w-xl text-sm opacity-70">
            {currentLanguage === 'hi'
              ? 'मंडी भाव, फसल बेचने और किसानसेतु की सुविधाओं के बारे में पूछें।'
              : 'Ask about mandi prices, selling crops, and KisanSetu features.'}
          </p>

          <button
            type="button"
            onClick={handleStartListening}
            disabled={isListening}
            className="mt-6 flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mic className="h-5 w-5" />

            {isListening
              ? currentLanguage === 'hi'
                ? 'सुन रहा हूँ...'
                : 'Listening...'
              : currentLanguage === 'hi'
                ? 'बोलकर पूछें'
                : 'Ask by Voice'}
          </button>
        </div>
      </div>

      {/* User transcript */}
      {transcript && (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />

            <h3 className="font-semibold">
              {currentLanguage === 'hi'
                ? 'आपने पूछा'
                : 'You asked'}
            </h3>
          </div>

          <p className="text-sm opacity-80">
            {transcript}
          </p>
        </div>
      )}

      {/* Assistant response */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
            <Sparkles className="h-6 w-6 text-green-700" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">
                {currentLanguage === 'hi'
                  ? 'किसानसेतु असिस्टेंट'
                  : 'KisanSetu Assistant'}
              </h3>

              <button
                type="button"
                onClick={handleSpeakCurrentReply}
                className="rounded-lg p-2 transition hover:bg-gray-100"
                title={
                  isSpeaking
                    ? 'Stop speaking'
                    : 'Speak response'
                }
                aria-label={
                  isSpeaking
                    ? 'Stop speaking'
                    : 'Speak response'
                }
              >
                <Volume2
                  className={`h-5 w-5 ${
                    isSpeaking
                      ? 'animate-pulse'
                      : ''
                  }`}
                />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 opacity-80">
              {assistantReply}
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() =>
            handleProcessQuery(
              currentLanguage === 'hi'
                ? 'आज मंडी का भाव क्या है?'
                : 'What is the mandi price today?'
            )
          }
          className="rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
        >
          <TrendingUp className="mb-3 h-6 w-6" />

          <h3 className="font-semibold">
            {currentLanguage === 'hi'
              ? 'मंडी भाव'
              : 'Mandi Prices'}
          </h3>

          <p className="mt-1 text-xs opacity-60">
            {currentLanguage === 'hi'
              ? 'आज के भाव पूछें'
              : "Ask today's prices"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenSellModal();
          }}
          className="rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
        >
          <Tag className="mb-3 h-6 w-6" />

          <h3 className="font-semibold">
            {currentLanguage === 'hi'
              ? 'फसल बेचें'
              : 'Sell Crop'}
          </h3>

          <p className="mt-1 text-xs opacity-60">
            {currentLanguage === 'hi'
              ? 'अपनी फसल लिस्ट करें'
              : 'List your crop'}
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            onSelectTab(
              'crops' as FarmerDashboardTab
            )
          }
          className="rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
        >
          <Package className="mb-3 h-6 w-6" />

          <h3 className="font-semibold">
            {currentLanguage === 'hi'
              ? 'मेरी फसलें'
              : 'My Crops'}
          </h3>

          <p className="mt-1 text-xs opacity-60">
            {crops.length}{' '}
            {currentLanguage === 'hi'
              ? 'फसलें उपलब्ध'
              : 'crops available'}
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            onSelectTab(
              'profile' as FarmerDashboardTab
            )
          }
          className="rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
        >
          <User className="mb-3 h-6 w-6" />

          <h3 className="font-semibold">
            {currentLanguage === 'hi'
              ? 'मेरी प्रोफाइल'
              : 'My Profile'}
          </h3>

          <p className="mt-1 text-xs opacity-60">
            {currentLanguage === 'hi'
              ? 'प्रोफाइल देखें'
              : 'View your profile'}
          </p>
        </button>
      </div>

      {/* Voice status */}
      <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <Volume2 className="h-5 w-5" />

        <span className="text-sm">
          {isSpeaking
            ? currentLanguage === 'hi'
              ? 'असिस्टेंट बोल रहा है...'
              : 'Assistant is speaking...'
            : currentLanguage === 'hi'
              ? 'वॉइस असिस्टेंट उपलब्ध है'
              : 'Voice assistant is ready'}
        </span>

        <ArrowRight className="ml-auto h-4 w-4" />
      </div>
    </div>
  );
};

export default VoiceAssistantView;