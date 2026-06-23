import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

type PostcodeSubStep = 'input' | 'loading' | 'result';

const extensionOptions = [
  'Rear Extension',
  'Loft Conversion',
  'Side Return',
  'Double Storey',
  'Wrap Around',
  'Multiple Projects',
];

const serviceOptions = [
  {
    label: 'Design',
    tooltip:
      'Full architectural drawings, 3D renders, planning submissions, and material selections tailored to your home.',
  },
  {
    label: 'Build',
    tooltip:
      'Construction delivered by our in-house team, with contract-backed milestones and a dedicated project manager throughout.',
  },
];

const budgetOptions = ['Under £150K', '£150K – £500K', '£500K – £1M', '£1M+'];

const timelineOptions = [
  'Within 1 Month',
  'Within 3 Months',
  'Within 6 Months',
  'Next Year',
];

const TOTAL_STEPS = 7;

const progressMap: Record<number, string> = {
  1: '14%',
  2: '28%',
  3: '42%',
  4: '57%',
  5: '71%',
  6: '85%',
  7: '100%',
};

const stepHeadings: Record<number, string> = {
  1: 'What type of extension are you planning?',
  2: 'What services do you need?',
  3: 'What is your approximate investment?',
  4: 'When are you looking to start your project?',
  5: 'Location of Your Project',
  6: "What's your name?",
  7: 'Enter your details and we will reach you shortly.',
};

const ukPostcodeRegex = /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]?\s?[0-9][A-Za-z]{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

function validatePostcode(value: string): boolean {
  return ukPostcodeRegex.test(value.trim());
}

function validateEmail(value: string): boolean {
  return emailRegex.test(value.trim());
}

function validatePhone(value: string): boolean {
  const digits = value.replace(/[\s\-]/g, '');
  return /^\d{10,11}$/.test(digits);
}

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '8px' }}>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.35)',
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(0,0,0,0.45)',
          cursor: 'default',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        i
      </span>
      {visible && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            fontSize: '12px',
            lineHeight: 1.55,
            padding: '10px 14px',
            width: '240px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function SelectCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${selected ? '#c9a96e' : hovered ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.12)'}`,
        backgroundColor: selected ? 'rgba(201,169,110,0.08)' : 'transparent',
        color: selected ? '#c9a96e' : '#0a0a0a',
        fontSize: '12px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        padding: '24px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
        width: '100%',
      }}
    >
      {label}
    </button>
  );
}

