const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

function usage() {
  console.log('Usage: node scripts/validate-schema.cjs <schema.json> <example.json>');
}

const schemaPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '../docs/schemas/plugin.json.schema');
const examplePath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.resolve(__dirname, '../docs/schemas/plugin.json.example');

if (!fs.existsSync(schemaPath)) {
  console.error('Schema file not found:', schemaPath);
  usage();
  process.exit(2);
}
if (!fs.existsSync(examplePath)) {
  console.error('Example file not found:', examplePath);
  usage();
  process.exit(2);
}

let schemaRaw, exampleRaw;
try {
  schemaRaw = fs.readFileSync(schemaPath, 'utf8');
  exampleRaw = fs.readFileSync(examplePath, 'utf8');
} catch (err) {
  console.error('Error reading files:', err.message);
  process.exit(2);
}

let schema, example;
try {
  schema = JSON.parse(schemaRaw);
} catch (err) {
  console.error('Schema JSON parse error:', err.message);
  process.exit(2);
}
try {
  example = JSON.parse(exampleRaw);
} catch (err) {
  console.error('Example JSON parse error:', err.message);
  process.exit(2);
}

const ajv = new Ajv({ allErrors: true, strict: false });
let validate;
try {
  validate = ajv.compile(schema);
} catch (err) {
  console.error('Failed to compile schema:', err.message);
  process.exit(2);
}

const valid = validate(example);
if (valid) {
  console.log('OK: example is valid against schema');
  process.exit(0);
} else {
  console.error('INVALID: example does not validate against schema');
  console.error('Errors:');
  for (const e of validate.errors || []) {
    console.error('-', e.instancePath || '/', e.message);
  }
  process.exit(1);
}
