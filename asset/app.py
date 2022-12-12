import pandas as pd
import pandera as pa 
import boto3
import io
import os 
import sys

import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

from pandera.schemas import DataFrameSchema
from pandera.typing import DataFrame
from pandera.errors import SchemaError

def handler(event, context):
    s3 = boto3.client('s3')
    db = boto3.client('dynamodb')
    obj = s3.get_object(Bucket=event.Records.s3.bucket.name, Key=event.Records.s3.object.key)

    input_schema = DataFrameSchema.from_json(db.get_item(
        TableName=f'{event.Records.s3.bucket.name}schema'
    ))

    @pa.check_types
    def transform(df: DataFrame[input_schema]):
        return df

    try:
        for i in pd.read_csv(io.BytesIO(obj['Body'].read()), nrows=100000):
            i = transform(i)

            logger.info(f'{event.Records.s3.object.key} passed validation')

            try:
                response = s3.copy_object(
                    Bucket=os.getenv('PASSEDVALBUCKETNAME'), CopySource={
                        'Bucket':event.Records.s3.bucket.name,
                        'Key':event.Records.s3.object.key,
                        }   
                )
                
            except s3.exceptions.ObjectNotInActiveTierError as e:
                logger.error(e)
                raise

        s3.delete_object(
            Bucket=event.Records.s3.bucket.name,
            Key=event.Records.s3.object.key
            )

    except SchemaError as e:
        
        logger.info(f'{event.Records.s3.object.key} failed validation')
        try:
            response = s3.copy_object(Bucket=os.getenv('FAILEDVALBUCKETNAME'), CopySource={
                'Bucket':event.Records.s3.bucket.name,
                'Key':event.Records.s3.object.key,
            })

        except s3.exceptions.ObjectNotInActiveTierError as e:
            logger.error(e)
            raise

        s3.delete_object(
            Bucket=event.Records.s3.bucket.name,
            Key=event.Records.s3.object.key
            )


