variable "region" {
  description = "AWS Region"
  type        = string
}

variable "project_name" {
  description = "Name of the Project."
  type        = string
}

variable "lambda" {
  description = "Name of the Lambda function."
  type        = any
}