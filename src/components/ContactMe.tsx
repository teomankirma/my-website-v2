import { PageSection } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations, sharedI18n } from "@/i18n";
import { Button, Input, Textarea, Image, Link, addToast } from "@heroui/react";
import hi from "@/assets/hi.gif";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactDefaultValues,
  makeContactFormSchema,
  type ContactFormSchemaValues,
} from "@/schemas";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const ContactMe = () => {
  const { language, email } = useAppStore();
  const { menuItems, contact, emailLabel } = translations[language];
  const headerLabel = menuItems[5];

  const formSchema = makeContactFormSchema(language);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<ContactFormSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: contactDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async () => {
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        "#contact-form",
        EMAILJS_PUBLIC_KEY
      );
      addToast({
        title: "Message sent",
        description: "Thanks! I will get back to you soon.",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      reset();
    } catch (error) {
      addToast({
        title: "Send failed",
        description: error as string,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  return (
    <PageSection menuIndex={5} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left column: static contact info */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold">{contact.title}</h3>
            <Image
              src={hi}
              alt="Hello gif"
              radius="lg"
              shadow="sm"
              className="w-full h-56 object-cover"
            />

            <div className="flex items-center gap-3">
              <i className="fa-solid fa-envelope text-accent text-lg md:text-xl" />
              <Link
                href={`mailto:${email}`}
                className="text-base md:text-lg font-bold text-decoration-none"
              >
                {email}
              </Link>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                {contact.followMe}
              </h3>
              <div className="flex items-center gap-4 text-xl text-foreground-600">
                <Link
                  href={sharedI18n.socialLinks.x}
                  target="_blank"
                  aria-label="X"
                  className="text-inherit hover:text-accent"
                >
                  <i className="fa-brands fa-x-twitter text-2xl" />
                </Link>
                <Link
                  href={sharedI18n.socialLinks.github}
                  target="_blank"
                  aria-label="GitHub"
                  className="text-inherit hover:text-accent text-2xl"
                >
                  <i className="fa-brands fa-github" />
                </Link>
                <Link
                  href={sharedI18n.socialLinks.linkedin}
                  target="_blank"
                  aria-label="LinkedIn"
                  className="text-inherit hover:text-accent text-2xl"
                >
                  <i className="fa-brands fa-linkedin" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right column: send a note form (UI only) */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold">
              {contact.sendMeANote}
            </h3>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              id="contact-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={contact.yourNameLabel}
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label={emailLabel}
                  type="email"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <Textarea
                label={contact.messageLabel}
                variant="bordered"
                radius="lg"
                placeholder={contact.messagePlaceholder}
                minRows={6}
                size="lg"
                isInvalid={!!errors.message}
                errorMessage={errors.message?.message}
                {...register("message")}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  color="success"
                  size="lg"
                  radius="full"
                  className="text-white px-8"
                  isDisabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                >
                  {contact.sendMessageButton}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageSection>
  );
};
