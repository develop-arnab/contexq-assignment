import {
  LambdaIntegration,
  LambdaRestApi,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { aws_apigateway } from "aws-cdk-lib";

interface ApiGatewayStackProps {
  productService: IFunction;
  categoryService: IFunction;
  queueService: IFunction;
}

interface ResourceType {
  name: string;
  methods: string[];
  child?: ResourceType;
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResource("product", props);
  }

  addResource(
    serviceName: string,
    {
      categoryService,
      productService,
      queueService,
    }: ApiGatewayStackProps
  ) {
      const apgw = new RestApi(this, `${serviceName}-ApiGtw`, {
      defaultCorsPreflightOptions: {
        allowOrigins: [
          "http://localhost:3000"
        ],
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });

    this.createEndpoints(productService, apgw, {
      name: "product",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"],
      },
    });

    this.createEndpoints(categoryService, apgw, {
      name: "category",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"],
      },
    });

    this.createEndpoints(queueService, apgw, {
      name: "products-queue",
      methods: ["POST"],
    });
  }

  createEndpoints(
    handler: IFunction,
    resource: RestApi,
    { name, methods, child }: ResourceType
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const rootResource = resource.root.addResource(name);
    methods.map((item) => {
      rootResource.addMethod(item, lambdaFunction);
    });

    if (child) {
      const childResource = rootResource.addResource(child.name);
      child.methods.map((item) => {
        childResource.addMethod(item, lambdaFunction);
      });
    }
  }
}
