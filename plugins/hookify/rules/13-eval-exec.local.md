---
name: block-eval-exec
enabled: true
event: bash
pattern: (eval\s*\(|exec\s*\()
action: block
---

**Dynamic code execution blocked**

The `eval()` and `exec()` functions execute arbitrary code and are injection vectors.

Security risks:
- Code injection
- Uncontrolled execution
- Potential privilege escalation
