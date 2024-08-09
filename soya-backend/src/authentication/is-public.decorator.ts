import { SetMetadata } from '@nestjs/common';

// Define the custom decorator with appropriate metadata
export const IsPublic = () => SetMetadata('isPublic', true);
