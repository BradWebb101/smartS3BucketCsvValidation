# Smart s3 bucket: Csv schema validation

The purpose of this code is to build a smart s3 bucket using AWS Lambda, that will auto validate a csv file with a predetermined schema. It will then sort the file into one of 2 buckets, a validated bucket if it passes all checks and a non-validated bucket if it fails. 

## How is it built

### Infrastructure

AWS CDK Typescript. Services used:
- S3
- Lambda
- DynamoDB 

### Schema validation

Schema validation uses Pandas and Pandera, to load the csv into memory. 

### Changes needed

If you would like to use this process, you will need to change the schema in the ./jsonSchema/csvFileSchema.json. There is the example csv file stored there as well, with the current schema. Change the schema to fit within your use case. 

### How to deploy

To run this code you will need a AWS account, AWS CLI and AWS CDK installed. 
- AWS CLI see [Website](https://aws.amazon.com/cli/)
- AWS CDK see [Website](https://aws.amazon.com/cdk/)

If this is your first time building infastrucutre in your AWS account you will need to run the boot strap command. 

```cmd
cdk bootstrap
```

To deploy the infastructure then run, from the root directory.

```cmd
cdk deploy
```