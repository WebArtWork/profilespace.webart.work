import { Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QrCodeComponent } from 'ng-qrcode';
import { ProfileStorageService } from '../../shared/profile/profile-storage.service';

@Component({
	imports: [RouterLink, QrCodeComponent],
	templateUrl: './profile-qr.component.html',
	styleUrl: './profile-qr.component.scss',
})
export class ProfileQrComponent {
	protected readonly profileService = inject(ProfileStorageService);
	protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	protected readonly profile = this.profileService.profile;
	protected readonly hasProfile = this.profileService.hasProfile;
	protected readonly profileJson = this.profileService.profileJson;

	protected readonly displayJson = computed(() => {
		const p = this.profile();
		if (!p) return '';
		const clean: Record<string, string> = {};
		for (const [k, v] of Object.entries(p)) {
			if (v) clean[k] = v;
		}
		return JSON.stringify(clean, null, 2);
	});

	copyJson(): void {
		if (this.isBrowser && this.profileJson()) {
			navigator.clipboard.writeText(this.profileJson());
		}
	}

	clear(): void {
		this.profileService.clear();
	}
}
