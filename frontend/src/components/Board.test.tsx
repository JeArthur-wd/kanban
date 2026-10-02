import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Board from "./Board";

describe("Board", () => {
  it("renders five columns with dummy cards", () => {
    render(<Board />);
    expect(screen.getAllByTestId("column")).toHaveLength(5);
    expect(screen.getByText("Research competitors")).toBeInTheDocument();
  });

  it("renames a column", async () => {
    render(<Board />);
    const input = screen.getByLabelText("Column title Backlog");
    await userEvent.clear(input);
    await userEvent.type(input, "Ideas");
    expect(screen.getByDisplayValue("Ideas")).toBeInTheDocument();
  });

  it("adds a card", async () => {
    render(<Board />);
    const column = screen.getAllByTestId("column")[0];
    await userEvent.click(within(column).getByText("+ Add card"));
    await userEvent.type(within(column).getByLabelText("Card title"), "New task");
    await userEvent.type(within(column).getByLabelText("Card details"), "Some details");
    await userEvent.click(within(column).getByRole("button", { name: "Add" }));
    expect(within(column).getByText("New task")).toBeInTheDocument();
    expect(within(column).getByText("Some details")).toBeInTheDocument();
  });

  it("does not add a card with an empty title", async () => {
    render(<Board />);
    const column = screen.getAllByTestId("column")[0];
    const before = within(column).getAllByTestId("card").length;
    await userEvent.click(within(column).getByText("+ Add card"));
    await userEvent.click(within(column).getByRole("button", { name: "Add" }));
    expect(within(column).getAllByTestId("card")).toHaveLength(before);
  });

  it("deletes a card", async () => {
    render(<Board />);
    await userEvent.click(screen.getByLabelText("Delete Research competitors"));
    expect(screen.queryByText("Research competitors")).not.toBeInTheDocument();
  });
});
