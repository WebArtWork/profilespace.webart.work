import {
	Component,
	ElementRef,
	PLATFORM_ID,
	afterNextRender,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ScannedProfileService } from '../../shared/profile/scanned-profile.service';
import { QrProfile } from '../../shared/profile/profile.model';

type ScanState = 'requesting' | 'scanning' | 'error';

@Component({
	imports: [RouterLink],
	templateUrl: './scan.component.html',
	styleUrl: './scan.component.scss',
})
export class ScanComponent {
	private readonly router = inject(Router);
	private readonly scannedService = inject(ScannedProfileService);
	private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	protected readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');
	protected readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

	protected readonly state = signal<ScanState>('requesting');
	protected readonly errorMsg = signal('');

	private stream: MediaStream | null = null;
	private rafId: number | null = null;

	constructor() {
		afterNextRender(() => {
			if (this.isBrowser) this.startCamera();
		});
	}

	private async startCamera(): Promise<void> {
		try {
			this.stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
				audio: false,
			});
			const video = this.videoRef()!.nativeElement;
			video.srcObject = this.stream;
			await video.play();
			this.state.set('scanning');
			this.tick();
		} catch (err) {
			this.state.set('error');
			this.errorMsg.set(err instanceof Error ? err.message : 'Camera access denied');
		}
	}

	private async tick(): Promise<void> {
		const video = this.videoRef()?.nativeElement;
		const canvas = this.canvasRef()?.nativeElement;
		if (!video || !canvas || video.readyState < 2) {
			this.rafId = requestAnimationFrame(() => this.tick());
			return;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext('2d')!;
		ctx.drawImage(video, 0, 0);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		const jsQR = (await import('jsqr')).default;
		const result = jsQR(imageData.data, imageData.width, imageData.height);

		if (result?.data) {
			this.handleResult(result.data);
			return;
		}

		this.rafId = requestAnimationFrame(() => this.tick());
	}

	private handleResult(raw: string): void {
		this.stopCamera();
		try {
			const parsed = JSON.parse(raw) as Record<string, unknown>;
			if (typeof parsed !== 'object' || !parsed || typeof parsed['name'] !== 'string') {
				throw new Error('Not a valid profile QR code');
			}
			const profile: QrProfile = { name: parsed['name'] as string };
			const optionals: (keyof Omit<QrProfile, 'name'>)[] = [
				'birthday', 'email', 'phone', 'website', 'telegram', 'github', 'company', 'position', 'bio',
			];
			for (const k of optionals) {
				if (typeof parsed[k] === 'string') profile[k] = parsed[k] as string;
			}
			this.scannedService.set(profile);
			this.router.navigate(['/view']);
		} catch {
			this.state.set('error');
			this.errorMsg.set('QR code is not a profilespace profile.');
			if (this.stream) this.startCamera();
		}
	}

	private stopCamera(): void {
		if (this.rafId !== null) cancelAnimationFrame(this.rafId);
		this.stream?.getTracks().forEach((t) => t.stop());
		this.stream = null;
	}

	ngOnDestroy(): void {
		this.stopCamera();
	}
}
