'use client';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {ArrowUpRight, ArrowRight, LoaderCircle} from 'lucide-react';
import {toast} from 'sonner';
import {makeContactSchema, type ContactValues} from '@/schemas/contact';
import {EMAIL} from '@/lib/site';
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
export function Contact() {
  const t = useTranslations('contact'),
    v = useTranslations('validation');
  const schema = makeContactSchema({
    name_required: v('name_required'),
    name_min: v('name_min'),
    name_max: v('name_max'),
    email_required: v('email_required'),
    email_invalid: v('email_invalid'),
    email_max: v('email_max'),
    message_required: v('message_required'),
    message_min: v('message_min'),
    message_max: v('message_max'),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<ContactValues>({resolver: zodResolver(schema), mode: 'onTouched'});
  async function submit(values: ContactValues) {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.error(t('toast.notConfiguredTitle'), {
        description: t('toast.notConfiguredDescription'),
      });
      return;
    }
    try {
      const {default: emailjs} = await import('@emailjs/browser');
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {name: values.name, email: values.email, message: values.message},
        {publicKey: PUBLIC_KEY},
      );
      toast.success(t('toast.successTitle'), {description: t('toast.successDescription')});
      reset();
    } catch {
      toast.error(t('toast.failedTitle'), {description: t('toast.failedDescription')});
    }
  }
  return (
    <section id="contact" className="contact-section section-pad" aria-labelledby="contact-title">
      <div className="contact-top" data-reveal>
        <p className="eyebrow">04 / {t('heading')}</p>
        <h2 id="contact-title">
          {t('headlineA')}
          <br />
          <span>
            {t('headlineB')}
            <ArrowUpRight aria-hidden="true" />
          </span>
        </h2>
      </div>
      <div className="contact-grid">
        <div className="contact-copy" data-reveal>
          <p>{t('pitch')}</p>
          <a className="contact-email" href={`mailto:${EMAIL}`}>
            {EMAIL}
            <ArrowUpRight size={20} />
          </a>
          <p className="contact-note">{t('note')}</p>
        </div>
        <form id="contact-form" onSubmit={handleSubmit(submit)} noValidate data-reveal>
          <div className="form-row">
            <label htmlFor="name">{t('nameLabel')}</label>
            <input
              id="name"
              autoComplete="name"
              maxLength={100}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
            />
            {errors.name ? (
              <p id="name-error" className="form-error" role="alert">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="form-row">
            <label htmlFor="email">{t('emailLabel')}</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email ? (
              <p id="email-error" className="form-error" role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="form-row">
            <label htmlFor="message">{t('messageLabel')}</label>
            <textarea
              id="message"
              rows={3}
              maxLength={2000}
              placeholder={t('messagePlaceholder')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              {...register('message')}
            />
            {errors.message ? (
              <p id="message-error" className="form-error" role="alert">
                {errors.message.message}
              </p>
            ) : null}
          </div>
          <button type="submit" className="send-button" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
            {isSubmitting ? (
              <LoaderCircle className="sending-icon" size={18} />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
