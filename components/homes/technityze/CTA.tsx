import Link from "next/link";
import { CommonScrollAnimated } from "@/components/animations/CommonScrollAnimated";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import CommonGravitySection from "@/components/animations/CommonGravitySection";
import CommonGravityPermanentObjects from "@/components/animations/CommonGravityPermanentObjects";
import TextScramble from "@/components/animations/TextScramble";

export default function CTA() {
  return (
    <div className="mxd-section">
      <div className="mxd-container fullwidth-container">
        <div className="mxd-block">
          <CommonGravitySection>
            <div className="mxd-promo mxd-gravity-section accent">
              <div className="mxd-promo__wrap">
                <CommonGravityPermanentObjects />
                <div className="mxd-promo__content">
                  <CommonScrollAnimated
                    className="mxd-promo__btngroup anim-uni-in-up"
                    as="div"
                    animation="inUp"
                  >
                    <Link
                      className="btn btn-line btn-line-permanent"
                      href="/contact"
                    >
                      <TextScramble className="btn-caption mxd-scramble">
                        Start a project
                      </TextScramble>
                    </Link>
                  </CommonScrollAnimated>
                  <div className="mxd-promo__caption">
                    <Link
                      className="active-cursor-permanent"
                      data-cursor-text="Let's Talk"
                      href="/contact"
                    >
                      <CommonAnimatedText
                        as="h2"
                        className="permanent reveal-type"
                        animation="revealType"
                      >
                        Have something you want shipped?
                      </CommonAnimatedText>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CommonGravitySection>
        </div>
      </div>
    </div>
  );
}
