import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { TableViewer } from 'cdk-dynamo-table-viewer';
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';

export class WorkshopStack extends Stack {
  /*testing some junk*/
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler',
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    });
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });
    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello hits',
      table: helloWithCounter.table,
      sortBy: '-hits',
    });
    const buckets: string[] = ['mikes-big-bucket-o-gravy', 'jimmys-dance-festival-tickets'];
    buckets.forEach((bucket) => {
      new s3.Bucket(this, `StorageBucket${bucket}`, {
        bucketKeyEnabled: true,
        encryption: s3.BucketEncryption.KMS,
        bucketName: `${bucket}-${this.account}`,
      },
      );
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new WorkshopStack(app, 'WorkshopStack', { env: devEnv });
// new MyStack(app, 'my-stack-dev', { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();