/***/
/**
 * The slack module for @backstage/plugin-scaffolder-backend.
 *
 * @packageDocumentation
 */

export * from "./actions";
export { scaffolderModuleSendSlackMessage } from "./module";

// Default export for dynamic import pattern: backend.add(import('package-name'))
export { scaffolderModuleSendSlackMessage as default } from "./module";
