import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { getSlotCount } from '../utils/slotCount';

// TEST MODE: while true, the form does not send leads to Monday and does not push form_complete or booking events. Set to false before running ad traffic.
const TEST_MODE = true;

// After the lead is sent: confirmation, consultation type, the Calendly calendar, booked.
type AfterView = 'sent' | 'choose' | 'calendly' | 'booked';
type MeetingType = 'virtual' | 'studio';

const CALENDLY_URLS: Record<MeetingType, string> = {
  virtual: 'https://calendly.com/sovranstudio-info/30min',
  studio: 'https://calendly.com/sovranstudio-info/showroom-visit',
};

type FormData = {
  name: string;
  email: string;
  // Digits only, the 10 national digits that follow +44 (no leading 0).
  phone: string;
};

type Screen = 'type' | 'invest' | 'start' | 'loading' | 'result' | 'contact';

const projectTypeOptions = ['New Build', 'Home Extension', 'Home Renovation', 'Basements', 'Multiple Projects'];

// Project types the Monday board has no label for: sent as "Other", with the real type
// appended to the timeline text so it is not lost.
const typesTaggedInTimeline = ['Basements', 'Multiple Projects'];

const budgetOptions = ['£100K – £400K', '£400K – £1M', '£1M+'];

const timelineOptions = ['ASAP', 'Within 1 Month', 'Within 3 Months'];

const DEFAULT_TYPE = 'Home Extension';
const DEFAULT_BUDGET = '£100K – £400K';
const DEFAULT_TIMELINE = 'ASAP';

// Shown under an option's text as a second line. Display only: it is never part of a value.
const budgetNotes: Record<string, string> = { '£100K – £400K': 'Minimum' };

const progressMap: Partial<Record<Screen, string>> = {
  type: '33%',
  invest: '66%',
  start: '100%',
};

const screenHeadings: Record<Screen, string> = {
  type: "I'm looking for:",
  invest: 'My investment',
  start: "I'm ready to hire.",
  loading: 'Checking Our Availability',
  result: 'Good News: Your Design Pack Is Available.',
  contact: 'Enter your details and we will call you shortly.',
};

// UI labels mapped to the values the Monday board understands.
const extensionTypeMap: Record<string, string> = {
  'New Build': 'New Build',
  'Home Extension': 'Extension',
  'Home Renovation': 'Full Renovation',
  Basements: 'Other',
  'Multiple Projects': 'Other',
};

// The server reads the first number and a trailing K from this text.
const budgetMap: Record<string, string> = {
  '£100K – £400K': '£100K',
  '£400K – £1M': '£400K',
  '£1M+': '£1000K',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

type MondaySubmission = {
  name: string;
  email: string;
  phone: string;
  extension: string;
  budget: string;
  timeline: string;
};

type MondaySubmitResult = { ok: true } | { ok: false; error: string };

const SUBMIT_ATTEMPTS = 3;
const SUBMIT_TIMEOUT_MS = 10000;
const SUBMIT_RETRY_DELAY_MS = 500;

// Retries against our own /api/monday-submit endpoint (which itself retries against Monday's
// API server-side). This client-side layer exists because mobile browsers can kill an
// in-flight request outright when a tab backgrounds or the screen locks, which a server-side
// retry alone can't recover from.
async function submitToMonday(data: MondaySubmission): Promise<MondaySubmitResult> {
  let lastError = 'Unknown error';

  for (let attempt = 1; attempt <= SUBMIT_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      const response = await fetch('/api/monday-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
        signal: controller.signal,
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          extensionType: data.extension,
          budget: data.budget,
          timeline: data.timeline,
        }),
      });
      window.clearTimeout(timeoutId);

      const result = await response.json().catch(() => null);
      if (response.ok && result?.ok) {
        return { ok: true };
      }
      lastError = result?.error || `Monday submission failed with status ${response.status}`;
    } catch (err) {
      window.clearTimeout(timeoutId);
      lastError = err instanceof Error ? err.message : 'Unknown submission error';
    }

    if (attempt < SUBMIT_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_RETRY_DELAY_MS));
    }
  }

  console.error('Monday form submission failed after retries:', lastError);
  return { ok: false, error: lastError };
}

