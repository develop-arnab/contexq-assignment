# Product Service - CDK TypeScript project

This project is part of an assignment for ContextQ. It contains the product-service which uses AWS CDK (TypeScript) to define and deploy infrastructure and application resources.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Prerequisites

- Node.js (recommended v18 or newer)
- AWS CLI configured with credentials and default region
- AWS CDK installed: npm install -g aws-cdk
- 
## Deployment steps

1. Install dependencies
   ```
   yarn
   ```

3. Bootstrap your environment (only required once per account/region)
   ```
   cdk bootstrap
   ```

4. Synthesize the CloudFormation template
   ```
   cdk synth
   ```

5. Deploy the stack
   ```
   cdk deploy
   ```

Notes:
- You can pass a specific AWS profile or region to CDK commands if needed, e.g. `cdk deploy --profile myprofile --region us-east-1`.
- Ensure AWS credentials used for CDK have sufficient permissions to create the resources in the stack.


## Useful commands

* `npm install`        install project dependencies
* `npm run build`      compile TypeScript to JS
* `npm run watch`      watch for changes and compile
* `npm run test`       run jest unit tests
* `cdk synth`          emit the synthesized CloudFormation template
* `cdk diff`           compare deployed stack with current state
* `cdk deploy`         deploy this stack to your AWS account/region
