---
name: block-sudo
enabled: true
event: bash
pattern: sudo\s+
action: block
---

**Privilege escalation blocked: sudo**

The `sudo` commands run with administrator rights and can modify the system.

For security reasons, execute these commands manually.
