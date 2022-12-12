import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { DynamoDBSeeder, Seeds } from '@cloudcomponents/cdk-dynamodb-seeder';

export class DynamoDBStack extends cdk.Stack {
  table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id, props);

    const { bucketName } = props

    const table = new dynamodb.Table(this, 'Table', {
        tableName: `${bucketName}inschema`,
        partitionKey: { name: 'bucketname', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        }
    );
    
    //https://www.npmjs.com/package/@cloudcomponents/cdk-dynamodb-seeder
    new DynamoDBSeeder(this, 'JsonFileSeeder', {
      table: table,
      seeds: Seeds.fromJsonFile("./jsonSchema/csvFileSchema.json"),
    });

  }
};