import BlurSection from "@/components/animations/BlurSection";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import MxdStatsLineItem from "@/components/animations/MxdStatsLineItem";
import { CommonScrollAnimated } from "@/components/animations/CommonScrollAnimated";

type Stat = {
  number: string;
  caption: string;
};

const STATS: Stat[] = [
  { number: "2", caption: "Engineers on every project" },
  { number: "0", caption: "Project managers between you and us" },
  { number: "7+", caption: "Years shipping production sites and apps" },
  { number: "100%", caption: "Code, design and ops handled in-house" },
];

export default function Approach() {
  return (
    <BlurSection className="mxd-section padding-top-subtitle padding-bottom-tag-m-subtitle">
      <div className="mxd-container grid-s-container">
        <div className="mxd-block">
          <div className="mxd-block-split">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-6 mxd-grid-item-s mxd-block-split__item manifest-item">
                  <div className="mxd-block-split__inner">
                    <div className="mxd-block-split__subtitle pre-manifest">
                      <CommonScrollAnimated
                        className="anim-uni-in-up"
                        as="p"
                        animation="inUp"
                      >
                        <span>/ How we work</span>
                      </CommonScrollAnimated>
                    </div>
                    <div className="mxd-block-split__manifest">
                      <CommonAnimatedText
                        as="p"
                        className="manifest manifest-s mxd-split-lines"
                        animation="splitLines"
                      >
                        Small scope, weekly demos, honest deadlines. We pick
                        boring tools that work over hype that won&apos;t survive
                        the next framework cycle.
                        <span>
                          {" "}If we can&apos;t do the job well, we say no
                          instead of selling you a half-baked version of it.
                        </span>
                      </CommonAnimatedText>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-6 mxd-grid-item-s mxd-block-split__item manifest-item">
                  <div className="mxd-block-split__inner">
                    <div className="mxd-block-split__subtitle pre-grid">
                      <CommonScrollAnimated
                        className="anim-uni-in-up"
                        as="p"
                        animation="inUp"
                      >
                        <span>/ Numbers</span>
                      </CommonScrollAnimated>
                    </div>
                    <div className="mxd-stats-lines">
                      {STATS.map((stat) => (
                        <MxdStatsLineItem key={stat.caption}>
                          <div className="mxd-stats-lines__number">
                            <p>{stat.number}</p>
                          </div>
                          <div className="mxd-stats-lines__caption">
                            <p>{stat.caption}</p>
                          </div>
                        </MxdStatsLineItem>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlurSection>
  );
}
