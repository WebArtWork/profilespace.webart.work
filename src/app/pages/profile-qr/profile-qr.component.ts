import { Component, PLATFORM_ID, OnInit, OnDestroy, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QrCodeComponent } from 'ng-qrcode';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { ProfileStorageService } from '../../shared/profile/profile-storage.service';

@Component({
	imports: [RouterLink, QrCodeComponent, TranslateDirective],
	templateUrl: './profile-qr.component.html',
	styleUrl: './profile-qr.component.scss',
})
export class ProfileQrComponent implements OnInit, OnDestroy {
	protected readonly profileService = inject(ProfileStorageService);
	protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	protected readonly hasProfile = this.profileService.hasProfile;
	protected readonly profileJson = this.profileService.profileJson;
	protected qrMenuOpen = false;

	ngOnInit(): void {
		if (this.isBrowser) document.body.style.overflow = 'hidden';
	}

	ngOnDestroy(): void {
		if (this.isBrowser) document.body.style.overflow = '';
	}

	clear(): void {
		this.profileService.clear();
	}

	private getCanvas(): HTMLCanvasElement | null {
		return document.querySelector('qr-code canvas') as HTMLCanvasElement;
	}

	protected async saveQr(): Promise<void> {
		this.qrMenuOpen = false;
		const canvas = this.getCanvas();
		if (!canvas) return;
		const base64 = canvas.toDataURL('image/png').split(',')[1];
		const fileName = 'profile-qr.png';
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
			a.href = 'data:image/png;base64,' + base64;
			a.click();
		}
	}

	protected async shareQr(): Promise<void> {
		this.qrMenuOpen = false;
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
