"use client";

import BlurSection from "@/components/animations/BlurSection";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  CommonScrollAnimated,
  CommonCardBatchAnimated,
} from "@/components/animations/CommonScrollAnimated";
import TextScramble from "@/components/animations/TextScramble";

type CursorTheme = "bordo" | "white" | "purple" | "black-green";

type Project = {
  slug: string;
  name: string;
  href: string;
  external: boolean;
  outcome: string;
  tags: string[];
  cover: string;
  cursorTheme: CursorTheme;
  description: string;
};

const PROJECTS: Project[] = [
  {
    slug: "kapsulezakafu",
    name: "Kapsule za kafu",
    href: "https://kapsulezakafu.rs",
    external: true,
    outcome: "Live store, 421k capsules sold",
    tags: ["Next.js", "PostgreSQL", "E-commerce", "Self-hosted", "SEO"],
    cover: "/img/technityze/work/kapsulezakafu.png",
    cursorTheme: "bordo",
    description:
      "End-to-end coffee capsule e-commerce for the Serbian market. Custom Next.js storefront with a postgres database, in-house admin panel for orders and inventory, hosted on our own Hetzner server. No Shopify or WooCommerce dependency.",
  },
  {
    slug: "careerpaths",
    name: "CareerPaths",
    href: "https://careerpaths.rs",
    external: true,
    outcome: "300+ families consulted",
    tags: ["WordPress", "Elementor", "Lead gen", "SEO"],
    cover: "/img/technityze/work/careerpaths.png",
    cursorTheme: "white",
    description:
      "Lead generation site for a study-abroad consultancy. WordPress + Elementor build with a focused on-page SEO strategy, CRM integration and an automated lead handoff flow.",
  },
  {
    slug: "astroskop",
    name: "Astroskop",
    href: "https://astroskop.rs",
    external: true,
    outcome: "Premium content vault on Next.js",
    tags: ["Next.js", "Editorial", "SEO", "Content"],
    cover: "/img/technityze/work/astroskop.png",
    cursorTheme: "purple",
    description:
      "Premium editorial site for astrology content with a custom CMS. Next.js with server-side rendering for SEO, optimised content vault, monetisation through premium readings.",
  },
  {
    slug: "operations-app",
    name: "Operations app",
    href: "#",
    external: false,
    outcome: "In production, 3 modules shipped",
    tags: ["React Native", "Node.js", "SaaS", "Dashboard"],
    cover: "/img/technityze/work/showcase-3.png",
    cursorTheme: "black-green",
    description:
      "Internal operations SaaS for service businesses. Three modules in production: appointment management, sales pipeline, KPI dashboard. React Native mobile + Node.js backend, ongoing deployment.",
  },
];

