import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, schema, required } from '@angular/forms/signals';
import { ProfileStorageService } from '../../shared/profile/profile-storage.service';
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
	imports: [RouterLink],
	templateUrl: './profile-form.component.html',
	styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
	private readonly profileService = inject(ProfileStorageService);
	private readonly router = inject(Router);

	private readonly saved = this.profileService.profile();

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

	protected onSubmit(): void {
		this.profileForm().markAsTouched();
		if (this.profileForm().invalid()) return;

		const raw = this.model();
		const profile: QrProfile = { name: raw.name };
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
