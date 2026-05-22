"use client";

import {
  CommonGravityContainer,
  CommonGravityObject,
} from "@/components/animations/CommonGravitySection";

const ITEMS = [
  "Web design",
  "Brand strategy",
  "3D Models",
  "Interactions",
  "IU/UX",
  "Guidelines",
  "App design",
  "Packaging",
  "Development",
  "Print Design",
  "Branding",
  "Applications",
  "Visual identity",
  "Logo design",
];

export default function CommonGravityPermanentObjects() {
  return (
    <CommonGravityContainer>
      <div className="mxd-promo__objects object-container">
        {ITEMS.map((item, index) => (
          <CommonGravityObject key={item} index={index}>
            <div className="object object-permanent">
              <p>{item}</p>
            </div>
          </CommonGravityObject>
        ))}
      </div>
    </CommonGravityContainer>
  );
}
