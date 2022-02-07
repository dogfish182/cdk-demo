import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { WorkshopStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new WorkshopStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});