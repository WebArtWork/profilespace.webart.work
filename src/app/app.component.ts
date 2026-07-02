import { DOCUMENT } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanonicalService } from '@wawjs/ngx-default';
import { LanguageService } from '@wawjs/ngx-translate';
import { environment } from '../environments/environment';
import { BottomNavComponent } from './layouts/bottom-nav/bottom-nav.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { TopbarComponent } from './layouts/topbar/topbar.component';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, TopbarComponent, FooterComponent, BottomNavComponent],
	template: `
		<div class="flex min-h-screen flex-col">
			<app-topbar />
			<main class="flex-1 pb-[4.5rem] sm:pb-0">
				<router-outlet />
			</main>
			<app-footer class="hidden sm:block" />
			<app-bottom-nav />
		</div>
	`,
})
export class App {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _document = inject(DOCUMENT);
	private readonly _languageService = inject(LanguageService);

	constructor() {
		this._canonicalService.initialize();

		effect(() => {
			const language = this._languageService.language();
			const htmlLang =
				environment.languages.find((item) => item.code === language)?.htmlLang ?? language;

			if (htmlLang) {
				this._document.documentElement.lang = htmlLang;
			}
		});
	}
}
