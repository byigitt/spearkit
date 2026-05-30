import { event } from "spearkit";

export default event("clientReady", (client) => {
  console.log(`Logged in as ${client.user.tag}`);
});
