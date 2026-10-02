"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Column as ColumnType } from "@/lib/types";
import AddCardForm from "./AddCardForm";
import Card from "./Card";

export default function Column({
  column,
  onRename,
  onAddCard,
  onDeleteCard,
}: {
  column: ColumnType;
  onRename: (title: string) => void;
  onAddCard: (title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      data-testid="column"
      className={`flex min-w-64 flex-1 flex-col rounded-2xl bg-slate-100/80 p-3 transition-colors ${
        isOver ? "bg-primary/10" : ""
      }`}
    >
      <div className="mb-3 h-1 w-10 rounded-full bg-accent" />
      <div className="mb-3 flex items-center gap-2 px-1">
        <input
          value={column.title}
          onChange={(e) => onRename(e.target.value)}
          aria-label={`Column title ${column.title}`}
          className="min-w-0 flex-1 rounded-md bg-transparent px-1 py-0.5 text-sm font-bold uppercase tracking-wide text-navy outline-none focus:bg-white focus:ring-2 focus:ring-primary/40"
        />
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-muted">
          {column.cards.length}
        </span>
      </div>
      <div ref={setNodeRef} className="flex min-h-16 flex-1 flex-col gap-3">
        <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <Card key={card.id} card={card} onDelete={() => onDeleteCard(card.id)} />
          ))}
        </SortableContext>
      </div>
      <div className="mt-3">
        <AddCardForm onAdd={onAddCard} />
      </div>
    </section>
  );
}
