'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

// Dynamically import ReCAPTCHA only if needed (client-side only)
const ReCAPTCHA = dynamic(
  () => import('react-google-recaptcha'),
  { ssr: false }
);

interface ContactFormData {
  'first-name': string;
  'last-name': string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: 'BUY' | 'RENT';
}

export default function ContactForm() {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    defaultValues: {
      inquiry_type: 'BUY',
    },
  });

  // Get sitekey from environment (client-side only)
  useEffect(() => {
    setRecaptchaSiteKey(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '');
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    // Only require reCAPTCHA if site key is configured
    if (recaptchaSiteKey && !recaptchaValue) {
      setSubmitStatus({ type: 'error', message: 'Please complete the reCAPTCHA verification.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          'g-recaptcha-response': recaptchaValue || '',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: result.message || 'Your message has been sent successfully!' });
        reset();
        setRecaptchaValue(null);
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-form-card">
      <div className="atf-header contact-us-form-header">
        <div className="atfh-header">Send us a Message</div>
      </div>
      {submitStatus && (
        <div className={`notification ${submitStatus.type === 'success' ? 'is-success' : 'is-danger'}`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="contact-us-form-row">
          <div className="contact-us-form-group">
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              id="first-name"
              {...register('first-name', { required: 'First name is required' })}
              placeholder="First Name"
            />
            {errors['first-name'] && (
              <span className="error-message">{errors['first-name'].message}</span>
            )}
          </div>
          <div className="contact-us-form-group">
            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              {...register('last-name', { required: 'Last name is required' })}
              placeholder="Last Name"
            />
            {errors['last-name'] && (
              <span className="error-message">{errors['last-name'].message}</span>
            )}
          </div>
        </div>
        <div className="contact-us-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            placeholder="Your Email"
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>
        <div className="contact-us-form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            placeholder="Your Phone Number"
          />
        </div>
        <div className="contact-us-form-group">
          <label>Inquiry Type</label>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                value="BUY"
                {...register('inquiry_type', { required: true })}
              />
              Buy
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                value="RENT"
                {...register('inquiry_type', { required: true })}
              />
              Rent
            </label>
          </div>
        </div>
        <div className="contact-us-form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows={6}
            {...register('message', { required: 'Message is required' })}
            placeholder="Your Message"
          />
          {errors.message && (
            <span className="error-message">{errors.message.message}</span>
          )}
        </div>
        {recaptchaSiteKey && (
          <div className="contact-us-form-group">
            <ReCAPTCHA
              sitekey={recaptchaSiteKey}
              onChange={(value) => setRecaptchaValue(value)}
            />
          </div>
        )}
        <div className="contact-us-form-submit">
          <button
            type="submit"
            className="ats-nfc-btn"
            style={{ width: '100%', color: 'white' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
