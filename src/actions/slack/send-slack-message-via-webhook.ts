import { createTemplateAction } from "@backstage/plugin-scaffolder-node";
import axios from "axios";
import { Config } from "@backstage/config";
import { InputError } from "@backstage/errors";

/**
 * Creates a `slack:sendMessage` Scaffolder action.
 *
 * @public
 */
export function createSendSlackMessageViaWebhookAction(options: {
  config: Config;
}) {
  const { config } = options;

  return createTemplateAction({
    id: "slack:sendMessage:webhook",
    description: "Sends a Slack message via a webhook",
    schema: {
      input: (z) =>
        z.object({
          message: z
            .string()
            .describe("The message to send via webhook"),
          webhookUrl: z
            .string()
            .optional()
            .describe(
              "The webhook URL to send the request to. The URL must either be specified here or in the Backstage config"
            ),
        }),
      output: (z) =>
        z.object({
          webhookUrl: z
            .string()
            .describe("The webhook URL that was used to send the message"),
        }),
    },
    async handler(ctx) {
      const webhookUrl =
        config.getOptionalString("slack.webhookUrl") ?? ctx.input.webhookUrl;

      if (!webhookUrl) {
        throw new InputError(
          "Webhook URL is not specified in either the app-config or the action input. This must be specified in at least one place in order to send a message"
        );
      }

      const body = {
        text: ctx.input.message,
      };

      const result = await axios.post(webhookUrl, body);

      if (result.status !== 200) {
        ctx.logger.error(
          `Something went wrong while trying to send a request to the webhook URL - StatusCode ${result.status}`
        );
        ctx.logger.debug(`Response body: ${result.data}`);
        ctx.logger.debug(`Webhook URL: ${webhookUrl}`);
        ctx.logger.debug(`Input message: ${ctx.input.message}`);
        throw new Error(
          `Something went wrong while trying to send a request to the webhook URL - StatusCode ${result.status}`
        );
      }

      ctx.output("webhookUrl", webhookUrl);
    },
  });
}