export default function ProjectsGrid() {
  /* Per-project cursor theming: cursor stack is global, so we tag <html>
     with the active project's theme on enter/leave. CSS overrides
     .mxd-cursor__text.accent + .mxd-cursor__dot.active-accent based on
     that attribute so each card gets its own cursor color combo. */
  const setTheme = useCallback((t: CursorTheme | null) => {
    if (typeof document === "undefined") return;
    if (t) document.documentElement.setAttribute("data-cursor-theme", t);
    else document.documentElement.removeAttribute("data-cursor-theme");
  }, []);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openModal = useCallback((p: Project) => {
    setActiveProject(p);
    setTheme(null);
  }, [setTheme]);

  const closeModal = useCallback(() => {
    setActiveProject(null);
  }, []);

  /* Lock body scroll when modal is open + close on Escape */
  useEffect(() => {
    if (!activeProject) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeProject, closeModal]);

  return (
    <BlurSection
      id="works"
      className="mxd-section bg-color-base padding-top-title technityze-work"
    >
      <div className="mxd-container grid-l-container">
        {/* Section title - h2 + CTA on same row, caption underneath */}
        <div className="mxd-block">
          <div className="mxd-section-title pre-grid">
            <div className="technityze-work-titlebar">
              <CommonAnimatedText
                as="h2"
                className="reveal-type technityze-work-h2"
                animation="revealType"
              >
                Selected work
              </CommonAnimatedText>
              <CommonScrollAnimated
                className="anim-uni-in-up"
                as="div"
                animation="inUp"
              >
                <Link
                  href="/contact"
                  className="btn btn-default-icon btn-default-accent slide-right"
                  data-cursor-text="Let's Chat"
                >
                  <span className="btn-caption mxd-scramble">
                    <TextScramble>Start a project</TextScramble>
                  </span>
                  <i className="btn-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      viewBox="0 0 18 18"
                    >
                      <path d="M10.8,0v3.6h-3.6V0h3.6ZM14.4,10.8h3.6v-3.6h-3.6v-3.6h-3.6v3.6H0v3.6h10.8v3.6h3.6v-3.6ZM10.8,14.4h-3.6v3.6h3.6v-3.6Z" />
                    </svg>
                  </i>
                </Link>
              </CommonScrollAnimated>
            </div>
            <p className="technityze-work-caption">
              Things we have actually shipped.
            </p>
          </div>
        </div>

        {/* Projects grid - 3 cards per row on desktop */}
        <div className="mxd-block">
          <div className="mxd-projects-grid">
            <div className="container-fluid p-0">
              <div className="row g-0 mxd-projects-grid__gallery">
                {PROJECTS.map((p) => (
                  <CommonCardBatchAnimated
                    key={p.slug}
                    className="col-12 col-md-6 col-xl-3 mxd-project-item animate-card-4 technityze-work-card"
                    as="div"
                    columns={4}
                  >
                    <button
                      type="button"
                      className={`mxd-project-item__media active-cursor-accent technityze-work-card__media technityze-work-card__media--${p.cursorTheme}`}
                      data-cursor-text="View project"
                      onPointerEnter={() => setTheme(p.cursorTheme)}
                      onPointerLeave={() => setTheme(null)}
                      onClick={() => openModal(p)}
                    >
                      <Image
                        className="technityze-work-card__img"
                        alt={`${p.name} preview`}
                        src={p.cover}
                        width={1280}
                        height={800}
                      />
                    </button>
                    <div className="mxd-project-item__caption technityze-work-card__caption">
                      <div className="mxd-project-item__name">
                        <button
                          type="button"
                          className="project-name-s technityze-work-card__name"
                          onClick={() => openModal(p)}
                        >
                          {p.name}
                        </button>
                      </div>
                      <p className="technityze-work-card__outcome">
                        {p.outcome}
                      </p>
                    </div>
                  </CommonCardBatchAnimated>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project detail modal */}
      {activeProject ? (
        <ProjectModal project={activeProject} onClose={closeModal} />
      ) : null}
    </BlurSection>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <div
      className="technityze-work-modal"
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <button
        type="button"
        className="technityze-work-modal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="technityze-work-modal__panel">
        <div className="technityze-work-modal__actions">
          {project.external ? (
            <a
              className="technityze-work-modal__visit"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label="View live site"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path
                  d="M7 17 L17 7 M9 7 L17 7 L17 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="technityze-work-modal__visit-bubble">
                View live site
              </span>
            </a>
          ) : (
            <span
              className="technityze-work-modal__visit is-disabled"
              aria-label="Live site coming soon"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path
                  d="M12 8 V13 M12 16 V16.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className="technityze-work-modal__visit-bubble">
                Live site coming soon
              </span>
            </span>
          )}
          <button
            type="button"
            className="technityze-work-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path
                d="M6 6 L18 18 M18 6 L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="technityze-work-modal__grid">
          <div className="technityze-work-modal__media">
            <Image
              src={project.cover}
              alt={`${project.name} screenshot`}
              width={1280}
              height={800}
              className="technityze-work-modal__img"
            />
          </div>

          <div className="technityze-work-modal__body">
            <p className="technityze-work-modal__eyebrow">Selected work</p>
            <h3 className="technityze-work-modal__title">{project.name}</h3>
            <p className="technityze-work-modal__outcome">{project.outcome}</p>
            <p className="technityze-work-modal__desc">{project.description}</p>

            <div className="technityze-work-modal__tags">
              {project.tags.map((t) => (
                <span key={t} className="technityze-work-modal__tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
