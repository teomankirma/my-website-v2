import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Link,
} from "@heroui/react";
import type { PortfolioCardProps } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { Hover } from "@/components/common";
import { translations } from "@/i18n";

export const PortfolioCard = ({
  title,
  imageSrc,
  imageAlt,
  dummyText,
  linkHref,
  linkLabel,
  technologies,
  industry,
  date,
}: PortfolioCardProps) => {
  const [open, setOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    const { visualViewport } = window;

    return Math.round((visualViewport?.height ?? window.innerHeight) || 0);
  });
  const isModalOpenRef = useRef(false);
  const { language } = useAppStore();
  const t = translations[language];
  const {
    projectInfo,
    projectDetails,
    link,
    technologies: technologiesLabel,
    industry: industryLabel,
    date: dateLabel,
  } = t.portfolio.cardLabels;

  useEffect(() => {
    isModalOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const { visualViewport } = window;

    const getViewportHeight = () => {
      const nextHeight = Math.round(
        (visualViewport?.height ?? window.innerHeight) || 0
      );

      setViewportHeight((previousHeight) => {
        if (
          previousHeight === nextHeight ||
          isModalOpenRef.current
        ) {
          return previousHeight;
        }

        return nextHeight;
      });
    };

    getViewportHeight();

    window.addEventListener("resize", getViewportHeight);
    visualViewport?.addEventListener("resize", getViewportHeight);

    return () => {
      window.removeEventListener("resize", getViewportHeight);
      visualViewport?.removeEventListener("resize", getViewportHeight);
    };
  }, []);

  const handleOpen = () => {
    if (typeof window !== "undefined") {
      const { visualViewport } = window;
      const nextHeight = Math.round(
        (visualViewport?.height ?? window.innerHeight) || 0
      );

      setViewportHeight((previousHeight) =>
        previousHeight === nextHeight ? previousHeight : nextHeight
      );
    }

    setOpen(true);
  };

  const modalKey = viewportHeight
    ? `portfolio-modal-${viewportHeight}`
    : "portfolio-modal";

  return (
    <>
      <Hover>
        <Card
          shadow="sm"
          isPressable
          onPress={handleOpen}
          className="w-full rounded-2xl overflow-hidden bg-content2 transition-transform will-change-transform"
        >
          <CardBody className="p-0">
            <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-content1">
              <Image
                src={imageSrc}
                alt={imageAlt}
                removeWrapper
                className="h-full w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base md:text-lg font-semibold">{title}</h3>
            </div>
          </CardBody>
        </Card>
      </Hover>

      <Modal
        key={modalKey}
        isOpen={open}
        onOpenChange={setOpen}
        size="3xl"
        scrollBehavior="inside"
        className="bg-content1"
        classNames={{
          closeButton: "cursor-pointer",
          body: "pb-8 md:pb-10",
          wrapper: "items-end sm:items-center",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-xl md:text-2xl font-semibold">
                {title}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="bg-content2 rounded-xl overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      removeWrapper
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg md:text-xl font-semibold">
                      {projectInfo}
                    </h4>
                    <p className="text-foreground/80">{dummyText}</p>
                    <h4 className="text-lg md:text-xl font-semibold">
                      {projectDetails}
                    </h4>
                    <div className="text-foreground/90 divide-y divide-foreground/20">
                      <div className="py-3 flex items-baseline gap-3">
                        <b className="min-w-28 opacity-80">{link}:</b>

                        <Link
                          href={linkHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="success"
                          className="font-semibold"
                        >
                          {linkLabel}
                        </Link>
                      </div>
                      <div className="py-3 flex items-baseline gap-3">
                        <b className="min-w-28 opacity-80">
                          {technologiesLabel}:
                        </b>
                        <span>{technologies}</span>
                      </div>
                      <div className="py-3 flex items-baseline gap-3">
                        <b className="min-w-28 opacity-80">{industryLabel}:</b>
                        <span>{industry}</span>
                      </div>
                      <div className="py-3 flex items-baseline gap-3">
                        <b className="min-w-28 opacity-80">{dateLabel}:</b>
                        <span>{date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
