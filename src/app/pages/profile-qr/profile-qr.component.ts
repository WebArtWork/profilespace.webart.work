import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QrCodeComponent } from 'ng-qrcode';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ProfileStorageService } from '../../shared/profile/profile-storage.service';
import { PhotoStorageService } from '../../shared/profile/photo-storage.service';

@Component({
	imports: [RouterLink, QrCodeComponent, TranslateDirective],
	templateUrl: './profile-qr.component.html',
	styleUrl: './profile-qr.component.scss',
})
export class ProfileQrComponent {
	protected readonly profileService = inject(ProfileStorageService);
	protected readonly photoService = inject(PhotoStorageService);
	protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	protected readonly profile = this.profileService.profile;
	protected readonly hasProfile = this.profileService.hasProfile;
	protected readonly profileJson = this.profileService.profileJson;
	protected readonly photo = this.photoService.photo;
	protected lightboxOpen = false;

	clear(): void {
		this.profileService.clear();
		this.photoService.clear();
	}

	protected downloadQr(): void {
		const canvas = document.querySelector('qr-code canvas') as HTMLCanvasElement;
		if (!canvas) return;
		const a = document.createElement('a');
		a.download = 'profile-qr.png';
		a.href = canvas.toDataURL('image/png');
		a.click();
	}
}
