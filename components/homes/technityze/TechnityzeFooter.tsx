import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import {
  CommonScrollAnimated,
  CommonScrollAnimatedLink,
} from "@/components/animations/CommonScrollAnimated";
import TextScramble from "@/components/animations/TextScramble";
import FooterBackToTop from "@/components/footers/FooterBackToTop";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#works", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { href: "https://github.com/markovicc26", label: "Github" },
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
  { href: "https://www.instagram.com/", label: "Instagram" },
];

export default function TechnityzeFooter() {
  return (
    <footer className="mxd-footer technityze-footer">
      <div className="mxd-container grid-l-container">
        {/* Nav */}
        <div className="mxd-block">
          <div className="mxd-footer__footer-blocks mxd-grid-item">
            <div className="footer-blocks__nav-v01">
              <ul className="footer-nav-v01">
                {NAV.map((item) => (
                  <li key={item.href} className="footer-nav-v01__item">
                    <CommonScrollAnimatedLink
                      className="anim-uni-slide-down"
                      href={item.href}
                      animation="slideDownLine"
                    >
                      <TextScramble className="mxd-scramble mxd-slide-down">
                        {item.label}
                      </TextScramble>
                    </CommonScrollAnimatedLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Info columns */}
        <div className="mxd-block">
          <div className="mxd-footer__footer-blocks">
            <div className="footer-blocks__column mxd-grid-item justify-start">
              <div className="footer-blocks__data justify-start">
                <p className="footer-data">
                  <CommonScrollAnimated
                    className="anim-uni-slide-down"
                    href="mailto:contact@technityze.com?subject=Project%20inquiry"
                    as="a"
                    animation="slideDownLine"
                  >
                    <TextScramble className="mxd-scramble">
                      contact@technityze.com
                    </TextScramble>
                  </CommonScrollAnimated>
                </p>
                <CommonScrollAnimated
                  className="footer-data anim-uni-slide-down"
                  as="p"
                  animation="slideDownLine"
                >
                  <span>Belgrade, Serbia - remote across EU</span>
                </CommonScrollAnimated>
              </div>
            </div>
            <div className="footer-blocks__column mxd-grid-item justify-end">
              <div className="footer-blocks__data justify-end">
                <CommonScrollAnimated
                  className="footer-data anim-uni-slide-down"
                  as="p"
                  animation="slideDownLine"
                >
                  <span className="mxd-slide-down">
                    (C) {new Date().getFullYear()}
                  </span>
                </CommonScrollAnimated>
                <CommonScrollAnimated
                  className="footer-data anim-uni-slide-down"
                  as="p"
                  animation="slideDownLine"
                >
                  <span className="mxd-slide-down">
                    Technityze. All rights reserved.
                  </span>
                </CommonScrollAnimated>
                <CommonScrollAnimated
                  className="footer-data anim-uni-slide-down"
                  as="p"
                  animation="slideDownLine"
                >
                  <span className="mxd-slide-down">Built and run by 2.</span>
                </CommonScrollAnimated>
              </div>
            </div>
          </div>
        </div>

        {/* Fullwidth wordmark */}
        <div className="mxd-block">
          <div className="mxd-footer__fw-mark mxd-grid-item">
            <div className="fw-mark__wrap">
              <div className="fw-mark__content">
                <CommonAnimatedText
                  as="span"
                  className="anim-uni-chars"
                  animation="animChars"
                >
                  technityze
                </CommonAnimatedText>
              </div>
            </div>
          </div>
        </div>

        {/* Socials + back to top */}
        <div className="mxd-block">
          <div className="mxd-footer__footer-blocks bottom-blocks">
            <div className="footer-blocks__column mxd-grid-item justify-start">
              <div className="footer-blocks__socials">
                <CommonScrollAnimated
                  className="mxd-socials-line anim-uni-fade-in"
                  as="ul"
                  animation="fadeIn"
                >
                  {SOCIALS.map((s) => (
                    <li key={s.href}>
                      <a
                        className="mxd-socials-line__link"
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <TextScramble className="mxd-scramble">
                          {s.label}
                        </TextScramble>
                      </a>
                    </li>
                  ))}
                </CommonScrollAnimated>
              </div>
            </div>
            <div className="footer-blocks__column mxd-grid-item justify-end">
              <CommonScrollAnimated
                className="footer-blocks__controls anim-uni-fade-in"
                as="div"
                animation="fadeIn"
              >
                <FooterBackToTop />
              </CommonScrollAnimated>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
