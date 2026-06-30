import { Component, inject } from '@angular/core';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { CompanyService } from '../../feature/company/company.service';

@Component({
	imports: [TranslateDirective],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	protected readonly company = inject(CompanyService).company;
}
