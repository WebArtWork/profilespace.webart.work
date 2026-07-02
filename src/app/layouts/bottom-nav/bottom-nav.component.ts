import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	selector: 'app-bottom-nav',
	imports: [RouterLink, RouterLinkActive, TranslateDirective],
	templateUrl: './bottom-nav.component.html',
	styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
	protected readonly items = [
		{ path: '/', icon: 'qr_code_2', label: 'Мій QR', exact: true },
		{ path: '/edit', icon: 'edit', label: 'Профіль', exact: false },
		{ path: '/scan', icon: 'qr_code_scanner', label: 'Сканер', exact: false },
	];
}
