provider "aws" {
  region = var.region
}

module "iam" {
  source = "./modules/iam"
  project_name = var.project_name
  region = var.region
  lambda = module.lambda.function
}

module "lambda" {
  source = "./modules/lambda"
  project_name = var.project_name
  region = var.region
  role = module.iam.role
}

module "api-gateway" {
  source = "./modules/api-gateway"
  project_name = var.project_name
  region = var.region
  lambda = module.lambda.function
}
