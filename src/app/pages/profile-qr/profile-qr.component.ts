import { Component, PLATFORM_ID, OnInit, OnDestroy, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QrCodeComponent } from 'ng-qrcode';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Media } from '@capacitor-community/media';
import { ProfileStorageService } from '../../shared/profile/profile-storage.service';

@Component({
	imports: [QrCodeComponent, TranslateDirective],
	templateUrl: './profile-qr.component.html',
	styleUrl: './profile-qr.component.scss',
})
export class ProfileQrComponent implements OnInit, OnDestroy {
	protected readonly profileService = inject(ProfileStorageService);
	protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	protected readonly hasProfile = this.profileService.hasProfile;
	protected readonly profileJson = this.profileService.profileJson;

	ngOnInit(): void {
		if (this.isBrowser) document.body.style.overflow = 'hidden';
	}

	ngOnDestroy(): void {
		if (this.isBrowser) document.body.style.overflow = '';
	}

	private getCanvas(): HTMLCanvasElement | null {
		return document.querySelector('qr-code canvas') as HTMLCanvasElement;
	}

	protected async saveQr(): Promise<void> {
		const canvas = this.getCanvas();
		if (!canvas) return;
		const dataUrl = canvas.toDataURL('image/png');

		if (Capacitor.isNativePlatform()) {
			try {
				await Media.savePhoto({ path: dataUrl });
				alert('QR збережено у Галерею');
			} catch {
				alert('Не вдалося зберегти QR у Галерею');
			}
			return;
		}

		const fileName = 'profile-qr.png';
		const base64 = dataUrl.split(',')[1];
		try {
			await Filesystem.writeFile({
				path: `Download/${fileName}`,
				data: base64,
				directory: Directory.ExternalStorage,
			});
			alert('QR збережено у папку Завантаження');
		} catch {
			const a = document.createElement('a');
			a.download = fileName;
			a.href = dataUrl;
			a.click();
		}
	}

	protected async shareQr(): Promise<void> {
		const canvas = this.getCanvas();
		if (!canvas) return;
		const base64 = canvas.toDataURL('image/png').split(',')[1];
		const fileName = 'profile-qr.png';
		try {
			await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache });
			const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
			await Share.share({ files: [uri] });
		} catch {
			alert('Поділитися не вдалося');
		}
	}
}
