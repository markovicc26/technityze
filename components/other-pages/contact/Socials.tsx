import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import { CommonScrollAnimated } from "@/components/animations/CommonScrollAnimated";

type SocialItem = {
  label: string;
  href: string;
};

const SOCIALS: SocialItem[] = [
  { label: "Github", href: "https://github.com/markovicc26" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
];

export default function Socials() {
  return (
    <div className="mxd-section bg-color-accent padding-top-title padding-bottom-default">
      <div className="mxd-container grid-l-container">
        <div className="mxd-block">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12 col-xl-6 mxd-grid-item">
                <div className="mxd-section-title">
                  <div className="mxd-section-title__title pre-grid-split-xl">
                    <CommonAnimatedText
                      as="h2"
                      className="mxd-split-lines accent"
                      animation="splitLines"
                    >
                      Connect
                    </CommonAnimatedText>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-6 mxd-grid-item">
                <div className="mxd-socials-list">
                  {SOCIALS.map((s, i) => (
                    <a
                      key={s.label}
                      className={`socials-list__item slide-right-up${
                        i === 0 ? " no-margin" : ""
                      }`}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <CommonScrollAnimated
                        className="socials-list__divider accent divider-top anim-uni-clip-in"
                        as="div"
                        animation="clipIn"
                      />
                      <div className="socials-list__info">
                        <CommonScrollAnimated
                          className="socials-list__number accent anim-uni-slide-down"
                          as="div"
                          animation="slideDownLine"
                        >
                          <span>[{String(i + 1).padStart(2, "0")}]</span>
                        </CommonScrollAnimated>
                        <CommonScrollAnimated
                          className="socials-list__name accent anim-uni-slide-down"
                          as="div"
                          animation="slideDownLine"
                        >
                          <span>{s.label}</span>
                        </CommonScrollAnimated>
                      </div>
                      <CommonScrollAnimated
                        className="socials-list__arrow accent anim-uni-slide-down"
                        as="div"
                        animation="slideDownLine"
                      >
                        <i>
                          <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            viewBox="0 0 18 18"
                            enableBackground="new 0 0 18 18"
                            xmlSpace="preserve"
                          >
                            <path d="M18,0v14.4h-3.6V7.2h-3.6V3.6H3.6V0H18z M7.2,10.8h3.6V7.2H7.2C7.2,7.2,7.2,10.8,7.2,10.8z M3.6,14.4h3.6v-3.6H3.6V14.4z M0,18h3.6v-3.6H0V18z" />
                          </svg>
                        </i>
                      </CommonScrollAnimated>
                      <CommonScrollAnimated
                        className="socials-list__divider accent divider-bottom anim-uni-clip-in"
                        as="div"
                        animation="clipIn"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
