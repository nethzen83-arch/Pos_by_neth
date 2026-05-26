import joi from 'joi';

// User Validation Schemas
export const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const registerSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  firstName: joi.string().max(50).required(),
  lastName: joi.string().max(50).required(),
  phoneNumber: joi.string().pattern(/^[0-9\-\+\s\(\)]{7,}$/),
});

// Product Validation Schemas
export const createProductSchema = joi.object({
  sku: joi.string().uppercase().alphanum().length(10).required(),
  barcode: joi.string().pattern(/^[0-9]+$/).min(8).max(18),
  name: joi.string().max(255).required(),
  description: joi.string(),
  categoryId: joi.string().required(),
  brandId: joi.string(),
  costPrice: joi.number().positive().required(),
  sellingPrice: joi.number().positive().required(),
  tax: joi.number().min(0).max(100).default(0),
  unitId: joi.string().required(),
});

// Customer Validation Schemas
export const createCustomerSchema = joi.object({
  code: joi.string().alphanum().max(20).required(),
  name: joi.string().max(100).required(),
  email: joi.string().email(),
  phoneNumber: joi.string().pattern(/^[0-9\-\+\s\(\)]{7,}/),
  address: joi.string(),
  city: joi.string(),
  state: joi.string(),
  zipCode: joi.string(),
  country: joi.string(),
  type: joi.string().valid('RETAIL', 'WHOLESALE').default('RETAIL'),
  creditLimit: joi.number().min(0).default(0),
});

// Sale Validation Schemas
export const createSaleSchema = joi.object({
  customerId: joi.string(),
  items: joi.array().items(
    joi.object({
      productId: joi.string().required(),
      quantity: joi.number().positive().required(),
      unitPrice: joi.number().positive().required(),
      discount: joi.number().min(0),
      discountPercent: joi.number().min(0).max(100),
      taxPercent: joi.number().min(0).max(100).default(0),
      batch: joi.string().allow('', null),
      expiryDate: joi.string().isoDate().allow('', null),
    }),
  ).required(),
  taxAmount: joi.number().min(0).default(0),
  discountAmount: joi.number().min(0).default(0),
  notes: joi.string(),
});

// Generic validation middleware
export const validate = (schema: joi.Schema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        statusCode: 400,
      });
    }

    req.body = value;
    next();
  };
};
