import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const extensionOptions = [
  'Rear Extension',
  'Loft Conversion',
  'Side Return',
  'Double Storey',
  'Wrap Around',
  'Not Sure Yet',
];

const propertyOptions = [
  'Terraced',
  'Semi-Detached',
  'Detached',
  'Flat / Apartment',
  'Other',
];

const budgetOptions = [
  '£100K – £250K',
  '£250K – £500K',
  '£500K – £1M',
  '£1M+',
];

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
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
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
        onBlur={() => setFocused(false)}
        style={{
          display: 'block',
          width: '100%',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${focused ? '#c9a96e' : 'rgba(0,0,0,0.2)'}`,
          color: '#0a0a0a',
          fontSize: '14px',
          fontWeight: 400,
          padding: '16px 0',
          outline: 'none',
          transition: 'border-bottom-color 0.2s',
        }}
      />
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export default function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedExtension, setSelectedExtension] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const progress = `${step * 25}%`;

  const canNext = () => {
    if (step === 1) return selectedExtension !== '';
    if (step === 2) return selectedProperty !== '';
    if (step === 3) return selectedBudget !== '';
    if (step === 4)
      return formData.firstName.trim() !== '' && formData.email.trim() !== '';
    return false;
  };

  const goNext = () => {
    if (step === 4) { setSubmitted(true); return; }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const stepHeadings: Record<number, string> = {
    1: 'What type of extension are you planning?',
    2: 'What type of property?',
    3: 'What is your approximate investment?',
    4: 'How should we reach you?',
  };

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
          Our specialists will be in touch within 24 hours.
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
                Step {step} of 4
              </p>
              <h3
                style={{
                  fontSize: 'clamp(20px, 2.2vw, 28px)',
                  fontWeight: 900,
                  color: '#0a0a0a',
                  letterSpacing: '-0.02em',
                  marginBottom: '36px',
                }}
              >
                {stepHeadings[step]}
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

                  {step === 2 && (
                    <div
                      className="form-options-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '40px',
                      }}
                    >
                      {propertyOptions.map((opt) => (
                        <SelectCard
                          key={opt}
                          label={opt}
                          selected={selectedProperty === opt}
                          onClick={() => setSelectedProperty(opt)}
                        />
                      ))}
                    </div>
                  )}

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

                  {step === 4 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        marginBottom: '40px',
                      }}
                    >
                      <div
                        className="form-name-grid"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '40px',
                        }}
                      >
                        <TextInput
                          label="First Name"
                          value={formData.firstName}
                          onChange={(v) =>
                            setFormData((f) => ({ ...f, firstName: v }))
                          }
                        />
                        <TextInput
                          label="Last Name"
                          value={formData.lastName}
                          onChange={(v) =>
                            setFormData((f) => ({ ...f, lastName: v }))
                          }
                        />
                      </div>
                      <TextInput
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(v) =>
                          setFormData((f) => ({ ...f, email: v }))
                        }
                      />
                      <TextInput
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(v) =>
                          setFormData((f) => ({ ...f, phone: v }))
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
                  justifyContent: step > 1 ? 'space-between' : 'flex-end',
                  marginTop: '8px',
                }}
              >
                {step > 1 && (
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = '#0a0a0a')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(0,0,0,0.4)')
                    }
                  >
                    ← Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext()}
                  style={{
                    backgroundColor: '#0a0a0a',
                    color: '#ffffff',
                    border: '1px solid #0a0a0a',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '16px 40px',
                    cursor: canNext() ? 'pointer' : 'not-allowed',
                    opacity: canNext() ? 1 : 0.3,
                    transition: 'background-color 0.3s, border-color 0.3s',
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
                  {step === 4 ? 'Book My Consultation →' : 'Next →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
