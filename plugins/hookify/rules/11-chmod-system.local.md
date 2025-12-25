---
name: block-chmod-system
enabled: true
event: bash
pattern: chmod\s+\+x\s+\/usr
action: block
---

**System permissions modification blocked**

Modifying permissions in `/usr` can compromise system security.

System files should not be modified by automated scripts.
