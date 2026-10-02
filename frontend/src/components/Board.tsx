"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useReducer, useState } from "react";
import { boardReducer } from "@/lib/boardReducer";
import { initialBoard } from "@/lib/initialData";
import type { Card as CardType } from "@/lib/types";
import { CardView } from "./Card";
import Column from "./Column";

export default function Board() {
  const [board, dispatch] = useReducer(boardReducer, initialBoard);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findColumn = (id: string) =>
    board.columns.find((c) => c.id === id) ??
    board.columns.find((c) => c.cards.some((card) => card.id === id));

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveCard(
      board.columns.flatMap((c) => c.cards).find((c) => c.id === active.id) ?? null,
    );
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = findColumn(String(active.id));
    const to = findColumn(String(over.id));
    if (!from || !to || from.id === to.id) return;
    const overIndex = to.cards.findIndex((c) => c.id === over.id);
    const below =
      overIndex >= 0 &&
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height / 2;
    dispatch({
      type: "moveCard",
      cardId: String(active.id),
      toColumnId: to.id,
      toIndex: overIndex < 0 ? to.cards.length : overIndex + (below ? 1 : 0),
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over || active.id === over.id) return;
    const col = findColumn(String(active.id));
    const toIndex = col?.cards.findIndex((c) => c.id === over.id) ?? -1;
    if (col && toIndex >= 0) {
      dispatch({ type: "moveCard", cardId: String(active.id), toColumnId: col.id, toIndex });
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1500px] px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy">Project Board</h1>
        <p className="mt-1 text-sm text-muted">Drag cards between columns to track progress.</p>
        <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
      </header>
      <DndContext
        id="board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveCard(null)}
      >
        <div className="flex items-start gap-5 overflow-x-auto pb-4">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onRename={(title) => dispatch({ type: "renameColumn", columnId: column.id, title })}
              onAddCard={(title, details) =>
                dispatch({
                  type: "addCard",
                  columnId: column.id,
                  card: { id: crypto.randomUUID(), title, details },
                })
              }
              onDeleteCard={(cardId) => dispatch({ type: "deleteCard", cardId })}
            />
          ))}
        </div>
        <DragOverlay>{activeCard && <CardView card={activeCard} overlay />}</DragOverlay>
      </DndContext>
    </main>
  );
}
