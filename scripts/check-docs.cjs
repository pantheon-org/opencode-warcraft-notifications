#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function readDirRecursive(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      readDirRecursive(full, filelist);
    } else if (stat.isFile() && file.endsWith('.ts') && !file.endsWith('.test.ts')) {
      filelist.push(full);
    }
  });
  return filelist;
}

function hasJSDoc(node) {
  if (node.jsDoc && node.jsDoc.length > 0) return true;
  return false;
}

function reportIfMissing(filePath, sourceFile, node, name) {
  if (hasJSDoc(node)) return null;
  const start = node.getFullStart();
  const substr = sourceFile.text.slice(Math.max(0, start - 200), start);
  if (substr.includes('/**')) return null;
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  return `${filePath}:${line + 1}:${character + 1} - ${name}`;
}

function inspectFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, true);
  const results = [];

  function visit(node) {
    if (
      ts.isFunctionDeclaration(node) &&
      node.modifiers &&
      node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const name = node.name ? `function ${node.name.escapedText}` : 'export default function';
      const r = reportIfMissing(filePath, sourceFile, node, name);
      if (r) results.push(r);
    }

    if (
      ts.isClassDeclaration(node) &&
      node.modifiers &&
      node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const name = node.name ? `class ${node.name.escapedText}` : 'export default class';
      const r = reportIfMissing(filePath, sourceFile, node, name);
      if (r) results.push(r);
    }

    if (
      ts.isVariableStatement(node) &&
      node.modifiers &&
      node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach((decl) => {
        const init = decl.initializer;
        if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
          const name = decl.name.getText(sourceFile);
          const r = reportIfMissing(filePath, sourceFile, node, `const ${name}`);
          if (r) results.push(r);
        }
      });
    }

    if (ts.isExportAssignment(node)) {
      const expr = node.expression;
      if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr) || ts.isClassExpression(expr)) {
        const r = reportIfMissing(filePath, sourceFile, node, 'export default (anonymous)');
        if (r) results.push(r);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return results;
}

function main() {
  const root = path.resolve(__dirname, '..', 'src');
  if (!fs.existsSync(root)) {
    console.error('src directory not found');
    process.exit(1);
  }
  const files = readDirRecursive(root);
  const all = [];
  files.forEach((f) => {
    const r = inspectFile(f);
    if (r.length) all.push(...r);
  });

  if (all.length === 0) {
    console.log('No missing JSDoc/TSDoc comments detected for exported symbols.');
    process.exit(0);
  }

  console.log('Missing JSDoc/TSDoc for exported symbols:');
  all.forEach((l) => console.log(' -', l));
  process.exit(2);
}

main();
