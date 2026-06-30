import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./pages/profile-qr/profile-qr.component').then((m) => m.ProfileQrComponent),
	},
	{
		path: 'edit',
		loadComponent: () =>
			import('./pages/profile-form/profile-form.component').then((m) => m.ProfileFormComponent),
	},
	{
		path: 'scan',
		loadComponent: () =>
			import('./pages/scan/scan.component').then((m) => m.ScanComponent),
	},
	{
		path: 'view',
		loadComponent: () =>
			import('./pages/view-profile/view-profile.component').then((m) => m.ViewProfileComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
