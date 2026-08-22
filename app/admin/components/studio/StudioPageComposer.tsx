"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import {
  SECTION_REGISTRY,
  type HomeSectionConfig,
  type SectionSurfaceId,
} from "../../../../shared/config";

export type SectionEdit =
  | { kind: "enabled"; value: boolean }
  | { kind: "variant"; value: string }
  | { kind: "surface"; value: SectionSurfaceId }
  | { kind: "density"; value: "compact" | "balanced" | "spacious" }
  | { kind: "alignment"; value: "start" | "center" }
  | { kind: "item-count"; value: number }
  | { kind: "reset" };

const SURFACE_LABELS: Record<SectionSurfaceId, string> = {
  default: "Padrão",
  light: "Claro",
  dark: "Escuro",
  accent: "Destaque",
  photo: "Foto",
};

function SortableSectionCard({
  section,
  index,
  total,
  globalPhotoId,
  onMove,
  onEdit,
}: {
  section: HomeSectionConfig;
  index: number;
  total: number;
  globalPhotoId: string | null;
  onMove: (from: number, to: number) => void;
  onEdit: (id: string, edit: SectionEdit) => void;
}) {
  const definition = SECTION_REGISTRY[section.type];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <article ref={setNodeRef} style={style} className={`studio-section-card${isDragging ? " dragging" : ""}${section.enabled ? "" : " hidden"}`}>
      <div className="studio-section-card-main">
        <button className="studio-drag-handle" type="button" aria-label={`Arrastar ${definition.label}`} {...attributes} {...listeners}>
          <GripVertical size={20} aria-hidden="true" />
        </button>
        <span className={`studio-section-miniature section-${section.type} variant-${section.variant}`} aria-hidden="true"><i /><i /><i /></span>
        <div>
          <strong>{definition.label}</strong>
          <small>{definition.description}</small>
        </div>
        {!definition.required ? (
          <button
            className="studio-visibility-toggle"
            type="button"
            role="switch"
            aria-checked={section.enabled}
            onClick={() => onEdit(section.id, { kind: "enabled", value: !section.enabled })}
          >
            {section.enabled ? "Visível" : "Oculta"}
          </button>
        ) : (
          <span className="studio-required-section">Sempre visível</span>
        )}
      </div>

      <div className="studio-section-card-actions">
        <button type="button" onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label={`Mover ${definition.label} para cima`}>
          <ArrowUp size={16} aria-hidden="true" /> Mover para cima
        </button>
        <button type="button" onClick={() => onMove(index, index + 1)} disabled={index === total - 1} aria-label={`Mover ${definition.label} para baixo`}>
          <ArrowDown size={16} aria-hidden="true" /> Mover para baixo
        </button>
      </div>

      <details className="studio-section-options">
        <summary>Mudar esta parte</summary>
        <div className="studio-section-option-group">
          <h4>Composição</h4>
          <div className="studio-variant-grid">
            {definition.allowedVariants.map((variant) => {
              const metadata = (definition.variants as Record<string, { label: string; description: string }>)[variant];
              return (
                <button type="button" aria-pressed={section.variant === variant} onClick={() => onEdit(section.id, { kind: "variant", value: variant })} key={variant}>
                  <span className={`studio-variant-preview section-${section.type} variant-${variant}`} aria-hidden="true"><i /><i /><i /></span>
                  <strong>{metadata.label}</strong>
                  <small>{metadata.description}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="studio-section-option-group">
          <h4>Fundo desta parte</h4>
          <div className="studio-segmented">
            {definition.allowedSurfaces.map((surface) => (
              <button
                type="button"
                aria-pressed={section.appearance.surface === surface}
                disabled={surface === "photo" && !globalPhotoId}
                title={surface === "photo" && !globalPhotoId ? "Escolha primeiro uma foto na área Fotos." : undefined}
                onClick={() => onEdit(section.id, { kind: "surface", value: surface })}
                key={surface}
              >
                {SURFACE_LABELS[surface]}
              </button>
            ))}
          </div>
          {(definition.allowedSurfaces as readonly string[]).includes("photo") && !globalPhotoId ? <small>Para usar “Foto”, escolha uma fotografia na área Fotos.</small> : null}
        </div>

        <div className="studio-section-option-group studio-two-options">
          <div>
            <h4>Espaço</h4>
            <div className="studio-segmented">
              {(["compact", "balanced", "spacious"] as const).map((density) => (
                <button type="button" aria-pressed={section.appearance.density === density} onClick={() => onEdit(section.id, { kind: "density", value: density })} key={density}>
                  {{ compact: "Mais junto", balanced: "Equilibrado", spacious: "Mais espaço" }[density]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4>Alinhamento</h4>
            <div className="studio-segmented">
              {(["start", "center"] as const).map((alignment) => (
                <button type="button" aria-pressed={section.appearance.alignment === alignment} onClick={() => onEdit(section.id, { kind: "alignment", value: alignment })} key={alignment}>
                  {alignment === "start" ? "Editorial" : "Centralizado"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {section.type === "featured-work" ? (
          <div className="studio-section-option-group">
            <h4>Quantidade de trabalhos</h4>
            <div className="studio-segmented">
              {[2, 3, 4, 5, 6].map((count) => (
                <button type="button" aria-pressed={section.itemCount === count} onClick={() => onEdit(section.id, { kind: "item-count", value: count })} key={count}>{count}</button>
              ))}
            </div>
          </div>
        ) : null}

        {section.type === "photo-reel" && section.variant === "patch" ? (
          <p className="studio-reassurance">
            {section.photoIds.length >= 3
              ? `${section.photoIds.length} fotografias escolhidas para o Patch.`
              : "Escolha de 3 a 6 fotos na área Fotos. Enquanto isso, usamos uma seleção segura do acervo."}
          </p>
        ) : null}

        <button
          className="studio-section-reset"
          type="button"
          onClick={() => onEdit(section.id, { kind: "reset" })}
        >
          Voltar esta parte ao original
        </button>
      </details>
    </article>
  );
}

export function StudioPageComposer({
  sections,
  globalPhotoId,
  onReorder,
  onEdit,
}: {
  sections: HomeSectionConfig[];
  globalPhotoId: string | null;
  onReorder: (ids: string[]) => void;
  onEdit: (id: string, edit: SectionEdit) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function move(from: number, to: number) {
    if (to < 0 || to >= sections.length) return;
    onReorder(arrayMove(sections, from, to).map((section) => section.id));
  }

  function dragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((section) => section.id === active.id);
    const to = sections.findIndex((section) => section.id === over.id);
    if (from >= 0 && to >= 0) move(from, to);
  }

  return (
    <section className="studio-panel studio-page-panel" aria-labelledby="studio-page-title">
      <div className="studio-panel-heading">
        <p className="eyebrow">A ordem da história</p>
        <h2 id="studio-page-title">Página</h2>
        <p>Arraste as partes ou use os botões de mover. O site acompanha esta mesma ordem.</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
        <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
          <div className="studio-section-list">
            {sections.map((section, index) => (
              <SortableSectionCard
                section={section}
                index={index}
                total={sections.length}
                globalPhotoId={globalPhotoId}
                onMove={move}
                onEdit={onEdit}
                key={section.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
