import { handleMcpMessage } from "./tools.mjs";
import { readPackage } from "./root.mjs";
import { startStdio } from "./stdio.mjs";

const pkg = await readPackage();
startStdio((msg) => handleMcpMessage(msg, pkg));
