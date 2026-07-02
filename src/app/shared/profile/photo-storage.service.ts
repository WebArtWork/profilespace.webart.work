import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const PHOTO_KEY = 'qr-profile-photo';
const THUMB_KEY = 'qr-profile-photo-thumb';

@Injectable({ providedIn: 'root' })
export class PhotoStorageService {
	private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _photo = signal<string | null>(null);
	private readonly _thumb = signal<string | null>(null);

	readonly photo = this._photo.asReadonly();
	readonly thumb = this._thumb.asReadonly();

	constructor() {
		if (this.isBrowser) {
			this._photo.set(localStorage.getItem(PHOTO_KEY));
			this._thumb.set(localStorage.getItem(THUMB_KEY));
		}
	}

	save(dataUrl: string): void {
		this._photo.set(dataUrl);
		if (this.isBrowser) localStorage.setItem(PHOTO_KEY, dataUrl);
	}

	saveThumb(dataUrl: string): void {
		this._thumb.set(dataUrl);
		if (this.isBrowser) localStorage.setItem(THUMB_KEY, dataUrl);
	}

	clear(): void {
		this._photo.set(null);
		this._thumb.set(null);
		if (this.isBrowser) {
			localStorage.removeItem(PHOTO_KEY);
			localStorage.removeItem(THUMB_KEY);
		}
	}

	/** Compress + crop to square, max 400px, JPEG 0.82 */
	compress(file: File): Promise<string> {
		return this._resize(file, 400, 0.82);
	}

	/** Tiny thumbnail 40×40 JPEG 0.08 — for embedding in QR JSON */
	thumbnail(file: File): Promise<string> {
		return this._resize(file, 40, 0.08);
	}

	private _resize(file: File, maxDim: number, quality: number): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const size = Math.min(img.width, img.height);
					const canvas = document.createElement('canvas');
					const dim = Math.min(size, maxDim);
					canvas.width = dim;
					canvas.height = dim;
					const ctx = canvas.getContext('2d')!;
					const sx = (img.width - size) / 2;
					const sy = (img.height - size) / 2;
					ctx.drawImage(img, sx, sy, size, size, 0, 0, dim, dim);
					resolve(canvas.toDataURL('image/jpeg', quality));
				};
				img.onerror = reject;
				img.src = e.target!.result as string;
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
}
