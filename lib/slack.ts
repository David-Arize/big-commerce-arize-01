import { WebClient } from "@slack/web-api";

const { SLACK_ACCESS_TOKEN } = process.env;

export async function sendSlackMessage(text: string) {
  // try {
  //   const web = new WebClient(SLACK_ACCESS_TOKEN);
  //   await web.chat.postMessage({
  //     channel: `#big-commerce-messages`,
  //     text: `${text}`,
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
}
