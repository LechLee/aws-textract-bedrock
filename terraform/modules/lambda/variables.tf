variable "region" {
  description = "AWS Region"
  type        = string
}
variable "project_name" {
  description = "Name of the Lambda function."
  type        = string
}

variable "role" {
  description = "IAM Role"
  type        = any
}