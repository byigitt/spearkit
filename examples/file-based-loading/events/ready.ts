import { event } from "spear";

export default event("clientReady", (client) => {
  console.log(`Logged in as ${client.user.tag}`);
});
