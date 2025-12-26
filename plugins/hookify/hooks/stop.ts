#!/usr/bin/env bun
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2025 Léo Brival <leobrival@serumandco.com>
// This file is part of Serum Plugins Official.
// Commercial licensing available at https://www.serumandco.com/

/**
 * Stop hook for hookify plugin.
 * Called by Claude Code when session is stopping.
 */

import { loadRules } from "../core/config-loader";
import { evaluateRules } from "../core/rule-engine";
import type { HookInput } from "../core/types";

async function main() {
	try {
		// Read input from stdin
		const chunks: Buffer[] = [];
		for await (const chunk of Bun.stdin.stream()) {
			chunks.push(chunk);
		}
		const inputText = Buffer.concat(chunks).toString("utf-8");
		const inputData: HookInput = JSON.parse(inputText);

		// Load and evaluate stop rules
		const rules = loadRules("stop");
		const result = evaluateRules(rules, inputData);

		// Output result
		console.log(JSON.stringify(result));
	} catch (error) {
		console.log(JSON.stringify({ systemMessage: `Hookify error: ${error}` }));
	}

	process.exit(0);
}

main();
