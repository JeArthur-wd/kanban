import type { Board } from "./types";

export const initialBoard: Board = {
  columns: [
    {
      id: "backlog",
      title: "Backlog",
      cards: [
        { id: "c1", title: "Research competitors", details: "Review three comparable products and note standout features." },
        { id: "c2", title: "Define success metrics", details: "Agree on the numbers that tell us the launch worked." },
      ],
    },
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "c3", title: "Design onboarding flow", details: "Sketch the first-run experience for new users." },
        { id: "c4", title: "Write launch copy", details: "Landing page headline, subtitle and feature blurbs." },
      ],
    },
    {
      id: "progress",
      title: "In Progress",
      cards: [
        { id: "c5", title: "Build settings page", details: "Profile, notifications and theme preferences." },
      ],
    },
    {
      id: "review",
      title: "Review",
      cards: [
        { id: "c6", title: "Pricing page layout", details: "Waiting on feedback from the design review." },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        { id: "c7", title: "Set up CI pipeline", details: "Lint, test and build on every push." },
        { id: "c8", title: "Kickoff meeting", details: "Goals, roles and timeline agreed." },
      ],
    },
  ],
};
