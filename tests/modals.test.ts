import { ComponentType, type APILabelComponent } from "discord.js";
import { describe, expect, it } from "vitest";
import {
  checkbox,
  checkboxGroup,
  fileUpload,
  mentionableSelectField,
  modal,
  radioGroup,
  stringSelectField,
  textInput,
  userSelectField,
} from "../src/components/builders.js";
import { ComponentRegistry } from "../src/components/registry.js";
import { fakeModalSubmit } from "./helpers.js";

function labelComponents(modalJson: { components: unknown[] }): APILabelComponent[] {
  return modalJson.components as APILabelComponent[];
}

describe("modal field builders", () => {
  it("builds every field as a Label component", () => {
    const m = modal({
      id: "full:{id}",
      title: "Full",
      fields: {
        reason: textInput({ label: "Why", style: "Paragraph", required: true }),
        kind: radioGroup({
          label: "Type",
          description: "What is this?",
          options: [
            { label: "Spam", value: "spam" },
            { label: "Abuse", value: "abuse" },
          ],
        }),
        extras: checkboxGroup({
          label: "Also",
          minValues: 0,
          maxValues: 2,
          options: [
            { label: "Ban", value: "ban" },
            { label: "Delete", value: "delete" },
          ],
        }),
        agree: checkbox({ label: "I understand" }),
        proof: fileUpload({ label: "Screenshots", minValues: 0, maxValues: 5 }),
        where: stringSelectField({
          label: "Channel",
          options: [{ label: "General", value: "general" }],
        }),
      },
      run: () => {},
    });

    const json = m.build({ id: "42" }).toJSON();
    expect(json.custom_id).toBe("full:42");
    expect(json.title).toBe("Full");

    const labels = labelComponents(json);
    expect(labels).toHaveLength(6);
    expect(labels.every((label) => label.type === ComponentType.Label)).toBe(true);
    expect(labels.every((label) => label.component.custom_id !== undefined)).toBe(true);

    const [reason, kind, extras, agree, proof, where] = labels;
    expect(reason!.component.type).toBe(ComponentType.TextInput);
    expect((reason!.component as { label?: string }).label).toBe("Why");
    expect(kind!.description).toBe("What is this?");
    expect(kind!.component.type).toBe(ComponentType.RadioGroup);
    const radio = kind!.component as { options: { label: string; value: string }[]; required?: boolean };
    expect(radio.options.map((o) => o.value)).toEqual(["spam", "abuse"]);
    expect(radio.required).toBe(true);

    const group = extras!.component as { min_values?: number; max_values?: number };
    expect(extras!.component.type).toBe(ComponentType.CheckboxGroup);
    expect(group.min_values).toBe(0);
    expect(group.max_values).toBe(2);

    expect(agree!.component.type).toBe(ComponentType.Checkbox);

    expect(proof!.component.type).toBe(ComponentType.FileUpload);
    const upload = proof!.component as { min_values?: number; max_values?: number };
    expect(upload.min_values).toBe(0);
    expect(upload.max_values).toBe(5);

    expect(where!.component.type).toBe(ComponentType.StringSelect);
  });

  it("marks an optional radio group as not required in the payload", () => {
    const m = modal({
      id: "opt",
      title: "Opt",
      fields: {
        pick: radioGroup({
          label: "Pick",
          required: false,
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
          ],
        }),
      },
      run: () => {},
    });
    const json = m.build().toJSON();
    const label = labelComponents(json)[0]!;
    expect(label.component.type).toBe(ComponentType.RadioGroup);
    expect((label.component as { required?: boolean }).required).toBe(false);
  });

  it("passes the file-type filter through to file uploads", () => {
    const m = modal({
      id: "files",
      title: "Files",
      fields: {
        shots: fileUpload({
          label: "Shots",
          allowedFileTypes: ["image/png", "image/jpeg"] as never,
        }),
      },
      run: () => {},
    });
    const json = m.build().toJSON();
    const upload = labelComponents(json)[0]!.component as { file_types?: string[] };
    expect(upload.file_types).toEqual(["image/png", "image/jpeg"]);
  });

  it("routes a mixed-field submit to inferred values", async () => {
    let got: Record<string, unknown> | undefined;
    const m = modal({
      id: "mix:{ticket}",
      title: "Mix",
      fields: {
        reason: textInput({ label: "Why", style: "Paragraph", required: true }),
        kind: radioGroup({
          label: "Type",
          options: [
            { label: "Spam", value: "spam" },
            { label: "Abuse", value: "abuse" },
          ],
        }),
        extras: checkboxGroup({
          label: "Also",
          options: [
            { label: "Ban", value: "ban" },
            { label: "Delete", value: "delete" },
          ],
        }),
        agree: checkbox({ label: "I understand" }),
        proof: fileUpload({ label: "Screenshots" }),
        where: stringSelectField({
          label: "Channel",
          options: [{ label: "General", value: "general" }],
        }),
      },
      run: (ctx) => {
        got = { ...ctx.fields };
      },
    });
    const reg = new ComponentRegistry().add(m);
    const attachment = { id: "a1", url: "https://cdn.example/x.png", name: "x.png" };
    const { interaction } = fakeModalSubmit(
      "mix:9",
      { reason: "spammy" },
      {
        radio: { kind: "abuse" },
        checkboxGroups: { extras: ["ban"] },
        checkboxes: { agree: true },
        files: { proof: [attachment] },
        selects: { where: ["c1"] },
      },
    );
    expect(await reg.handle(interaction)).toBe(true);
    expect(got).toEqual({
      reason: "spammy",
      kind: "abuse",
      extras: ["ban"],
      agree: true,
      proof: [attachment],
      where: ["c1"],
    });
  });

  it("resolves missing optional fields to their empty state", async () => {
    let got: Record<string, unknown> | undefined;
    const m = modal({
      id: "empty",
      title: "Empty",
      fields: {
        note: textInput({ label: "Note", required: false }),
        pick: radioGroup({
          label: "Pick",
          required: false,
          options: [{ label: "A", value: "a" }],
        }),
        extras: checkboxGroup({ label: "Also", options: [{ label: "Ban", value: "ban" }] }),
        agree: checkbox({ label: "I understand" }),
        proof: fileUpload({ label: "Screenshots", required: false }),
      },
      run: (ctx) => {
        got = { ...ctx.fields };
      },
    });
    const reg = new ComponentRegistry().add(m);
    const { interaction } = fakeModalSubmit("empty", {});
    await reg.handle(interaction);
    expect(got).toEqual({ note: "", pick: undefined, extras: [], agree: false, proof: [] });
  });

  it("decodes entity-select ids and dedupes mentionables", async () => {
    let got: Record<string, unknown> | undefined;
    const m = modal({
      id: "people",
      title: "People",
      fields: {
        target: userSelectField({ label: "User" }),
        refs: mentionableSelectField({ label: "Refs" }),
      },
      run: (ctx) => {
        got = { ...ctx.fields };
      },
    });
    const reg = new ComponentRegistry().add(m);
    const { interaction } = fakeModalSubmit(
      "people",
      {},
      {
        users: { target: ["u1"], refs: ["u2"] },
        roles: { refs: ["r1"] },
      },
    );
    await reg.handle(interaction);
    expect(got).toEqual({ target: ["u1"], refs: ["u2", "r1"] });
  });
});
