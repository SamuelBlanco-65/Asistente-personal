# DEBUGGING PROTOCOL

## 1. Capture

Collect:

- exact error
- source file
- line
- command
- runtime
- recent change
- stack trace when useful

## 2. Diagnose

Determine:

- category
- immediate cause
- root cause
- secondary errors

## 3. Inspect

Check:

- affected files
- imports
- package.json
- versions
- configuration
- related dependencies

## 4. Solve

Prefer:

1. compatible solution
2. minimal change
3. maintainable solution

Do not:

- reinstall everything
- update every dependency
- hide errors
- use random workarounds

## 5. Validate

Run:

- typecheck
- lint
- tests
- platform-specific validation

## 6. Document

Update PROJECT_STATUS.md when relevant.