import { readFileSync } from 'node:fs';
import YAML from 'yaml';

export const swaggerSpec = YAML.parse(
  readFileSync(new URL('./openapi.yaml', import.meta.url), 'utf8'),
);
