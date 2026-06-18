'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import emailjs from '@emailjs/browser';
import {toast} from 'sonner';
import {SiGithub, SiX} from '@icons-pack/react-simple-icons';
import {Section} from '@/components/common/section';
import {SectionHeader} from '@/components/common/section-header';
import {Reveal} from '@/components/common/reveal';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {makeContactSchema, type ContactValues} from '@/schemas/contact';
import {SECTION_IDS, EMAIL, SOCIAL_LINKS} from '@/lib/site';
import {useMagnetic} from '@/lib/animation/use-magnetic';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// LinkedIn SVG (inline, since simple-icons v13 removed it)
function SiLinkedin({className}: {className?: string}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export function Contact() {
  const t = useTranslations('contact');
  const tv = useTranslations('validation');

  const schema = makeContactSchema({
    name_required: tv('name_required'), name_min: tv('name_min'), name_max: tv('name_max'),
    email_required: tv('email_required'), email_invalid: tv('email_invalid'), email_max: tv('email_max'),
    message_required: tv('message_required'), message_min: tv('message_min'), message_max: tv('message_max'),
  });

  const {register, handleSubmit, reset, formState: {errors, isSubmitting, isValid}} =
    useForm<ContactValues>({resolver: zodResolver(schema), mode: 'onChange'});

  const submitRef = useMagnetic<HTMLButtonElement>();

  async function onSubmit(values: ContactValues) {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.warning(t('toast.notConfiguredTitle'), {description: t('toast.notConfiguredDescription')});
      return;
    }
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: values.name,
        email: values.email,
        message: values.message,
      }, {publicKey: PUBLIC_KEY});
      toast.success(t('toast.successTitle'), {description: t('toast.successDescription')});
      reset();
    } catch {
      toast.error(t('toast.failedTitle'), {description: t('toast.failedDescription')});
    }
  }

  return (
    <Section id={SECTION_IDS.contact}>
      <SectionHeader index="04" title={t('heading')} description={t('pitch')} />

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="slideRight">
          <a
            href={`mailto:${EMAIL}`}
            className="group block w-fit text-balance text-3xl font-semibold tracking-tighter md:text-5xl"
          >
            <span className="bg-[length:100%_1px] bg-bottom bg-no-repeat pb-1 [background-image:linear-gradient(var(--color-primary),var(--color-primary))] [background-size:0%_1px] transition-[background-size] duration-300 group-hover:[background-size:100%_1px]">
              {EMAIL}
            </span>
          </a>

          <div className="mt-12">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {t('followMe')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Social href={SOCIAL_LINKS.github} label="GitHub">
                <SiGithub className="size-[1.1rem]" /> GitHub
              </Social>
              <Social href={SOCIAL_LINKS.linkedin} label="LinkedIn">
                <SiLinkedin className="size-[1.1rem]" /> LinkedIn
              </Social>
              <Social href={SOCIAL_LINKS.x} label="X">
                <SiX className="size-[1.1rem]" /> X
              </Social>
            </div>
          </div>
        </Reveal>

        <Reveal variant="slideLeft">
          <form
            id="contact-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t('nameLabel')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">{t('messageLabel')}</Label>
              <Textarea id="message" rows={5} placeholder={t('messagePlaceholder')} {...register('message')} />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>
            <Button ref={submitRef} type="submit" disabled={isSubmitting || !isValid} className="w-fit">
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Social({href, label, children}: {href: string; label: string; children: React.ReactNode}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:bg-secondary/50 hover:text-foreground"
    >
      {children}
    </a>
  );
}
