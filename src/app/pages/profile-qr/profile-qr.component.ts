import { Component, PLATFORM_ID, inject } from '@angular/core';
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

	copyJson(): void {
		if (this.isBrowser && this.profileJson()) {
			navigator.clipboard.writeText(this.profileJson());
		}
	}

	clear(): void {
		this.profileService.clear();
	}
}
