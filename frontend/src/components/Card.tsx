"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/lib/types";

export function CardView({
  card,
  onDelete,
  overlay = false,
}: {
  card: CardType;
  onDelete?: () => void;
  overlay?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
        overlay ? "rotate-2 shadow-xl" : "transition-shadow hover:shadow-md"
      }`}
    >
      <h3 className="pr-6 text-sm font-semibold text-navy">{card.title}</h3>
      {card.details && <p className="mt-1 text-sm text-muted">{card.details}</p>}
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${card.title}`}
          onClick={onDelete}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-lg leading-none text-muted opacity-0 transition hover:bg-slate-100 hover:text-navy focus:opacity-100 group-hover:opacity-100"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default function Card({ card, onDelete }: { card: CardType; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab touch-none active:cursor-grabbing ${isDragging ? "opacity-30" : ""}`}
      data-testid="card"
      {...attributes}
      {...listeners}
    >
      <CardView card={card} onDelete={onDelete} />
    </div>
  );
}
