import { describe, expect, it } from "vitest";
import { boardReducer } from "./boardReducer";
import type { Board } from "./types";

const board: Board = {
  columns: [
    { id: "a", title: "A", cards: [{ id: "1", title: "one", details: "" }, { id: "2", title: "two", details: "" }] },
    { id: "b", title: "B", cards: [{ id: "3", title: "three", details: "" }] },
    { id: "c", title: "C", cards: [] },
  ],
};

const ids = (b: Board, col: string) => b.columns.find((c) => c.id === col)!.cards.map((c) => c.id);

describe("boardReducer", () => {
  it("renames a column", () => {
    const next = boardReducer(board, { type: "renameColumn", columnId: "a", title: "Z" });
    expect(next.columns[0].title).toBe("Z");
    expect(next.columns[1].title).toBe("B");
  });

  it("adds a card to the end of a column", () => {
    const card = { id: "9", title: "new", details: "d" };
    expect(ids(boardReducer(board, { type: "addCard", columnId: "b", card }), "b")).toEqual(["3", "9"]);
  });

  it("deletes a card", () => {
    expect(ids(boardReducer(board, { type: "deleteCard", cardId: "1" }), "a")).toEqual(["2"]);
  });

  it("moves a card within a column", () => {
    const next = boardReducer(board, { type: "moveCard", cardId: "1", toColumnId: "a", toIndex: 1 });
    expect(ids(next, "a")).toEqual(["2", "1"]);
  });

  it("moves a card across columns at an index", () => {
    const next = boardReducer(board, { type: "moveCard", cardId: "1", toColumnId: "b", toIndex: 0 });
    expect(ids(next, "a")).toEqual(["2"]);
    expect(ids(next, "b")).toEqual(["1", "3"]);
  });

  it("moves a card into an empty column", () => {
    const next = boardReducer(board, { type: "moveCard", cardId: "3", toColumnId: "c", toIndex: 0 });
    expect(ids(next, "b")).toEqual([]);
    expect(ids(next, "c")).toEqual(["3"]);
  });

  it("ignores moving an unknown card", () => {
    expect(boardReducer(board, { type: "moveCard", cardId: "x", toColumnId: "b", toIndex: 0 })).toBe(board);
  });
});
