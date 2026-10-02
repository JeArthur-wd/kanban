import type { Board, Card } from "./types";

export type Action =
  | { type: "renameColumn"; columnId: string; title: string }
  | { type: "addCard"; columnId: string; card: Card }
  | { type: "deleteCard"; cardId: string }
  | { type: "moveCard"; cardId: string; toColumnId: string; toIndex: number };

export function boardReducer(board: Board, action: Action): Board {
  switch (action.type) {
    case "renameColumn":
      return {
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, title: action.title } : c,
        ),
      };
    case "addCard":
      return {
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, cards: [...c.cards, action.card] } : c,
        ),
      };
    case "deleteCard":
      return {
        columns: board.columns.map((c) => ({
          ...c,
          cards: c.cards.filter((card) => card.id !== action.cardId),
        })),
      };
    case "moveCard": {
      const card = board.columns.flatMap((c) => c.cards).find((c) => c.id === action.cardId);
      if (!card) return board;
      const removed = board.columns.map((c) => ({
        ...c,
        cards: c.cards.filter((x) => x.id !== action.cardId),
      }));
      return {
        columns: removed.map((c) => {
          if (c.id !== action.toColumnId) return c;
          const cards = [...c.cards];
          cards.splice(action.toIndex, 0, card);
          return { ...c, cards };
        }),
      };
    }
  }
}
