import BlurSection from "@/components/animations/BlurSection";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import { CommonScrollAnimated } from "@/components/animations/CommonScrollAnimated";

type ProcessItem = {
  icon: string;
  title: string;
  description: string;
  timeline: string;
};

const PROCESS: ProcessItem[] = [
  {
    icon: "ph ph-crosshair",
    title: "Strategy",
    description:
      "We start with the problem, not the deliverable. One call, one short doc, scope locked. No 40-page proposals.",
    timeline: "3-5 days",
  },
  {
    icon: "ph ph-code",
    title: "Build",
    description:
      "We write the code. You see staging links every few days. No black box, no monthly status meeting that explains why nothing shipped.",
    timeline: "2-6 weeks",
  },
  {
    icon: "ph ph-rocket-launch",
    title: "Ship and run",
    description:
      "Launch is not the finish line. We stay on the project: monitoring, fixes, monthly SEO and analytics. Or hand it off cleanly if you have a team.",
    timeline: "Ongoing",
  },
];

export default function Process() {
  return (
    <BlurSection
      id="process"
      className="mxd-section padding-top-manifest-m padding-bottom-tag-m-desktop"
    >
      <div className="mxd-container grid-l-container">
        <div className="mxd-block">
          <div className="mxd-section-manifest pre-points">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 mxd-grid-item">
                  <div className="mxd-section-manifest__wrap wrap-text-m">
                    <div className="mxd-section-manifest__text manifest-text-m">
                      <CommonAnimatedText
                        as="span"
                        className="manifest manifest-m mxd-split-lines"
                        animation="splitLines"
                      >
                        Two engineers, end to end.
                        <span>
                          {" "}You talk to the people doing the work. No
                          handoffs, no account managers, no slide decks.
                        </span>
                      </CommonAnimatedText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mxd-block">
          <div className="mxd-process-points">
            <div className="container-fluid p-0">
              <div className="row g-0">
                {PROCESS.map((item, idx) => (
                  <div
                    key={item.title}
                    className="col-12 col-xl-4 mxd-process-points__item mxd-grid-item"
                  >
                    <CommonScrollAnimated
                      className="mxd-process-points__divider top anim-uni-clip-in"
                      as="div"
                      animation="clipIn"
                    />
                    <CommonScrollAnimated
                      className="mxd-process-points__title anim-uni-in-up"
                      as="div"
                      animation="inUp"
                    >
                      <div className="mxd-process-points__icon">
                        <i className={item.icon} />
                      </div>
                      <p>{item.title}</p>
                    </CommonScrollAnimated>
                    <div className="mxd-process-points__descr">
                      <CommonAnimatedText
                        as="p"
                        className="t-medium mxd-split-lines"
                        animation="splitLines"
                      >
                        {item.description}
                      </CommonAnimatedText>
                    </div>
                    <CommonScrollAnimated
                      className="mxd-process-points__time anim-uni-in-up"
                      as="div"
                      animation="inUp"
                    >
                      <span className="tag tag-m meta-time">
                        {item.timeline}
                      </span>
                    </CommonScrollAnimated>
                    {idx === PROCESS.length - 1 ? (
                      <CommonScrollAnimated
                        className="mxd-process-points__divider bottom anim-uni-clip-in"
                        as="div"
                        animation="clipIn"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlurSection>
  );
}
