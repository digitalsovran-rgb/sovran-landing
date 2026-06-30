import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

type PostcodeSubStep = 'input' | 'loading' | 'result';

const extensionOptions = [
  'Loft Conversion',
  'Side Return',
  'Double Storey',
  'Rear Extension',
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

const TOTAL_STEPS = 5;

const progressMap: Record<number, string> = {
  1: '20%',
  2: '40%',
  3: '60%',
  4: '80%',
  5: '100%',
};

const stepHeadings: Record<number, string> = {
  1: 'Select your extension type',
  2: 'What services do you need?',
  3: 'Investment goals',
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
        border: `1px solid ${selected ? '#0a0a0a' : hovered ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.12)'}`,
        backgroundColor: selected ? '#0a0a0a' : 'transparent',
        color: selected ? '#f5f0eb' : '#0a0a0a',
        fontSize: '12px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        padding: '24px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
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

function WheelPicker({
  options,
  value,
  onChange,
  defaultIndex = 0,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  defaultIndex?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const itemRefsRef = useRef<(HTMLDivElement | null)[]>([]);

  const ITEM_HEIGHT = 56;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * 3;
  const PADDING = ITEM_HEIGHT;

  const longestOption = options.reduce((a, b) => a.length > b.length ? a : b, '');
  const PILL_WIDTH = Math.max(150, longestOption.length * 8 + 60);

  const initIdx = value
    ? (options.indexOf(value) === -1 ? defaultIndex : options.indexOf(value))
    : defaultIndex;
  const [centeredIndex, setCenteredIndex] = useState(initIdx);

  // Sets scrollTop synchronously before first paint — no visible jump
  const assignRef = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (el) el.scrollTop = initIdx * ITEM_HEIGHT;
  };

  useEffect(() => {
    if (!value) onChange(options[initIdx]);

    const root = containerRef.current;
    if (!root) return;

    // Fires asynchronously — never blocks scroll momentum
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCenteredIndex(Number((entry.target as HTMLElement).dataset.idx));
          }
        });
      },
      {
        root,
        // Shrink detection box to the exact center row: [56px, 112px] within 168px container
        rootMargin: `-${PADDING}px 0px -${PADDING}px 0px`,
        threshold: 0.5,
      }
    );

    itemRefsRef.current.forEach((el) => { if (el) observer.observe(el); });

    return () => {
      observer.disconnect();
      if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Scroll handler does nothing visual — only commits the settled value after 80ms
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(idx, options.length - 1));
      onChange(options[clamped]);
    }, 80);
  };

  return (
    // isolation: isolate creates a contained stacking context so z-index values
    // below are self-consistent: pill(1) < items(2) < fades(3) < arrow(4)
    <div style={{ position: 'relative', height: `${CONTAINER_HEIGHT}px`, overflow: 'hidden', isolation: 'isolate' } as React.CSSProperties}>
      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${PADDING}px`,
        background: 'linear-gradient(to bottom, rgba(245,240,235,1) 40%, rgba(245,240,235,0))',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: `${PADDING}px`,
        background: 'linear-gradient(to top, rgba(245,240,235,1) 40%, rgba(245,240,235,0))',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Static chevron arrow */}
      <svg
        width="32" height="32" viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <polygon points="4,2 4,22 20,12" fill="#0a0a0a"/>
      </svg>
      {/* Static black pill — permanently anchored at center row, items scroll through it */}
      <div style={{
        position: 'absolute',
        top: `${PADDING}px`,
        left: '54px',
        width: `${PILL_WIDTH}px`,
        maxWidth: 'calc(100% - 58px)',
        height: `${ITEM_HEIGHT}px`,
        backgroundColor: '#0a0a0a',
        borderRadius: '7px',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      {/* Scroll list — no explicit z-index so it doesn't create a stacking context,
          allowing item divs at z:2 to paint above the pill at z:1 */}
      <div
        ref={assignRef}
        onScroll={handleScroll}
        className="wheel-scroll"
        style={{
          height: `${CONTAINER_HEIGHT}px`,
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        <div style={{ height: `${PADDING}px`, flexShrink: 0 }} />
        {options.map((opt, i) => {
          const isCentered = i === centeredIndex;
          return (
            <div
              key={opt}
              data-idx={i}
              ref={(el) => { itemRefsRef.current[i] = el; }}
              style={{
                height: `${ITEM_HEIGHT}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '54px',
                scrollSnapAlign: 'center',
                opacity: isCentered ? 1 : 0.32,
                transition: 'opacity 0.15s ease',
                cursor: 'pointer',
                userSelect: 'none',
                position: 'relative',
                zIndex: 2,
              } as React.CSSProperties}
              onClick={() => {
                containerRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                setCenteredIndex(i);
                onChange(options[i]);
              }}
            >
              <span style={{
                display: 'block',
                width: `${PILL_WIDTH}px`,
                maxWidth: 'calc(100% - 4px)',
                textAlign: 'center',
                fontSize: isCentered ? '17px' : '16px',
                fontWeight: isCentered ? 700 : 400,
                color: isCentered ? '#f5f0eb' : '#0a0a0a',
                letterSpacing: isCentered ? '-0.01em' : 'normal',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
              }}>
                {opt}
              </span>
            </div>
          );
        })}
        <div style={{ height: `${PADDING}px`, flexShrink: 0 }} />
      </div>
    </div>
  );
}

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
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const progress = progressMap[step] ?? '14%';

  useEffect(() => {
    if (postcodeSubStep === 'loading') {
      const t = setTimeout(() => setPostcodeSubStep('result'), 4000);
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
    <>
      <style>{`.wheel-scroll::-webkit-scrollbar { display: none; }`}</style>
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
            marginBottom: '60px',
          }}
        >
          Tell Us About Your Project.
        </h2>
        

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
                Thank You.
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: 'rgba(0,0,0,0.6)',
                  lineHeight: 1.7,
                  maxWidth: '500px',
                  margin: '0 auto 40px',
                  letterSpacing: 'normal',
                }}
              >
                A member of our team will be in touch shortly to discuss your
                project and confirm availability in your area. In the meantime,
                feel free to explore our recent work.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setDirection(1);
                  setSelectedExtension('');
                  setSelectedServices([]);
                  setSelectedBudget('');
                  setSelectedTimeline('');
                  setPostcode('');
                  setPostcodeBlurred(false);
                  setPostcodeError('');
                  setPostcodeSubStep('input');
                  setFormData({ name: '', email: '', phone: '' });
                  setEmailBlurred(false);
                  setPhoneBlurred(false);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0a0a0a',
                  border: '1px solid #0a0a0a',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '16px 40px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0a0a0a';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#0a0a0a';
                }}
              >
                Submit Another Enquiry
              </button>
            </motion.div>
          ) : (
            <>
              {/* Progress bar — only shown on steps 1–5 */}
              {step <= 5 && (
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
              )}

              {/* Step indicator — only shown on steps 1–5 */}
              {step <= 5 && (
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
              )}

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
                    isMobile ? (
                      <div style={{ marginBottom: '40px' }}>
                        <WheelPicker
                          options={extensionOptions}
                          value={selectedExtension}
                          onChange={setSelectedExtension}
                          defaultIndex={Math.floor(extensionOptions.length / 2)}
                        />
                      </div>
                    ) : (
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
                    )
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
                    isMobile ? (
                      <div style={{ marginBottom: '40px' }}>
                        <WheelPicker
                          options={budgetOptions}
                          value={selectedBudget}
                          onChange={setSelectedBudget}
                          defaultIndex={Math.floor(budgetOptions.length / 2)}
                        />
                      </div>
                    ) : (
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
                    )
                  )}

                  {/* STEP 4 — Timeline */}
                  {step === 4 && (
                    isMobile ? (
                      <div style={{ marginBottom: '40px' }}>
                        <WheelPicker
                          options={timelineOptions}
                          value={selectedTimeline}
                          onChange={setSelectedTimeline}
                          defaultIndex={Math.floor(timelineOptions.length / 2)}
                        />
                      </div>
                    ) : (
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
                    )
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
                                  transition={{ duration: 4, ease: 'linear' }}
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
    </>
  );
}