function validateEmail(value: string): boolean {
  return emailRegex.test(value.trim());
}

// Reduces whatever was typed or pasted to digits only, dropping a leading 44 country code and
// capping at 11 digits. A leading 0 is kept: "07123 456789" stays 11 digits, while
// "+44 7123 456789" and "7123456789" both become the 10 digit "7123456789".
function normalisePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('44')) digits = digits.slice(2);
  return digits.slice(0, 11);
}

// Valid forms: 11 digits with a leading 0, or 10 digits starting 1 to 9.
function validatePhone(value: string): boolean {
  return /^0\d{10}$/.test(value) || /^[1-9]\d{9}$/.test(value);
}

const optionNoteStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  opacity: 0.6,
  fontWeight: 400,
  lineHeight: 1.2,
  marginTop: '3px',
};

function SelectCard({
  label,
  note,
  selected,
  onClick,
}: {
  label: string;
  note?: string;
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
        color: selected ? 'var(--sov-white)' : '#0a0a0a',
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
      {note && <span style={optionNoteStyle}>{note}</span>}
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
  prefix,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  error?: string;
  prefix?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);

  const underline = `1px solid ${error ? '#c0392b' : focused ? 'var(--sov-greige-dark)' : 'rgba(0,0,0,0.2)'}`;

  const input = (
    <input
      type={type}
      value={value}
      inputMode={inputMode}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      style={{
        display: 'block',
        width: prefix ? undefined : '100%',
        flex: prefix ? 1 : undefined,
        minWidth: 0,
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: prefix ? 'none' : underline,
        color: '#0a0a0a',
        fontSize: '14px',
        fontWeight: 400,
        padding: '16px 0',
        outline: 'none',
        transition: 'border-bottom-color 0.2s',
        boxSizing: 'border-box',
      }}
    />
  );

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
      {prefix ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            borderBottom: underline,
            transition: 'border-bottom-color 0.2s',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#4A443C',
              paddingRight: '10px',
              flex: '0 0 auto',
              userSelect: 'none',
            }}
          >
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
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

const columnLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: 'rgba(0,0,0,0.45)',
  marginBottom: '12px',
};

const navBtnBase: React.CSSProperties = {
  backgroundColor: 'var(--sov-greige-dark)',
  color: '#ffffff',
  border: '1px solid var(--sov-greige-dark)',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '16px 40px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, border-color 0.3s',
};

// Same look as the step headings above the form questions.
const stepHeadingStyle: React.CSSProperties = {
  fontSize: 'clamp(20px, 2.2vw, 28px)',
  fontWeight: 900,
  color: '#0a0a0a',
  letterSpacing: '-0.02em',
  marginBottom: '36px',
};

const backLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '12px',
  fontWeight: 500,
  color: 'rgba(0,0,0,0.4)',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  padding: '0',
  transition: 'color 0.2s',
  whiteSpace: 'nowrap',
  flex: '0 0 auto',
};

function BackLink({ onClick, style }: { onClick: () => void; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...backLinkStyle, ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#0a0a0a')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')}
    >
      ← Back
    </button>
  );
}

// The 64px tick circle shown on the "sent" and "booked" views.
function TickCircle() {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: '1px solid #4A443C',
        display: 'grid',
        placeItems: 'center',
        margin: '0 auto 14px',
      }}
    >
      <Check size={26} strokeWidth={1.6} color="#4A443C" />
    </div>
  );
}

const afterBodyStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 15,
  lineHeight: 1.65,
  color: '#6B655C',
  margin: '14px auto 0',
  maxWidth: 520,
};

function NavButton({
  label,
  onClick,
  disabled,
  grow,
  block,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  grow?: boolean;
  // Full width, used for the post-submit button on mobile.
  block?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...navBtnBase,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        ...(grow ? { flex: '1 1 auto' } : {}),
        ...(block ? { width: '100%' } : {}),
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#0A0A0A';
          e.currentTarget.style.borderColor = '#0A0A0A';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--sov-greige-dark)';
        e.currentTarget.style.borderColor = 'var(--sov-greige-dark)';
      }}
    >
      {label}
    </button>
  );
}

