import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import { EditorialText } from "../../components/EditorialText";
import { homeSectionAttributes } from "./section-attributes";

export function HomeStatementSection({
  copy,
  section,
}: {
  copy: EditorialConfig["home"]["statement"];
  section: HomeSectionConfig;
}) {
  return (
    <section
      className="visual-thesis reveal"
      aria-labelledby="thesis-title"
      {...homeSectionAttributes(section)}
    >
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="thesis-title">
          <EditorialText text={copy.title} />
        </h2>
      </div>
      <p>{copy.body}</p>
    </section>
  );
}
