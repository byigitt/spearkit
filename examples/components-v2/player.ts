/**
 * Components V2 — card-style message layouts (embed-free).
 *
 * `textDisplay`, `separator`, `container`, `section`, `mediaGallery`, `file`
 * wrap discord.js' display-component builders. spearkit ORs the
 * `MessageFlags.IsComponentsV2` flag automatically when it sees a V2 tree;
 * a V2 message cannot also set `content` or `embeds`. Interactive children
 * stay ordinary buttons/selects built with `.build()`.
 */
import {
  button,
  command,
  container,
  row,
  section,
  separator,
  textDisplay,
} from "spearkit";

export const skip = button({
  id: "player-skip",
  label: "Skip",
  style: "Secondary",
  run: (ctx) => ctx.update("Skipped."),
});

export const nowPlaying = command({
  name: "playing",
  description: "Show the player card",
  run: (ctx) =>
    ctx.reply({
      components: [
        textDisplay("## Queue"),
        container({
          accentColor: 0x5865f2,
          children: [
            section({
              children: ["**Now playing** — Song", "by Artist"],
              thumbnail: { url: "https://cdn.example/art.png" },
            }),
            separator(),
            row(skip.build()),
          ],
        }),
      ],
    }),
});
