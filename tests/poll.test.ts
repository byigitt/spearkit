import { describe, expect, it } from "vitest";
import { poll } from "../src/poll.js";

describe("poll", () => {
  it("builds a discord.js PollData payload with ergonomic defaults", () => {
    expect(
      poll({
        question: "Ship it?",
        answers: [{ text: "Yes", emoji: "✅" }, "Not yet"],
      }),
    ).toEqual({
      question: { text: "Ship it?" },
      answers: [
        { text: "Yes", emoji: "✅" },
        { text: "Not yet", emoji: undefined },
      ],
      duration: 24,
      allowMultiselect: false,
    });
  });

  it("maps durationHours and multiselect", () => {
    expect(
      poll({ question: "Pick", answers: ["A", "B"], durationHours: 6, multiselect: true }),
    ).toMatchObject({ duration: 6, allowMultiselect: true });
  });

  it("rejects API-invalid limits before send", () => {
    expect(() => poll({ question: "", answers: ["A", "B"] })).toThrow(/question/);
    expect(() => poll({ question: "Q", answers: ["A"] })).toThrow(/2–10/);
    expect(() =>
      poll({ question: "Q", answers: ["A", "B"], durationHours: 769 }),
    ).toThrow(/1 to 768/);
    expect(() => poll({ question: "Q", answers: ["A".repeat(56), "B"] })).toThrow(
      /answer 1/,
    );
  });
});
