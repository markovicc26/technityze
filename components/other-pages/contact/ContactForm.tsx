"use client";

import { type FormEvent, useState } from "react";
import { CommonLoadItem } from "@/components/animations/CommonLoadAnimation";
import TextScramble from "@/components/animations/TextScramble";

type FormStatus = "idle" | "sending" | "success" | "error";

/* FormSubmit.co AJAX endpoint - no API key, no env var. Same gateway as
   the live technityze.com site. We'll swap this for Mailgun later. */
const FORM_SUBMIT_ENDPOINT =
  "https://formsubmit.co/ajax/contact@technityze.com";

const PROJECT_TYPES = [
  "Website",
  "Web application",
  "Mobile application",
  "SEO and content",
  "Internal system / automation",
] as const;

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setFeedback("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("_subject", "New website inquiry");
    formData.set("_template", "table");
    formData.set("_captcha", "false");

    try {
      const res = await fetch(FORM_SUBMIT_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      setFeedback("Thanks. We'll get back to you within one business day.");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(
        "Sending failed. Email contact@technityze.com directly or try again.",
      );
    }
  }

  const showSuccessReply = status === "success";
  const disabled = status === "sending" || showSuccessReply;

  return (
    <div className="mxd-block contact">
      <div className="mxd-form-container">
        {showSuccessReply && (
          <div
            className="form__reply centered text-center is-visible"
            role="status"
            aria-live="polite"
          >
            <i className="ph-fill ph-smiley-wink reply__icon" />
            <p className="reply__title">Done!</p>
            <span className="reply__text">{feedback}</span>
          </div>
        )}

        <form
          className={`form contact-form${showSuccessReply ? " is-hidden" : ""}`}
          id="contact-form"
          onSubmit={onSubmit}
        >
          <div className="container-fluid p-0">
            <div className="row gx-0">
              <CommonLoadItem index={0}>
                <div className="col-12 col-md-6 mxd-grid-item loading-item">
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name*"
                    required
                    disabled={disabled}
                  />
                </div>
              </CommonLoadItem>
              <CommonLoadItem index={1}>
                <div className="col-12 col-md-6 mxd-grid-item loading-item">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Email*"
                    required
                    disabled={disabled}
                  />
                </div>
              </CommonLoadItem>
              <CommonLoadItem index={2}>
                <div className="col-12 mxd-grid-item loading-item">
                  <select
                    name="project_type"
                    className="technityze-contact-select"
                    disabled={disabled}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Project type*
                    </option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </CommonLoadItem>
              <CommonLoadItem index={3}>
                <div className="col-12 mxd-grid-item loading-item">
                  <textarea
                    name="message"
                    placeholder="What are you building or trying to solve?*"
                    required
                    defaultValue={""}
                    disabled={disabled}
                  />
                </div>
              </CommonLoadItem>
              <CommonLoadItem index={4}>
                <div className="col-12 mxd-grid-item loading-item">
                  <button
                    className="btn btn-default-icon btn-default-accent slide-right"
                    type="submit"
                    disabled={disabled}
                  >
                    {status === "sending" ? (
                      <span className="btn-caption">Sending…</span>
                    ) : (
                      <TextScramble className="btn-caption mxd-scramble">
                        Send message
                      </TextScramble>
                    )}
                    <i className="btn-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        viewBox="0 0 18 18"
                        aria-hidden
                      >
                        <path d="M10.8,0v3.6h-3.6V0h3.6ZM14.4,10.8h3.6v-3.6h-3.6v-3.6h-3.6v3.6H0v3.6h10.8v3.6h3.6v-3.6ZM10.8,14.4h-3.6v3.6h3.6v-3.6Z" />
                      </svg>
                    </i>
                  </button>
                </div>
              </CommonLoadItem>
            </div>
          </div>
        </form>
        {status === "error" && feedback ? (
          <p className="reply__text" role="alert" style={{ marginTop: "2.4rem" }}>
            {feedback}
          </p>
        ) : null}
      </div>
    </div>
  );
}