function TextInput({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(0,0,0,0.45)',
          marginBottom: '8px',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        style={{
          display: 'block',
          width: '100%',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${error ? '#c0392b' : focused ? '#c9a96e' : 'rgba(0,0,0,0.2)'}`,
          color: '#0a0a0a',
          fontSize: '14px',
          fontWeight: 400,
          padding: '16px 0',
          outline: 'none',
          transition: 'border-bottom-color 0.2s',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <p
          style={{
            fontSize: '12px',
            color: '#c0392b',
            marginTop: '6px',
            letterSpacing: 'normal',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

const fadeVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const navBtnBase: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  border: '1px solid #0a0a0a',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '16px 40px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, border-color 0.3s',
};

export default function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedExtension, setSelectedExtension] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState('');
  const [postcode, setPostcode] = useState('');
  const [postcodeBlurred, setPostcodeBlurred] = useState(false);
  const [postcodeError, setPostcodeError] = useState('');
  const [postcodeSubStep, setPostcodeSubStep] = useState<PostcodeSubStep>('input');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [phoneBlurred, setPhoneBlurred] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = progressMap[step] ?? '14%';

  useEffect(() => {
    if (postcodeSubStep === 'loading') {
      const t = setTimeout(() => setPostcodeSubStep('result'), 2000);
      return () => clearTimeout(t);
    }
  }, [postcodeSubStep]);

  const emailValid = validateEmail(formData.email);
  const phoneValid = validatePhone(formData.phone);

  const postcodeBasicValid =
    postcode.trim().length >= 5 && postcode.trim().length <= 8;

  const toggleService = (label: string) => {
    setSelectedServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handlePostcodeBlur = () => {
    setPostcodeBlurred(true);
    if (postcode.trim() !== '' && !validatePostcode(postcode)) {
      setPostcodeError(
        "Please check your postcode — it looks like there might be a typo or extra spaces."
      );
    } else {
      setPostcodeError('');
    }
  };

  const handleCheckAvailability = () => {
    if (!validatePostcode(postcode)) {
      setPostcodeError(
        "Please check your postcode — it looks like there might be a typo or extra spaces."
      );
      return;
    }
    setPostcodeError('');
    setPostcodeSubStep('loading');
  };

  const canNext = () => {
    if (step === 1) return selectedExtension !== '';
    if (step === 2) return selectedServices.length > 0;
    if (step === 3) return selectedBudget !== '';
    if (step === 4) return selectedTimeline !== '';
    if (step === 5) return false;
    if (step === 6) return formData.name.trim() !== '';
    if (step === 7) return emailValid && phoneValid && formData.email.trim() !== '' && formData.phone.trim() !== '';
    return false;
  };

  const goNext = () => {
    if (step === 7) { setSubmitted(true); return; }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 5 && postcodeSubStep !== 'input') {
      setPostcodeSubStep('input');
      return;
    }
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const getStepHeading = () => {
    if (step === 5 && postcodeSubStep === 'loading') return 'Checking Our Availability';
    if (step === 5 && postcodeSubStep === 'result')
      return 'Good news, one of our project managers is available to discuss your enquiry.';
    return stepHeadings[step];
  };

  const showBack = step > 1 && !(step === 5 && postcodeSubStep === 'loading');
  const showNext = step !== 5;

  return (
    <section
      id="consultation"
      style={{ backgroundColor: '#f5f0eb', padding: '100px 0' }}
    >
      <div className="inner">
        <h2
          style={{
            fontSize: 'clamp(34px, 4vw, 52px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Tell Us About Your Project.
        </h2>
        <p
          style={{
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.55)',
            textAlign: 'center',
            marginTop: '16px',
            marginBottom: '60px',
            letterSpacing: 'normal',
          }}
        >
          Let&apos;s check availability in your area.
        </p>

        <div
          className="form-inner"
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            backgroundColor: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '60px 80px',
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ margin: '0 auto 32px' }}
              >
                <circle cx="28" cy="28" r="27" stroke="#c9a96e" strokeWidth="1.5" />
                <path
                  d="M17 28L24 35L39 20"
                  stroke="#c9a96e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2
                style={{
                  fontSize: 'clamp(34px, 4vw, 52px)',
                  fontWeight: 900,
                  color: '#0a0a0a',
                  letterSpacing: '-0.02em',
                  marginBottom: '24px',
                }}
              >
                Thank you.
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: 'rgba(0,0,0,0.6)',
                  lineHeight: 1.7,
                  maxWidth: '500px',
                  margin: '0 auto',
                  letterSpacing: 'normal',
                }}
              >
                Our specialists will be in touch within 24 hours. In the
                meantime, feel free to explore our work or send any information
                ahead of your consultation.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Progress bar */}
              <div
                style={{
                  height: '2px',
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  marginBottom: '48px',
                  position: 'relative',
                }}
              >
                <motion.div
                  animate={{ width: progress }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    backgroundColor: '#c9a96e',
                  }}
                />
              </div>

              {/* Step indicator */}
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(0,0,0,0.4)',
                  marginBottom: '8px',
                }}
              >
                Step {step} of {TOTAL_STEPS}
              </p>

              {/* Heading */}
              <h3
                style={{
                  fontSize: 'clamp(20px, 2.2vw, 28px)',
                  fontWeight: 900,
                  color: '#0a0a0a',
                  letterSpacing: '-0.02em',
                  marginBottom: '36px',
                }}
              >
                {getStepHeading()}
              </h3>

              {/* Animated step content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* STEP 1 — Extension type */}
                  {step === 1 && (
                    <div
                      className="form-options-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '40px',
                      }}
                    >
                      {extensionOptions.map((opt) => (
                        <SelectCard
                          key={opt}
                          label={opt}
                          selected={selectedExtension === opt}
                          onClick={() => setSelectedExtension(opt)}
                        />
                      ))}
                    </div>
                  )}

                  {/* STEP 2 — Services needed */}
                  {step === 2 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        marginBottom: '40px',
                      }}
                    >
                      {serviceOptions.map((opt) => (
                        <label
                          key={opt.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(opt.label)}
                            onChange={() => toggleService(opt.label)}
                            style={{
                              width: '18px',
                              height: '18px',
                              accentColor: '#c9a96e',
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#0a0a0a',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {opt.label}
                          </span>
                          <InfoTooltip text={opt.tooltip} />
                        </label>
                      ))}
                    </div>
                  )}

                  {/* STEP 3 — Investment range */}
                  {step === 3 && (
                    <div
                      className="form-options-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px',
                        marginBottom: '40px',
                      }}
                    >
                      {budgetOptions.map((opt) => (
                        <SelectCard
                          key={opt}
                          label={opt}
                          selected={selectedBudget === opt}
                          onClick={() => setSelectedBudget(opt)}
                        />
                      ))}
                    </div>
                  )}

                  {/* STEP 4 — Timeline */}
                  {step === 4 && (
                    <div
                      className="form-options-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px',
                        marginBottom: '40px',
                      }}
                    >
                      {timelineOptions.map((opt) => (
                        <SelectCard
                          key={opt}
                          label={opt}
                          selected={selectedTimeline === opt}
                          onClick={() => setSelectedTimeline(opt)}
                        />
                      ))}
                    </div>
                  )}

                  {/* STEP 5 — Postcode */}
                  {step === 5 && (
                    <div style={{ marginBottom: '40px' }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={postcodeSubStep}
                          variants={fadeVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                        >
                          {postcodeSubStep === 'input' && (
                            <div>
                              <p
                                style={{
                                  fontSize: '14px',
                                  color: 'rgba(0,0,0,0.55)',
                                  lineHeight: 1.65,
                                  marginBottom: '32px',
                                  letterSpacing: 'normal',
                                }}
                              >
                                Enter your postcode to check our availability.
                              </p>
                              <TextInput
                                label="Postcode"
                                value={postcode}
                                onChange={(v) => {
                                  const filtered = v.replace(/[^A-Za-z0-9 ]/g, '');
                                  setPostcode(filtered);
                                  if (postcodeBlurred && filtered.trim() !== '') {
                                    setPostcodeError(
                                      validatePostcode(filtered)
                                        ? ''
                                        : "Please check your postcode — it looks like there might be a typo or extra spaces."
                                    );
                                  }
                                }}
                                onBlur={handlePostcodeBlur}
                                error={postcodeError}
                              />
                              <button
                                type="button"
                                onClick={handleCheckAvailability}
                                disabled={!postcodeBasicValid}
                                style={{
                                  ...navBtnBase,
                                  marginTop: '32px',
                                  opacity: postcodeBasicValid ? 1 : 0.3,
                                  cursor: postcodeBasicValid ? 'pointer' : 'not-allowed',
                                }}
                                onMouseEnter={(e) => {
                                  if (postcodeBasicValid) {
                                    e.currentTarget.style.backgroundColor = '#c9a96e';
                                    e.currentTarget.style.borderColor = '#c9a96e';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#0a0a0a';
                                  e.currentTarget.style.borderColor = '#0a0a0a';
                                }}
                              >
                                Check Availability
                              </button>
                            </div>
                          )}

                          {postcodeSubStep === 'loading' && (
                            <div style={{ paddingTop: '16px' }}>
                              <div
                                style={{
                                  height: '2px',
                                  backgroundColor: 'rgba(0,0,0,0.08)',
                                  position: 'relative',
                                  marginBottom: '24px',
                                  overflow: 'hidden',
                                }}
                              >
                                <motion.div
                                  initial={{ width: '0%' }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 2, ease: 'linear' }}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    backgroundColor: '#c9a96e',
                                  }}
                                />
                              </div>
                              <p
                                style={{
                                  fontSize: '14px',
                                  color: 'rgba(0,0,0,0.55)',
                                  lineHeight: 1.6,
                                  letterSpacing: 'normal',
                                }}
                              >
                                Checking project manager availability...
                              </p>
                            </div>
                          )}

                          {postcodeSubStep === 'result' && (
                            <div style={{ paddingTop: '8px' }}>
                              <p
                                style={{
                                  fontSize: '14px',
                                  color: 'rgba(0,0,0,0.55)',
                                  lineHeight: 1.65,
                                  marginBottom: '32px',
                                  letterSpacing: 'normal',
                                }}
                              >
                                Let&apos;s get your consultation booked.
                              </p>
                              <button
                                type="button"
                                onClick={goNext}
                                style={{ ...navBtnBase }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#c9a96e';
                                  e.currentTarget.style.borderColor = '#c9a96e';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#0a0a0a';
                                  e.currentTarget.style.borderColor = '#0a0a0a';
                                }}
                              >
                                Continue
                              </button>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}

                  {/* STEP 6 — Name */}
                  {step === 6 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        marginBottom: '40px',
                      }}
                    >
                      <TextInput
                        label="Name"
                        value={formData.name}
                        onChange={(v) => setFormData((f) => ({ ...f, name: v }))}
                      />
                    </div>
                  )}

                  {/* STEP 7 — Contact details */}
                  {step === 7 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        marginBottom: '40px',
                      }}
                    >
                      <TextInput
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(v) => {
                          setFormData((f) => ({ ...f, email: v }));
                        }}
                        onBlur={() => setEmailBlurred(true)}
                        error={
                          emailBlurred && formData.email.trim() !== '' && !emailValid
                            ? 'Please enter a valid email address.'
                            : undefined
                        }
                      />
                      <TextInput
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(v) => {
                          setFormData((f) => ({ ...f, phone: v }));
                        }}
                        onBlur={() => setPhoneBlurred(true)}
                        error={
                          phoneBlurred && formData.phone.trim() !== '' && !phoneValid
                            ? 'Please enter a valid UK phone number.'
                            : undefined
                        }
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent:
                    showBack && showNext
                      ? 'space-between'
                      : showNext
                      ? 'flex-end'
                      : 'flex-start',
                  marginTop: '8px',
                }}
              >
                {showBack && (
                  <button
                    type="button"
                    onClick={goBack}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                      padding: '0',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#0a0a0a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}
                  >
                    ← Back
                  </button>
                )}

                {showNext && (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext()}
                    style={{
                      ...navBtnBase,
                      cursor: canNext() ? 'pointer' : 'not-allowed',
                      opacity: canNext() ? 1 : 0.3,
                    }}
                    onMouseEnter={(e) => {
                      if (canNext()) {
                        e.currentTarget.style.backgroundColor = '#c9a96e';
                        e.currentTarget.style.borderColor = '#c9a96e';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0a0a0a';
                      e.currentTarget.style.borderColor = '#0a0a0a';
                    }}
                  >
                    {step === 7 ? 'Request a Consultation' : 'Next →'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
