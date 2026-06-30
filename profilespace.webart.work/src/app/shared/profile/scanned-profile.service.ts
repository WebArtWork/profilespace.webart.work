import { Injectable, signal } from '@angular/core';
import { QrProfile } from './profile.model';

@Injectable({ providedIn: 'root' })
export class ScannedProfileService {
	private readonly _profile = signal<QrProfile | null>(null);

	readonly profile = this._profile.asReadonly();

	set(profile: QrProfile): void {
		this._profile.set(profile);
	}

	clear(): void {
		this._profile.set(null);
	}
}
