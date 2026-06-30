import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QrProfile } from './profile.model';

const STORAGE_KEY = 'qr-profile';

@Injectable({ providedIn: 'root' })
export class ProfileStorageService {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly _profile = signal<QrProfile | null>(null);

	readonly profile = this._profile.asReadonly();
	readonly hasProfile = computed(() => !!this._profile());
	readonly profileJson = computed(() => {
		const p = this._profile();
		if (!p) return '';
		const clean: Record<string, string> = {};
		for (const [k, v] of Object.entries(p)) {
			if (v) clean[k] = v;
		}
		return JSON.stringify(clean);
	});

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					this._profile.set(JSON.parse(stored));
				} catch {}
			}
		}
	}

	save(profile: QrProfile): void {
		this._profile.set(profile);
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
		}
	}

	clear(): void {
		this._profile.set(null);
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}
