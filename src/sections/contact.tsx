import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Linkedin, 
  Github, 
  Facebook,
  Send  
} from 'lucide-react';

// Import typów
import type { 
  HomePageData, 
  FormErrors 
} from '../types/types';

// Import hooków
import { useAdvancedInView } from '../hooks/hooks';

// Import konfiguracji
import { ANIMATION_CONFIG } from '../utils/utils';


export const ContactSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '' // Honeypot field - anty-bot
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [cooldownTime, setCooldownTime] = useState(0);

  // Inicjalizacja EmailJS
  useEffect(() => {
    emailjs.init('7K0ksAqXHemL_xEgT');
  }, []);

  // Timer cooldown
  useEffect(() => {
    // Sprawdź localStorage tylko w przeglądarce
    if (typeof window !== 'undefined') {
      const lastSent = window.localStorage ? localStorage.getItem('email_sent_time') : null;
      if (lastSent) {
        const timePassed = Date.now() - parseInt(lastSent);
        const minutesPassed = timePassed / (1000 * 60);
        if (minutesPassed < 5) {
          const remainingSeconds = ANIMATION_CONFIG.COOLDOWN_SECONDS - Math.floor(timePassed / 1000);
          if (remainingSeconds > 0) {
            setCooldownTime(remainingSeconds);
          }
        }
      }
    }

      let interval: NodeJS.Timeout;
      if (cooldownTime > 0) {
        interval = setInterval(() => {
          setCooldownTime(prev => prev - 1);
        }, 1000);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [cooldownTime]);

  // ==========================================
  // 🔍 FUNKCJE WALIDACJI - PROSTE ALE SKUTECZNE
  // ==========================================
  
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Imię i nazwisko jest wymagane';
        if (value.trim().length < 2) return 'Minimum 2 znaki';
        if (value.trim().length > 50) return 'Maximum 50 znaków';
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/.test(value.trim())) return 'Tylko litery, spacje i myślniki';

        return '';

      case 'email':
        if (!value.trim()) return 'Email jest wymagany';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Nieprawidłowy format email';
        return '';

      case 'phone':
        if (!value.trim()) return 'Telefon jest wymagany';
        const digits = value.replace(/\D/g, '');
        if (digits.length < 9) return 'Minimum 9 cyfr';
        return '';

      case 'subject':
        if (!value) return 'Wybierz opcję';
        return '';

      case 'message':
        if (!value.trim()) return 'Wiadomość jest wymagana';
        if (value.trim().length < 10) return 'Minimum 10 znaków';
        if (value.length > 1000) return 'Maximum 1000 znaków';
        return '';

      default:
        return '';
    }
  };

  // Sprawdź czy cały formularz jest ważny
  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    
    // Sprawdź czy wszystkie pola są wypełnione
    const hasAllFields = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value && value.trim() !== '';
    });
    
    // Sprawdź czy nie ma błędów w wypełnionych polach
    const hasNoErrors = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      if (!value || value.trim() === '') return true; // Puste pole = brak błędu na tym etapie
      return validateField(field, value) === '';
    });
    
    return hasAllFields && hasNoErrors;
  };

  // Sprawdź czy można wysłać formularz (uwzględnia cooldown)
  const canSubmit = () => {
    return isFormValid() && !isSubmitting && cooldownTime === 0;
  };

  // ==========================================
  // 📝 OBSŁUGA FORMULARZA
  // ==========================================
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatowanie telefonu w locie
    let formattedValue = value;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 3) {
        formattedValue = digits;
      } else if (digits.length <= 6) {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else if (digits.length <= 9) {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      } else {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Walidacja po zmianie (tylko jeśli pole było już dotknięte)
    if (touchedFields.has(name)) {
      const error = validateField(name, formattedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Reset submit status gdy użytkownik zaczyna pisać ponownie
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Oznacz pole jako dotknięte
    setTouchedFields(prev => new Set(prev).add(name));
    
    // Waliduj pole
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const scrollToContact = () => {
    if (typeof document !== 'undefined') {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sprawdź honeypot (anty-bot)
    if (formData.website) {
      console.log('Bot detected');
      return;
    }

    // Sprawdź cooldown
    if (cooldownTime > 0) {
      return;
    }

    // Waliduj wszystkie pola
    const newErrors: FormErrors = {};
    ['name', 'email', 'phone', 'subject', 'message'].forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouchedFields(new Set(['name', 'email', 'phone', 'subject', 'message']));
      scrollToContact();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      };

    await emailjs.send(
      'service_ax6r24o',
      'template_iay34wr',
      templateParams
    );

      setSubmitStatus('success');
      
       // Sprawdź localStorage przed zapisem
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('email_sent_time', Date.now().toString());
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website: ''
      });
      setErrors({});
      setTouchedFields(new Set());

      // Ustaw cooldown na 300 sekund
      setCooldownTime(ANIMATION_CONFIG.COOLDOWN_SECONDS);
      
      // Zostań w sekcji contact
      setTimeout(() => {
        scrollToContact();
      }, 100);
      
  } catch (error: unknown) {
    console.error('Email send failed:', error);
    
    // Sprawdź czy error ma właściwości których potrzebujesz
    let errorMessage = 'Wystąpił błąd. Spróbuj ponownie lub zadzwoń bezpośrednio.';
    
    // Type guard - sprawdź czy error to obiekt z właściwością status
    if (error && typeof error === 'object' && 'status' in error) {
      const emailError = error as { status: number; text?: string };
      
      if (emailError.status === 429) {
        errorMessage = 'Za dużo zapytań. Poczekaj chwilę i spróbuj ponownie.';
      } else if (emailError.status === 400) {
        errorMessage = 'Nieprawidłowe dane w formularzu. Sprawdź wszystkie pola.';
      }
    }
    
    // Sprawdź czy error ma właściwość text
    if (error && typeof error === 'object' && 'text' in error) {
      const textError = error as { text: string };
      if (textError.text?.includes('network')) {
        errorMessage = 'Problem z połączeniem internetowym. Sprawdź sieć.';
      }
    }
    
    setErrors({ message: errorMessage });
    setSubmitStatus('error');
    scrollToContact();
  } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fill service from URL hash or custom event
  useEffect(() => {
  const checkHash = () => {
    // Sprawdź czy window istnieje
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash;
    if (hash.startsWith('#contact-')) {
      const service = hash.replace('#contact-', '');
      setFormData(prev => ({ ...prev, subject: service }));
    }
  };

  const handleAutoFill = (event: CustomEvent) => {
    const { service } = event.detail;
    
    let message = '';
    
    if (service === 'pakiet') {
      message = 'Jestem zainteresowany/a pakietem 10 godzin z rabatem 20%. Proszę o kontakt w sprawie szczegółów.';
    } else if (service === 'strony-internetowe') {
      message = 'Jestem zainteresowany/a zamówieniem strony internetowej. Proszę o kontakt w sprawie szczegółów projektu, wyceny i terminu realizacji.';
    } else {
      message = `Jestem zainteresowany/a korepetycjami z przedmiotu: ${service}. Proszę o kontakt.`;
    }
    
    setFormData(prev => ({ 
      ...prev, 
      subject: service,
      message: message
    }));

    setTouchedFields(prev => new Set(prev).add('subject').add('message'));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.subject;
      delete newErrors.message;
      return newErrors;
    });
  };
  
  checkHash();
  
  // Sprawdź czy window istnieje przed dodaniem event listenerów
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('autoFillService', handleAutoFill as EventListener);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('autoFillService', handleAutoFill as EventListener);
    };
  }
  }, []);

  return (
    <section ref={ref} id="contact" className="py-20 bg-[#161b22]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
            Kontakt
          </h2>
          <p className="text-xl text-[#c9d1d9] max-w-3xl mx-auto">
            Gotowy na rozpoczęcie nauki lub zamówienie strony? Skontaktuj się ze mną już dziś!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-[#f0f6fc] mb-8">Informacje kontaktowe</h3>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Telefon</div>
                  <a 
                    href={`tel:${data.contact.phone}`}
                    className="text-[#c9d1d9] hover:text-[#1f6feb] transition-colors"
                  >
                    {data.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Email</div>
                  <a 
                    href={`mailto:${data.contact.email}`}
                    className="text-[#c9d1d9] hover:text-[#1f6feb] transition-colors"
                  >
                    {data.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Lokalizacja</div>
                  <div className="text-[#c9d1d9]">{data.contact.location}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <a
                href="https://www.linkedin.com/in/patryk-kulesza-788397354"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Linkedin className="w-6 h-6 text-[#1f6feb]" />
              </a>
              <a
                href="https://github.com/PatrykKul"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Github className="w-6 h-6 text-[#1f6feb]" />
              </a>
              <a
                href="https://www.facebook.com/patryk.kulesza.790"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Facebook className="w-6 h-6 text-[#1f6feb]" />
              </a>
            </div>

            {/* Quick Contact Actions */}
            <div className="mt-8 space-y-3">
              <h4 className="text-xl font-semibold text-[#f0f6fc]">Szybki kontakt:</h4>
              <div className="flex flex-col space-y-2">
                <a
                  href={`tel:${data.contact.phone}`}
                  className="flex items-center px-4 py-2 bg-[#1f6feb]/10 rounded-lg hover:bg-[#1f6feb]/20 transition-colors text-[#1f6feb]"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  <span className="text-xl font-medium">
                    Zadzwoń teraz
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - ukryte pole anty-bot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg"
                >
                  ✅ Wiadomość została wysłana! Odpowiem w ciągu 24 godzin.
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
                >
                  ❌ Wystąpił błąd. Spróbuj ponownie lub zadzwoń bezpośrednio.
                </motion.div>
              )}

              {/* Cooldown Message */}
              {cooldownTime > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-500/20 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg"
                >
                  ⏱️ Poczekaj {cooldownTime} sekund przed wysłaniem kolejnej wiadomości.
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Imię i nazwisko <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors placeholder-[#8b949e] disabled:opacity-50 ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.name && !errors.name
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                    placeholder="Jan Kowalski"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors placeholder-[#8b949e] disabled:opacity-50 ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.email && !errors.email
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                    placeholder="jan@example.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.email}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone Field */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Telefon <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors placeholder-[#8b949e] disabled:opacity-50 ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.phone && !errors.phone
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                    placeholder="123 456 789"
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                {/* Subject Field - DODANA OPCJA STRONY */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Przedmiot/Usługa <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors disabled:opacity-50 ${
                      errors.subject 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.subject && !errors.subject
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                  >
                    <option value="">Wybierz opcję</option>
                    <option value="matematyka">Matematyka</option>
                    <option value="angielski">Angielski</option>
                    <option value="programowanie">Programowanie</option>
                    <option value="strony-internetowe">Strony Internetowe</option>
                    <option value="pakiet">Pakiet 10 godzin</option>
                    <option value="inne">Inne</option>
                  </select>
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.subject}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-[#f0f6fc] font-semibold mb-2">
                  Wiadomość <span className="text-red-400">*</span>
                  <span className={`text-sm font-normal ml-2 ${
                    formData.message.length > 900 ? 'text-orange-400' : 'text-[#8b949e]'
                  }`}>
                    ({formData.message.length}/1000)
                  </span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors resize-vertical placeholder-[#8b949e] disabled:opacity-50 ${
                    errors.message 
                      ? 'border-red-500 focus:border-red-400' 
                      : formData.message && !errors.message
                      ? 'border-green-500 focus:border-green-400'
                      : 'border-[#30363d] focus:border-[#1f6feb]'
                  }`}
                  placeholder="Opisz swoje potrzeby, poziom zaawansowania, cele... (dla stron: typ strony, funkcjonalności, budżet)"
                  maxLength={1000}
                ></textarea>
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center"
                  >
                    <span className="mr-1">⚠️</span>
                    {errors.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!canSubmit()}
                whileHover={canSubmit() ? { scale: 1.02 } : {}}
                whileTap={canSubmit() ? { scale: 0.98 } : {}}
                className={`w-full flex items-center justify-center px-8 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg ${
                  canSubmit()
                    ? 'bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white hover:shadow-xl hover:shadow-[#1f6feb]/25 cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Wysyłanie...
                  </>
                ) : cooldownTime > 0 ? (
                  <>
                    <div className="w-5 h-5 mr-2">⏱️</div>
                    Poczekaj {cooldownTime}s
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Wyślij wiadomość
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;