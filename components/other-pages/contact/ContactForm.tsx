"use client";

import { type FormEvent, useState } from "react";
import { CommonLoadItem } from "@/components/animations/CommonLoadAnimation";
import TextScramble from "@/components/animations/TextScramble";
import { CONTACT_PROJECT_TYPES } from "@/lib/contactProjectTypes";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setFeedback("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const project_type = String(fd.get("project_type") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const _company = String(fd.get("_company") ?? "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          project_type,
          message,
          _company,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(
          typeof data.error === "string" && data.error.length > 0
            ? data.error
            : "submit failed",
        );
      }
      setStatus("success");
      setFeedback("Thanks. We'll get back to you within one business day.");
      form.reset();
    } catch (err) {
      setStatus("error");
      const fromServer =
        err instanceof Error &&
        err.message &&
        err.message !== "submit failed";
      setFeedback(
        fromServer
          ? err.message
          : "Sending failed. Use the email on this page to reach us directly, or try again.",
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
          {/* Honeypot — leave hidden; bots that fill it get a silent OK from the API */}
          <input
            type="text"
            name="_company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="visually-hidden"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          />
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
                    {CONTACT_PROJECT_TYPES.map((t) => (
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
