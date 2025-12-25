---
name: block-mkfs
enabled: true
event: bash
pattern: mkfs\.
action: block
---

**Filesystem creation blocked: mkfs**

The `mkfs.*` commands format partitions and erase all data.

Irreversible operation - execute manually with confirmation.
