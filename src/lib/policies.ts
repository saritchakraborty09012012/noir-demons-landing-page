import { PRIVACY_META, PRIVACY_SECTIONS } from "./policy-content";
import { TERMS_META, TERMS_SECTIONS, REFUND_META, REFUND_SECTIONS } from "./policy-content-terms-refund";
import { SAAS_META, SAAS_SECTIONS, DIGITAL_META, DIGITAL_SECTIONS } from "./policy-content-b";
import { IP_META, IP_SECTIONS, AUP_META, AUP_SECTIONS, DISCLAIMER_META, DISCLAIMER_SECTIONS, COOKIE_META, COOKIE_SECTIONS, GRIEVANCE_META, GRIEVANCE_SECTIONS } from "./policy-content-c";

export type PolicyBlock = { h?: string; p?: string; ul?: string[] };

export type Policy = {
  slug: string;
  title: string;
  effective: string;
  meta: PolicyBlock[];
  sections: PolicyBlock[];
};

export const POLICIES: Policy[] = [
  { slug: "/privacy-policy", title: "Privacy Policy", effective: "7 November 2026", meta: PRIVACY_META, sections: PRIVACY_SECTIONS },
  { slug: "/terms-and-conditions", title: "Terms & Conditions", effective: "7 November 2026", meta: TERMS_META, sections: TERMS_SECTIONS },
  { slug: "/refund-policy", title: "Refund & Cancellation Policy", effective: "7 November 2026", meta: REFUND_META, sections: REFUND_SECTIONS },
  { slug: "/saas-agreement", title: "SaaS Subscription Agreement", effective: "7 November 2026", meta: SAAS_META, sections: SAAS_SECTIONS },
  { slug: "/digital-products-policy", title: "Digital Products & Services Agreement", effective: "7 November 2026", meta: DIGITAL_META, sections: DIGITAL_SECTIONS },
  { slug: "/intellectual-property", title: "Intellectual Property & Licensing Policy", effective: "7 November 2026", meta: IP_META, sections: IP_SECTIONS },
  { slug: "/acceptable-use-policy", title: "Acceptable Use Policy", effective: "7 November 2026", meta: AUP_META, sections: AUP_SECTIONS },
  { slug: "/disclaimer", title: "Disclaimer", effective: "7 November 2026", meta: DISCLAIMER_META, sections: DISCLAIMER_SECTIONS },
  { slug: "/cookie-policy", title: "Cookie Policy", effective: "7 November 2026", meta: COOKIE_META, sections: COOKIE_SECTIONS },
  { slug: "/contact", title: "Contact & Grievance Policy", effective: "7 November 2026", meta: GRIEVANCE_META, sections: GRIEVANCE_SECTIONS },
];