function WheelPicker({
  options,
  value,
  onChange,
  defaultIndex = 0,
  compact = false,
  notes,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  defaultIndex?: number;
  // Same scroll/select interaction, smaller footprint, for use when two pickers sit
  // side-by-side in a narrow column rather than this component's usual near-full-width
  // single-column placement.
  compact?: boolean;
  // Optional second line shown under an option's text. Display only.
  notes?: Record<string, string>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const itemRefsRef = useRef<(HTMLDivElement | null)[]>([]);
  const spanRefsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const ITEM_HEIGHT = 56;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * 3;
  const PADDING = ITEM_HEIGHT;
  const PILL_LEFT = compact ? 30 : 54;
  const ARROW_LEFT = compact ? 6 : 14;
  const SELECTED_FONT_SIZE = compact ? 13 : 17;
  const UNSELECTED_FONT_SIZE = compact ? 12 : 16;

  const longestOption = options.reduce((a, b) => a.length > b.length ? a : b, '');
  const PILL_WIDTH = compact
    ? Math.max(90, longestOption.length * 5.5 + 20)
    : Math.max(150, longestOption.length * 8 + 60);

  const initIdx = value
    ? (options.indexOf(value) === -1 ? defaultIndex : options.indexOf(value))
    : defaultIndex;

  // Mutable ref: tracks which index is highlighted without triggering any re-render
  const centeredIndexRef = useRef<number>(initIdx);

  // Sets scrollTop synchronously before first paint, so there is no visible jump
  const assignRef = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (el) el.scrollTop = initIdx * ITEM_HEIGHT;
  };

  // Imperative highlight update: zero React involvement, zero re-render
  const applyHighlight = (idx: number) => {
    const prevIdx = centeredIndexRef.current;

    if (prevIdx !== idx) {
      const prevDiv = itemRefsRef.current[prevIdx];
      const prevSpan = spanRefsRef.current[prevIdx];
      if (prevDiv) prevDiv.style.opacity = '0.75';
      if (prevSpan) {
        prevSpan.style.color = '#0a0a0a';
        prevSpan.style.fontSize = `${UNSELECTED_FONT_SIZE}px`;
        prevSpan.style.fontWeight = '400';
        prevSpan.style.letterSpacing = 'normal';
      }
    }

    const newDiv = itemRefsRef.current[idx];
    const newSpan = spanRefsRef.current[idx];
    if (newDiv) newDiv.style.opacity = '1';
    if (newSpan) {
      newSpan.style.color = '#0a0a0a';
      newSpan.style.fontSize = `${SELECTED_FONT_SIZE}px`;
      newSpan.style.fontWeight = '700';
      newSpan.style.letterSpacing = '-0.01em';
    }

    centeredIndexRef.current = idx;
  };

  useEffect(() => {
    if (!value) onChange(options[initIdx]);

    const root = containerRef.current;
    if (!root) return;

    // Seed imperative state after mount so centeredIndexRef matches the DOM
    applyHighlight(initIdx);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Direct DOM mutation: no setState, no re-render, momentum unaffected
            applyHighlight(Number((entry.target as HTMLElement).dataset.idx));
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

  // Scroll handler does nothing visual, it only commits the settled value after 80ms
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
    // No isolation/z-index on outer div: stacking order is resolved by siblings below.
    // Layer order (back to front): pill(z:1), scroll container(z:2), fades(z:3), arrow(z:4).
    // The scroll container's transparent background lets the pill show through;
    // item text renders inside the z:2 stacking context, naturally above the z:1 pill.
    <div style={{ position: 'relative', height: `${CONTAINER_HEIGHT}px`, overflow: 'hidden' }}>
      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${PADDING}px`,
        background: 'linear-gradient(to bottom, rgba(255,255,255,1) 40%, rgba(255,255,255,0))',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: `${PADDING}px`,
        background: 'linear-gradient(to top, rgba(255,255,255,1) 40%, rgba(255,255,255,0))',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Static chevron arrow */}
      <svg
        width={compact ? 20 : 32} height={compact ? 20 : 32} viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: `${ARROW_LEFT}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <polygon points="4,2 4,22 20,12" fill="#0a0a0a"/>
      </svg>
      {/* Outlined pill: z:1, behind the scroll container (z:2).
          Transparent fill + dark border frames the selected item without heavy fill. */}
      <div style={{
        position: 'absolute',
        top: `${PADDING}px`,
        left: `${PILL_LEFT}px`,
        width: `${PILL_WIDTH}px`,
        maxWidth: `calc(100% - ${PILL_LEFT + 4}px)`,
        height: `${ITEM_HEIGHT}px`,
        backgroundColor: 'rgba(10,10,10,0.08)',
        border: '2px solid #0a0a0a',
        borderRadius: '7px',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      {/* Scroll list: z:2 sits above the pill so item text is always in front of it.
          touch-action: pan-y ensures vertical swipes scroll the list, never the page. */}
      <div
        ref={assignRef}
        onScroll={handleScroll}
        className="wheel-scroll"
        style={{
          height: `${CONTAINER_HEIGHT}px`,
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          position: 'relative',
          zIndex: 2,
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        <div style={{ height: `${PADDING}px`, flexShrink: 0 }} />
        {options.map((opt, i) => {
          // Static initial styles: applyHighlight overrides these imperatively after mount
          const isInitial = i === initIdx;
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
                paddingLeft: `${PILL_LEFT}px`,
                scrollSnapAlign: 'center',
                opacity: isInitial ? 1 : 0.75,
                transition: 'opacity 0.15s ease',
                cursor: 'pointer',
                userSelect: 'none',
              } as React.CSSProperties}
              onClick={() => {
                containerRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                applyHighlight(i);
                onChange(options[i]);
              }}
            >
              <span
                ref={(el) => { spanRefsRef.current[i] = el; }}
                style={{
                  display: 'block',
                  width: `${PILL_WIDTH}px`,
                  maxWidth: 'calc(100% - 4px)',
                  textAlign: 'center',
                  fontSize: isInitial ? `${SELECTED_FONT_SIZE}px` : `${UNSELECTED_FONT_SIZE}px`,
                  fontWeight: isInitial ? 700 : 400,
                  color: '#0a0a0a',
                  letterSpacing: isInitial ? '-0.01em' : 'normal',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.3,
                }}
              >
                {opt}
                {notes?.[opt] && <span style={optionNoteStyle}>{notes[opt]}</span>}
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
  const [screen, setScreen] = useState<Screen>('type');
  const [direction, setDirection] = useState(1);
  const [selectedType, setSelectedType] = useState(DEFAULT_TYPE);
  const [selectedBudget, setSelectedBudget] = useState(DEFAULT_BUDGET);
  const [selectedTimeline, setSelectedTimeline] = useState(DEFAULT_TIMELINE);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [phoneBlurred, setPhoneBlurred] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  // null while the visitor is still in the form; set once the request has been sent.
  const [after, setAfter] = useState<AfterView | null>(null);
  const [meetingType, setMeetingType] = useState<MeetingType | null>(null);
  // The Calendly message listener is added once, so it reads the meeting type from a ref.
  const meetingTypeRef = useRef<MeetingType | null>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Calendly tells the embedding page when a booking is made.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;
      const data = event.data as { event?: string } | null;
      if (!data || data.event !== 'calendly.event_scheduled') return;
      setDirection(1);
      setAfter('booked');
      if (!TEST_MODE) {
        (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
          event: 'consultation_booked',
          meeting_type: meetingTypeRef.current,
        });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // The availability check is only a short pause before the result screen.
  useEffect(() => {
    if (screen !== 'loading') return;
    const t = setTimeout(() => {
      setDirection(1);
      setScreen('result');
    }, 4000);
    return () => clearTimeout(t);
  }, [screen]);

  const emailValid = validateEmail(formData.email);
  const phoneValid = validatePhone(formData.phone);

  const goTo = (next: Screen, dir: number) => {
    setDirection(dir);
    setScreen(next);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');

    const payload: MondaySubmission = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone.length === 10 ? '0' + formData.phone : formData.phone,
      extension: extensionTypeMap[selectedType] ?? selectedType,
      budget: budgetMap[selectedBudget] ?? selectedBudget,
      timeline: typesTaggedInTimeline.includes(selectedType)
        ? `${selectedTimeline} | Project type: ${selectedType}`
        : selectedTimeline,
    };

    // Test mode: nothing is sent and no form_complete is pushed; the flow continues as if it worked.
    if (TEST_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.info('[TEST_MODE] Submission skipped', payload);
      setSubmitting(false);
      setDirection(1);
      setAfter('sent');
      return;
    }

    const result = await submitToMonday(payload);

    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(
        'Something went wrong submitting your enquiry. Please try again, or contact us directly if the problem continues.'
      );
      return;
    }

    setDirection(1);
    setAfter('sent');
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'form_complete',
        form_name: 'consultation_form'
      });
    }
  };

  const goAfter = (next: AfterView, dir: number) => {
    setDirection(dir);
    setAfter(next);
  };

  const chooseMeeting = (type: MeetingType) => {
    meetingTypeRef.current = type;
    setMeetingType(type);
    goAfter('calendly', 1);
  };

  const calendlySrc = (() => {
    if (!meetingType || typeof window === 'undefined') return '';
    const params = new URLSearchParams({
      embed_domain: window.location.hostname,
      embed_type: 'Inline',
      hide_event_type_details: '1',
      hide_gdpr_banner: '1',
      name: formData.name,
      email: formData.email,
    });
    return `${CALENDLY_URLS[meetingType]}?${params.toString()}`;
  })();

  // Bottom row: which buttons each screen shows and what they do.
  const nav: {
    back?: () => void;
    primary?: { label: string; onClick: () => void; disabled: boolean; grow?: boolean };
  } = (() => {
    switch (screen) {
      case 'type':
        return { primary: { label: 'Next →', onClick: () => goTo('invest', 1), disabled: selectedType === '' } };
      case 'invest':
        return {
          back: () => goTo('type', -1),
          primary: { label: 'Next →', onClick: () => goTo('start', 1), disabled: selectedBudget === '' },
        };
      case 'start':
        return {
          back: () => goTo('invest', -1),
          primary: {
            label: 'Request My Design Pack',
            onClick: () => goTo('loading', 1),
            disabled: selectedTimeline === '',
          },
        };
      case 'result':
        return {
          back: () => goTo('start', -1),
          primary: { label: 'Continue', onClick: () => goTo('contact', 1), disabled: formData.name.trim() === '' },
        };
      case 'contact':
        return {
          back: () => goTo('result', -1),
          primary: {
            label: submitting ? 'Submitting…' : 'Request My Home Design',
            onClick: handleSubmit,
            disabled: !emailValid || !phoneValid || formData.email.trim() === '' || submitting,
            grow: true,
          },
        };
      default:
        return {};
    }
  })();

  const progress = progressMap[screen];

  return (
    <>
      <style>{`
        .wheel-scroll::-webkit-scrollbar { display: none; }
        /* Calendar view on mobile: narrow side padding so the embedded calendar has room. Two
           classes so it outranks the .form-inner mobile padding rule in index.css. */
        @media (max-width: 767px) {
          .form-inner.form-inner-tight { padding-left: 8px !important; padding-right: 8px !important; }
        }
      `}</style>
      <section
        id="consultation"
        data-bg="light"
        style={{ backgroundColor: 'var(--sov-white)', padding: '100px 0' }}
      >
      <div className="inner">
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--sov-greige-dark)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          Limited Availability This Month
        </p>
        <p
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#0a0a0a',
            textAlign: 'center',
            letterSpacing: '-0.01em',
            marginBottom: '32px',
          }}
        >
          Only {getSlotCount()} slots remain.
        </p>
        <h2
          style={{
            fontSize: 'clamp(34px, 4vw, 52px)',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            marginBottom: 0,
          }}
        >
          Get My Design Pack.
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: '14px',
            letterSpacing: '0.04em',
            color: '#6B655C',
            margin: '14px 0 0',
            fontWeight: 400,
          }}
        >
          The first step to your new home.
        </p>

        <div
          className={after === 'calendly' ? 'form-inner form-inner-tight' : 'form-inner'}
          style={{
            maxWidth: '860px',
            margin: '60px auto 0',
            backgroundColor: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '60px 80px',
          }}
        >
          {after !== null ? (
            // Post-submit flow. Same slide transition as the form steps; no progress bar.
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={after}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {after === 'sent' && (
                  <div style={{ textAlign: 'center' }}>
                    <TickCircle />
                    <p
                      style={{
                        textTransform: 'uppercase',
                        fontSize: 13,
                        letterSpacing: '0.18em',
                        fontWeight: 600,
                        color: '#0A0A0A',
                        margin: '0 0 18px',
                      }}
                    >
                      Sent
                    </p>
                    <h3 style={{ ...stepHeadingStyle, textAlign: 'center', marginBottom: 0 }}>
                      Your Design Pack Request Has Been Received.
                    </h3>
                    <p style={afterBodyStyle}>
                      Our team will call you shortly to talk through your project. Alternatively, if you would
                      like to discuss your ideas with one of our design and build specialists, you can book a
                      consultation now.
                    </p>
                    <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
                      <NavButton
                        label="Next Step →"
                        onClick={() => goAfter('choose', 1)}
                        disabled={false}
                        block={isMobile}
                      />
                    </div>
                  </div>
                )}

                {after === 'choose' && (
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ ...stepHeadingStyle, marginBottom: 0 }}>Consultation Type</h3>
                    <p style={{ ...columnLabelStyle, margin: '18px 0 12px' }}>I&apos;m interested in:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(
                        [
                          { type: 'virtual', label: 'Virtual Meeting' },
                          { type: 'studio', label: 'Visit Our Studio' },
                        ] as { type: MeetingType; label: string }[]
                      ).map((option) => (
                        <button
                          key={option.type}
                          type="button"
                          onClick={() => chooseMeeting(option.type)}
                          onMouseEnter={(e) => {
                            if (!isMobile) e.currentTarget.style.borderColor = '#4A443C';
                          }}
                          onMouseLeave={(e) => {
                            if (!isMobile) e.currentTarget.style.borderColor = 'rgba(10,10,10,0.15)';
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '18px 20px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(10,10,10,0.15)',
                            borderRadius: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: 16,
                            color: '#0A0A0A',
                            transition: 'border-color 0.2s',
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              flex: '0 0 auto',
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: '1.5px solid #6B655C',
                            }}
                          />
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <BackLink onClick={() => goAfter('sent', -1)} style={{ marginTop: 20 }} />
                  </div>
                )}

                {after === 'calendly' && (
                  <div>
                    <BackLink onClick={() => goAfter('choose', -1)} style={{ marginBottom: 12 }} />
                    <iframe
                      title="Book your consultation"
                      src={calendlySrc}
                      width="100%"
                      height={isMobile ? 760 : 700}
                      loading="lazy"
                      style={{ border: 0, display: 'block', width: '100%' }}
                    />
                  </div>
                )}

                {after === 'booked' && (
                  <div style={{ textAlign: 'center' }}>
                    <TickCircle />
                    <h3 style={{ ...stepHeadingStyle, textAlign: 'center', marginBottom: 0 }}>
                      You&apos;re Booked In.
                    </h3>
                    <p style={afterBodyStyle}>
                      A confirmation is on its way to your inbox. We look forward to meeting you.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              {/* Progress bar: only on the three question screens */}
              {progress && (
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
                      backgroundColor: 'var(--sov-greige-dark)',
                    }}
                  />
                </div>
              )}

              {/* Heading */}
              <h3 style={stepHeadingStyle}>{screenHeadings[screen]}</h3>

              {/* Animated screen content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={screen}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* SCREEN 1: project type */}
                  {screen === 'type' &&
                    (isMobile ? (
                      <div style={{ marginBottom: '40px' }}>
                        <WheelPicker
                          options={projectTypeOptions}
                          value={selectedType}
                          onChange={setSelectedType}
                          defaultIndex={projectTypeOptions.indexOf(DEFAULT_TYPE)}
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
                        {projectTypeOptions.map((opt, i) => {
                          // With an odd number of options in two columns, the last card spans
                          // the full row instead of sitting alone in one column.
                          const spansRow =
                            projectTypeOptions.length % 2 === 1 && i === projectTypeOptions.length - 1;
                          return (
                            <div key={opt} style={spansRow ? { gridColumn: '1 / -1' } : undefined}>
                              <SelectCard
                                label={opt}
                                selected={selectedType === opt}
                                onClick={() => setSelectedType(opt)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}

                  {/* SCREEN 2: investment */}
                  {screen === 'invest' && (
                    <div style={{ marginBottom: '40px' }}>
                      {isMobile ? (
                        <WheelPicker
                          options={budgetOptions}
                          value={selectedBudget}
                          onChange={setSelectedBudget}
                          defaultIndex={budgetOptions.indexOf(DEFAULT_BUDGET)}
                          notes={budgetNotes}
                        />
                      ) : (
                        <div
                          className="form-options-grid"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${budgetOptions.length}, 1fr)`,
                            gap: '12px',
                          }}
                        >
                          {budgetOptions.map((opt) => (
                            <SelectCard
                              key={opt}
                              label={opt}
                              note={budgetNotes[opt]}
                              selected={selectedBudget === opt}
                              onClick={() => setSelectedBudget(opt)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SCREEN 3: start date */}
                  {screen === 'start' && (
                    <div style={{ marginBottom: '40px' }}>
                      <p style={columnLabelStyle}>My start date</p>
                      {isMobile ? (
                        <WheelPicker
                          options={timelineOptions}
                          value={selectedTimeline}
                          onChange={setSelectedTimeline}
                          defaultIndex={timelineOptions.indexOf(DEFAULT_TIMELINE)}
                        />
                      ) : (
                        <div
                          className="form-options-grid"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${timelineOptions.length}, 1fr)`,
                            gap: '12px',
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
                    </div>
                  )}

                  {/* LOADING: short availability pause with a filling bar */}
                  {screen === 'loading' && (
                    <div style={{ paddingTop: '16px', marginBottom: '40px' }}>
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
                            backgroundColor: 'var(--sov-greige-dark)',
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--sov-grey)',
                          lineHeight: 1.6,
                          letterSpacing: 'normal',
                        }}
                      >
                        Checking availability for your design pack...
                      </p>
                    </div>
                  )}

                  {/* RESULT: good news message and the name field */}
                  {screen === 'result' && (
                    <div style={{ paddingTop: '8px', marginBottom: '40px' }}>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--sov-grey)',
                          lineHeight: 1.65,
                          marginBottom: '32px',
                          letterSpacing: 'normal',
                        }}
                      >
                        One of our team will be in touch to begin your design pack, with floor plans, 3D
                        visuals, a mood board and a full proposal built around your home.
                      </p>
                      <TextInput
                        label="Name"
                        value={formData.name}
                        onChange={(v) => setFormData((f) => ({ ...f, name: v }))}
                      />
                    </div>
                  )}

                  {/* CONTACT: email and phone */}
                  {screen === 'contact' && (
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
                        prefix="+44"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={formData.phone}
                        onChange={(v) => {
                          setFormData((f) => ({ ...f, phone: normalisePhone(v) }));
                        }}
                        onBlur={() => setPhoneBlurred(true)}
                        error={
                          phoneBlurred && formData.phone !== '' && !phoneValid
                            ? 'Please enter a valid UK phone number.'
                            : undefined
                        }
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Submission error: contact screen only, shown after a failed Monday submission */}
              {screen === 'contact' && submitError && (
                <p
                  style={{
                    fontSize: '13px',
                    color: '#c0392b',
                    marginBottom: '16px',
                    letterSpacing: 'normal',
                    lineHeight: 1.5,
                  }}
                >
                  {submitError}
                </p>
              )}

              {/* Navigation */}
              {(nav.back || nav.primary) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    justifyContent: nav.back ? 'space-between' : 'flex-end',
                    marginTop: '8px',
                  }}
                >
                  {nav.back && <BackLink onClick={nav.back} />}

                  {nav.primary && (
                    <NavButton
                      label={nav.primary.label}
                      onClick={nav.primary.onClick}
                      disabled={nav.primary.disabled}
                      grow={nav.primary.grow}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </section>
    </>
  );
}
