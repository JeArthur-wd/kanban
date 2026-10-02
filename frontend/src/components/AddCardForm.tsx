"use client";

import { useState } from "react";

export default function AddCardForm({
  onAdd,
}: {
  onAdd: (title: string, details: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const close = () => {
    setOpen(false);
    setTitle("");
    setDetails("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-primary transition hover:bg-white/70"
      >
        + Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title.trim(), details.trim());
        close();
      }}
      className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Card title"
        className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-navy outline-none focus:border-primary"
      />
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Details"
        aria-label="Card details"
        rows={2}
        className="w-full resize-none rounded-md border border-slate-200 px-2 py-1.5 text-sm text-navy outline-none focus:border-primary"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Add
        </button>
        <button type="button" onClick={close} className="px-2 text-sm text-muted hover:text-navy">
          Cancel
        </button>
      </div>
    </form>
  );
}
