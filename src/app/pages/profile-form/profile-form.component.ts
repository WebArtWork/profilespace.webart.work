import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { form, schema, required } from '@angular/forms/signals';
import { ProfileStorageService } from '../../shared/profile/profile-storage.service';
import { PhotoStorageService } from '../../shared/profile/photo-storage.service';
import { QrProfile } from '../../shared/profile/profile.model';

interface ProfileFormModel {
	name: string;
	birthday: string;
	email: string;
	phone: string;
	website: string;
	telegram: string;
	github: string;
	company: string;
	position: string;
	bio: string;
}

@Component({
	imports: [RouterLink, TranslateDirective],
	templateUrl: './profile-form.component.html',
	styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
	private readonly profileService = inject(ProfileStorageService);
	private readonly photoService = inject(PhotoStorageService);
	private readonly router = inject(Router);

	private readonly saved = this.profileService.profile();

	protected readonly cameraInput = viewChild<ElementRef<HTMLInputElement>>('cameraInput');
	protected readonly galleryInput = viewChild<ElementRef<HTMLInputElement>>('galleryInput');

	protected readonly photo = this.photoService.photo;
	protected readonly menuOpen = signal(false);

	protected readonly model = signal<ProfileFormModel>({
		name: this.saved?.name ?? '',
		birthday: this.saved?.birthday ?? '',
		email: this.saved?.email ?? '',
		phone: this.saved?.phone ?? '',
		website: this.saved?.website ?? '',
		telegram: this.saved?.telegram ?? '',
		github: this.saved?.github ?? '',
		company: this.saved?.company ?? '',
		position: this.saved?.position ?? '',
		bio: this.saved?.bio ?? '',
	});

	protected readonly profileForm = form(this.model, schema<ProfileFormModel>((p) => {
		required(p.name);
	}));

	protected set(key: keyof ProfileFormModel, value: string): void {
		this.model.update((p) => ({ ...p, [key]: value }));
	}

	protected toggleMenu(): void {
		this.menuOpen.update((v) => !v);
	}

	protected openCamera(): void {
		this.menuOpen.set(false);
		this.cameraInput()?.nativeElement.click();
	}

	protected openGallery(): void {
		this.menuOpen.set(false);
		this.galleryInput()?.nativeElement.click();
	}

	protected async onFileSelected(event: Event): Promise<void> {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const [full, thumb] = await Promise.all([
			this.photoService.compress(file),
			this.photoService.thumbnail(file),
		]);
		this.photoService.save(full);
		this.photoService.saveThumb(thumb);
		(event.target as HTMLInputElement).value = '';
	}

	protected removePhoto(): void {
		this.menuOpen.set(false);
		this.photoService.clear();
	}

	protected onSubmit(): void {
		this.profileForm().markAsTouched();
		if (this.profileForm().invalid()) return;

		const raw = this.model();
		const profile: QrProfile = {
			name: raw.name,
			...(this.photoService.thumb() ? { photo: this.photoService.thumb()! } : {}),
		};
		const optionals: (keyof Omit<ProfileFormModel, 'name'>)[] = [
			'birthday', 'email', 'phone', 'website', 'telegram', 'github', 'company', 'position', 'bio',
		];
		for (const k of optionals) {
			if (raw[k]) profile[k] = raw[k];
		}

		this.profileService.save(profile);
		this.router.navigate(['/']);
	}
}
