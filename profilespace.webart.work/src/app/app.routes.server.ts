import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{
		path: 'scan',
		renderMode: RenderMode.Client,
	},
	{
		path: 'view',
		renderMode: RenderMode.Client,
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
