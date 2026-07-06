import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ThemeService } from '@wawjs/ngx-ui';
import { CompanyService } from '../../feature/company/company.service';

interface FooterPageLink {
	label: string;
	path: string;
}

@Component({
	selector: 'app-footer',
	imports: [NgOptimizedImage, RouterLink, TranslateDirective],
	templateUrl: './footer.component.html',
})
export class FooterComponent {
	private readonly _companyService = inject(CompanyService);
	private readonly _themeService = inject(ThemeService);

	protected readonly company = this._companyService.company;
	protected readonly currentYear = new Date().getFullYear();
	protected readonly logoSrc = computed(() =>
		this._themeService.mode() === 'dark' ? 'logo1.png' : 'logo.png',
	);
	protected readonly pageLinks = computed<FooterPageLink[]>(() => [
		{ label: 'Головна', path: '/' },
		{ label: 'Редагувати профіль', path: '/edit' },
		{ label: 'Сканувати QR', path: '/scan' },
	]);
}
