const { awscdk } = require("projen");
const { DependabotScheduleInterval } = require("projen/lib/github");
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  description: "Testing out projen",
  dependabot: true,
  dependabotOptions: {
    autoMerge: true,
    ignoreProjen: true,
    scheduleInterval: DependabotScheduleInterval.WEEKLY,
  },
  deps: ["aws-cdk-lib", "cdk-dynamo-table-viewer", "constructs"],
  // devDeps: [],             /* Build dependencies for this module. */
  gitignore: [".idea/*"],
  name: "projen",
  prettier: true,
  releaseWorkflow: true,

  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
