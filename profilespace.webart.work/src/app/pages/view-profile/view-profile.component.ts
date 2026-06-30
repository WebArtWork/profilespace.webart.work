import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ScannedProfileService } from '../../shared/profile/scanned-profile.service';

@Component({
	imports: [RouterLink],
	templateUrl: './view-profile.component.html',
	styleUrl: './view-profile.component.scss',
})
export class ViewProfileComponent {
	private readonly router = inject(Router);
	protected readonly scanned = inject(ScannedProfileService);
	protected readonly profile = this.scanned.profile;
	protected readonly Boolean = Boolean;

	constructor() {
		if (!this.scanned.profile()) {
			this.router.navigate(['/scan']);
		}
	}

	protected scanAnother(): void {
		this.scanned.clear();
		this.router.navigate(['/scan']);
	}
}
