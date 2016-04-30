import * as app from 'application';
import * as Platform from 'platform';
import {ScrollView, ScrollEventData} from 'ui/scroll-view';
import {GridLayout, ItemSpec, GridUnitType} from 'ui/layouts/grid-layout';
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


export interface IMinimumHeights {
	portrait: number;
	landscape: number;
}

export class CollapsingHeader extends GridLayout implements AddChildFromBuilder {
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
		let headerView: AbsoluteLayout = new AbsoluteLayout();
		let statusBarBackground: AbsoluteLayout = new AbsoluteLayout();
		let row = new ItemSpec(3, GridUnitType.star);
		let column = new ItemSpec(1, GridUnitType.star);
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

		this.on(GridLayout.loadedEvent, (data: any) => {
			//prevents re adding views on resume in android.
			if (!this._loaded) {
				this._loaded = true;
				this.addRow(row);
				this.addColumn(column);
				let wrapperStackLayout = new StackLayout();
				wrapperStackLayout.verticalAlignment = 'top';

				this.addChild(headerView);
				this.addChild(statusBarBackground);

				GridLayout.setRow(headerView, 1);
				GridLayout.setRow(statusBarBackground, 0);
				GridLayout.setColumn(headerView, 1);
				GridLayout.setColumn(statusBarBackground, 0);

				statusBarBackground.height = 25;
				statusBarBackground.width = this._minimumHeights.portrait;
				statusBarBackground.backgroundColor = new Color(this.statusIosBarBackgroundColor);
				statusBarBackground.verticalAlignment = 'top';
				statusBarBackground.marginTop = -25;
				//creates a new stack layout to wrap the content inside of the plugin.


				this._childLayouts.forEach(element => {
					if (element instanceof Content || element instanceof ListView) {
						contentView = element;
					}
				});
				this._childLayouts.forEach(element => {
					if (element instanceof Header) {
						headerView.addChild(element);
						if ((<Header>element).dropShadow) {
							headerView.height = element.height;
							headerView.addChild(utilities.addDropShadow(element.height, element.width));
						} else {
							headerView.height = element.height;
						}
						element.verticalAlignment = 'top';
					}
				});



				utilities.validateView(this, headerView, contentView);

				headerView.marginTop = 0;
				wrapperStackLayout.paddingTop = headerView.height;
				wrapperStackLayout.marginTop = 0;

				if (contentView instanceof Content) {
					wrapperStackLayout.addChild(contentView);
					this.addChild(scrollView);
					GridLayout.setRow(scrollView, 2);
					GridLayout.setColumn(scrollView, 2);
					scrollView.content = wrapperStackLayout;
					utilities.disableBounce(scrollView);

					utilities.addScrollEvent(scrollView, headerView);
				} else {

					wrapperStackLayout.addChild(contentView);
					contentView.verticalAlignment = 'top';

					utilities.disableBounce(contentView);

					this.addChild(wrapperStackLayout);
					GridLayout.setRow(wrapperStackLayout, 2);
					GridLayout.setColumn(wrapperStackLayout, 0);

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