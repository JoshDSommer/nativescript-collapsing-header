import * as app from 'application';
import * as Platform from 'platform';
import {ScrollView, ScrollEventData} from 'ui/scroll-view';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {View, AddChildFromBuilder} from 'ui/core/view';
import {Label} from 'ui/label';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Color} from 'color';
import {ListView} from 'ui/list-view';
import {CollapsingUtilities as utilities} from './utilities';

export class Header extends StackLayout {
	private _dropShadow: boolean;

	get dropShadow(): boolean {
		return this._dropShadow;
	}
	set dropShadow(value: boolean) {
		this._dropShadow = value;
	}

	constructor() {
		super();
		this.dropShadow = false;
	}
}

export class Content extends StackLayout {

}
export class ListViewContent extends ListView {

}


export interface IMinimumHeights {
	portrait: number;
	landscape: number;
}

export class CollapsingHeader extends AbsoluteLayout implements AddChildFromBuilder {
	public header: Header;
	public content: Content;

	private _childLayouts: View[];
	private _topOpacity: number;
	private _loaded: boolean;
	private _minimumHeights: IMinimumHeights;
	private _statusBarBackgroundColor: string;

	get statusIosBarBackgroundColor(): string {
		return this._statusBarBackgroundColor;
	}

	set statusIosBarBackgroundColor(color: string) {
		this._statusBarBackgroundColor = color;
	}

	get android(): any {
		return;
	}

	get ios(): any {
		return;
	}

	constructor() {
		super();
		this.constructView();
	}

	private constructView(): void {
		this._childLayouts = [];
		let contentView: Content | ListView;
		let scrollView: ScrollView = new ScrollView();
		let viewsToFade: View[];
		let maxTopViewHeight: number;
		let controlsToFade: string[];
		let headerView: StackLayout = new StackLayout();
		let statusBarBackground: StackLayout = new StackLayout();
		let invalidSetup = false;

		this._minimumHeights = utilities.getMinimumHeights();
		if (this.statusIosBarBackgroundColor == null) {
			this.statusIosBarBackgroundColor = '#fff';
		}
		//must set the vertical alignmnet or else there is issues with margin-top of 0 being the middle of the screen.
		this.verticalAlignment = 'top';
		scrollView.verticalAlignment = 'top';
		headerView.verticalAlignment = 'top';
		this._topOpacity = 1;
		this._loaded = false;

		this.on(AbsoluteLayout.loadedEvent, (data: any) => {
			//prevents re adding views on resume in android.
			if (!this._loaded) {
				this._loaded = true;

				let wrapperStackLayout = new StackLayout();
				wrapperStackLayout.verticalAlignment = 'top';

				scrollView.width = <any>'100%';
				scrollView.height = <any>'100%';
				wrapperStackLayout.width = <any>'100%';

				this.addChild(scrollView);
				this.addChild(headerView);
				this.addChild(wrapperStackLayout);
				this.addChild(statusBarBackground);

				statusBarBackground.height = 25;
				statusBarBackground.backgroundColor = new Color(this.statusIosBarBackgroundColor);
				statusBarBackground.verticalAlignment = 'top';
				statusBarBackground.width = <any>'100%';
				AbsoluteLayout.setTop(statusBarBackground, -25);
				//creates a new stack layout to wrap the content inside of the plugin.

				this._childLayouts.forEach(element => {
					if (element instanceof Content || element instanceof ListView) {
						contentView = element;
					}
				});
				this._childLayouts.forEach(element => {
					if (element instanceof Header || element.className === 'header-template') {
						headerView.addChild(element);
						if (element instanceof Header && (<Header>element).dropShadow) {
							headerView.height = element.height;
							headerView.addChild(utilities.addDropShadow(element.height, element.width));
						} else {
							headerView.height = element.height;
						}
						element.verticalAlignment = 'top';
						headerView.width = <any>'100%';
						element.width = <any>'100%';
					}
				});

				utilities.validateView(this, headerView, contentView);

				headerView.marginTop = 0;
				wrapperStackLayout.marginTop = 0;

				if (contentView instanceof Content) {
					this.removeChild(wrapperStackLayout);

					//AbsoluteLayout.setTop(scrollView, headerView.height);
					wrapperStackLayout.addChild(contentView);
					wrapperStackLayout.paddingTop = headerView.height;

					scrollView.content = wrapperStackLayout;
					utilities.disableBounce(scrollView);

					utilities.addScrollEvent(scrollView, headerView);
				} else {
					wrapperStackLayout.height = <any>'100%';

					wrapperStackLayout.addChild(contentView);
					contentView.verticalAlignment = 'top';
					contentView.marginTop = headerView.height;

					utilities.disableBounce(contentView);

					utilities.addListScrollEvent(contentView, headerView);
				}
			}
		});
	}

	_addChildFromBuilder = (name: string, value: any) => {
		if (value instanceof View) {
			this._childLayouts.push(value);
		}
	};
}