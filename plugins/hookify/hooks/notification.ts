#!/usr/bin/env bun
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2025 Léo Brival <leobrival@serumandco.com>
// This file is part of Serum Plugins Official.
// Commercial licensing available at https://www.serumandco.com/

/**
 * Notification hook for Serum Plugins.
 * Called by Claude Code at session start.
 *
 * Simple kill switch:
 * - Fetches config from GitHub Gist
 * - If revoked: true → auto-uninstall entire marketplace
 * - No license key required
 */

import { checkLicense } from "../core/license-checker";

const MARKETPLACE_NAME = "serum-plugins-official";
const MARKETPLACE_REPO = "leobrival/serum-plugins-official";

// All plugins in the marketplace
const MARKETPLACE_PLUGINS = [
	"hookify",
	"crawler",
	"media-tools",
];

interface NotificationInput {
	hook_event_name: string;
	type?: string;
	message?: string;
}

interface NotificationOutput {
	systemMessage?: string;
}

/**
 * Remove plugins from installed_plugins.json
 */
async function removeFromInstalledPlugins(): Promise<boolean> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	try {
		const installedPath = path.join(os.homedir(), ".claude", "plugins", "installed_plugins.json");

		const content = await fs.readFile(installedPath, "utf-8");
		const data = JSON.parse(content);

		let modified = false;

		if (data.plugins && typeof data.plugins === "object") {
			const keysToRemove: string[] = [];

			for (const key of Object.keys(data.plugins)) {
				if (key.includes(MARKETPLACE_NAME)) {
					keysToRemove.push(key);
				}
			}

			for (const key of keysToRemove) {
				delete data.plugins[key];
				modified = true;
			}
		}

		if (modified) {
			await fs.writeFile(installedPath, JSON.stringify(data, null, 2));
		}

		return modified;
	} catch {
		return false;
	}
}

/**
 * Remove marketplace from known_marketplaces.json
 */
async function removeFromKnownMarketplaces(): Promise<boolean> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	try {
		const knownPath = path.join(os.homedir(), ".claude", "plugins", "known_marketplaces.json");

		const content = await fs.readFile(knownPath, "utf-8");
		const data = JSON.parse(content);

		let modified = false;

		// Format is an object with marketplace names as keys
		if (typeof data === "object" && data !== null) {
			const keysToRemove: string[] = [];

			for (const key of Object.keys(data)) {
				if (key.includes(MARKETPLACE_NAME) || key === MARKETPLACE_NAME) {
					keysToRemove.push(key);
				}
			}

			for (const key of keysToRemove) {
				delete data[key];
				modified = true;
			}
		}

		if (modified) {
			await fs.writeFile(knownPath, JSON.stringify(data, null, 2));
		}

		return modified;
	} catch {
		return false;
	}
}

/**
 * Remove all marketplace plugin files from cache
 */
async function removeMarketplaceFiles(): Promise<boolean> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	let removed = false;

	try {
		// Remove plugin cache directory
		const cacheDir = path.join(os.homedir(), ".claude", "plugins", "cache", MARKETPLACE_NAME);
		try {
			await fs.access(cacheDir);
			await fs.rm(cacheDir, { recursive: true, force: true });
			removed = true;
		} catch {
			// Directory doesn't exist
		}

		// Remove marketplace metadata
		const marketplacesDir = path.join(os.homedir(), ".claude", "plugins", "marketplaces");
		try {
			const entries = await fs.readdir(marketplacesDir);
			for (const entry of entries) {
				if (entry.includes(MARKETPLACE_NAME) || entry.includes("leobrival-serum")) {
					const dir = path.join(marketplacesDir, entry);
					await fs.rm(dir, { recursive: true, force: true });
					removed = true;
				}
			}
		} catch {
			// Directory doesn't exist
		}
	} catch {
		// Ignore errors
	}

	return removed;
}

/**
 * Remove enabled plugins from settings.json
 */
async function removeFromSettings(): Promise<boolean> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	try {
		const settingsPath = path.join(os.homedir(), ".claude", "settings.json");

		const content = await fs.readFile(settingsPath, "utf-8");
		const settings = JSON.parse(content);

		let modified = false;

		// Remove from enabledPlugins
		if (settings.enabledPlugins && typeof settings.enabledPlugins === "object") {
			const keysToRemove: string[] = [];

			for (const key of Object.keys(settings.enabledPlugins)) {
				if (key.includes(MARKETPLACE_NAME)) {
					keysToRemove.push(key);
				}
			}

			for (const key of keysToRemove) {
				delete settings.enabledPlugins[key];
				modified = true;
			}
		}

		if (modified) {
			await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
		}

		return modified;
	} catch {
		return false;
	}
}

/**
 * Clean up cache
 */
async function cleanupCache(): Promise<void> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	try {
		const cacheFile = path.join(os.homedir(), ".config", "serum", ".license-cache.json");
		await fs.rm(cacheFile, { force: true });
	} catch {
		// Ignore
	}
}

async function main() {
	try {
		// Read input from stdin
		const chunks: Buffer[] = [];
		for await (const chunk of Bun.stdin.stream()) {
			chunks.push(chunk);
		}
		const inputText = Buffer.concat(chunks).toString("utf-8");
		const inputData: NotificationInput = JSON.parse(inputText);

		// Only check on session start
		if (inputData.type && inputData.type !== "session_start") {
			console.log(JSON.stringify({}));
			process.exit(0);
		}

		// Check if revoked
		const result = await checkLicense();

		const output: NotificationOutput = {};

		if (result.action === "uninstall") {
			// REVOKED - Auto-uninstall entire marketplace
			const pluginsRemoved = await removeFromInstalledPlugins();
			const marketplacesRemoved = await removeFromKnownMarketplaces();
			const settingsRemoved = await removeFromSettings();
			const filesRemoved = await removeMarketplaceFiles();
			await cleanupCache();

			if (pluginsRemoved || marketplacesRemoved || settingsRemoved || filesRemoved) {
				output.systemMessage = `
╔══════════════════════════════════════════════════════════════════╗
║              SERUM PLUGINS - ACCESS REVOKED                      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  The Serum Plugins marketplace has been automatically removed.   ║
║                                                                  ║
║  ${(result.message || "Access revoked.").slice(0, 60).padEnd(60)}  ║
║                                                                  ║
║  Please RESTART Claude Code for changes to take effect.          ║
║                                                                  ║
║  Contact: leobrival@serumandco.com                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;
			} else {
				output.systemMessage = `[Serum Plugins] Access revoked. Please run: /plugin marketplace remove ${MARKETPLACE_REPO}`;
			}
		}
		// If not revoked, output nothing (silent)

		console.log(JSON.stringify(output));
	} catch (error) {
		// Fail silently
		console.log(JSON.stringify({}));
	}

	process.exit(0);
}

main();
