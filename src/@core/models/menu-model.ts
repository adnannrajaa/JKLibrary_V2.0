
export interface CoreMenuItem {
	moduleId: number;
	isAssigned: boolean;
	id: string;
	title: string;
	url?: string;
	type: string;
	role?: Array<string>;
	translate?: string;
	icon?: string;
	disabled?: boolean;
	hidden?: boolean;
	classes?: string;
	exactMatch?: boolean;
	externalUrl?: boolean;
	openInNewTab?: boolean;
	badge?: {
		title?: string;
		translate?: string;
		classes?: string;
	};
	children?: CoreMenuItem[];
}

export interface CoreMenu extends CoreMenuItem {
	children?: CoreMenuItem[];
}

