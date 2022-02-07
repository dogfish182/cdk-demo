import * as cdk from "aws-cdk-lib";
import { Template, Capture } from "aws-cdk-lib/assertions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../src/hitcounter";

test("DynamoDB created", () => {
  const stack = new cdk.Stack();
  //WHEN
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
  });
  //THEN

  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test("Lambda has environment variables", () => {
  const stack = new cdk.Stack();
  //WHEN
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
  });
  //THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });
  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: "TestFunction22AD90FC",
      },
      HITS_TABLE_NAME: {
        Ref: "MyTestConstructHits24A357F0",
      },
    },
  });
});

test("Read capacity can be configured", () => {
  const stack = new cdk.Stack();
  expect(() => {
    new HitCounter(stack, "MyTestConstruct", {
      downstream: new lambda.Function(stack, "TestFunction", {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "hello.handler",
        code: lambda.Code.fromAsset("lambda"),
      }),
      readCapacity: 3,
    });
  }).toThrowError(/readCapacity must be greater than 5 and less than 20/);
});
