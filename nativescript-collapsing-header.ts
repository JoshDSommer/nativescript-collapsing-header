import * as app from 'application';
import * as Platform from 'platform';
import {ScrollView, ScrollEventData} from 'ui/scroll-view';
import {GridLayout, ItemSpec, GridUnitType} from 'ui/layouts/grid-layout';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {View, AddChildFromBuilder} from 'ui/core/view';
import {Label} from 'ui/label';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Color} from 'color';

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
	private _controlsToFade: string;
	private _childLayouts: View[];
	private _includesAnchored: boolean;
	private _topOpacity: number;
	private _loaded: boolean;
	private _minimumHeights: IMinimumHeights;

	get controlsToFade(): string {
		return this._controlsToFade;
	}

	set controlsToFade(value: string) {
		this._controlsToFade = value;
	}

	get android(): any {
		return;
	}

	get ios(): any {
		return;
	}

	constructor() {
		super();
		this._childLayouts = [];
		let contentView: Content;
		let scrollView: ScrollView = new ScrollView();
		let viewsToFade: View[];
		let maxTopViewHeight: number;
		let controlsToFade: string[];
		let headerView: AbsoluteLayout = new AbsoluteLayout();
		let row = new ItemSpec(2, GridUnitType.star);
		let column = new ItemSpec(1, GridUnitType.star);
		let invalidSetup = false;
		this._minimumHeights = this.getMinimumHeights();

		//must set the vertical alignmnet or else there is issues with margin-top of 0 being the middle of the screen.
		this.verticalAlignment = 'top';
		scrollView.verticalAlignment = 'top';
		headerView.verticalAlignment = 'top';
		this._includesAnchored = false;
		this._topOpacity = 1;
		this._loaded = false;

		this.on(GridLayout.loadedEvent, (data: any) => {
			//prevents re adding views on resume in android.
			if (!this._loaded) {
				this._loaded = true;

				this.addRow(row);
				this.addColumn(column);
				this.addChild(scrollView);
				this.addChild(headerView);

				GridLayout.setRow(scrollView, 1);
				GridLayout.setRow(headerView, 0);
				GridLayout.setColumn(scrollView, 1);
				GridLayout.setColumn(headerView, 0);

				//creates a new stack layout to wrap the content inside of the plugin.
				let wrapperStackLayout = new StackLayout();
				scrollView.content = wrapperStackLayout;

				//no ui bounce. causes problems
				if (app.ios) {
					scrollView.ios.bounces = false;
				} else if (app.android) {
					scrollView.android.setOverScrollMode(2);
				}

				this._childLayouts.forEach(element => {
					if (element instanceof Content) {
						wrapperStackLayout.addChild(element);
						contentView = element;
					}
				});
				this._childLayouts.forEach(element => {
					if (element instanceof Header) {
						headerView.addChild(element);
						if ((<Header>element).dropShadow) {
							headerView.height = element.height;
							headerView.addChild(this.addDropShadow(element.height, element.width));
						} else {
							headerView.height = element.height;
						}
						element.verticalAlignment = 'top';
						this._includesAnchored = true;
					}
				});

				if (headerView == null || contentView == null) {
					this.displayDevWarning('ScrollView Setup Invalid. You must have Header and Content tags',
						headerView,
						contentView, contentView);
					return;
				}
				if (isNaN(headerView.height)) {
					this.displayDevWarning('Header MUST have a height set.',
						headerView, contentView);
					return;
				}

				headerView.marginTop = 0;
				wrapperStackLayout.paddingTop = headerView.height;
				wrapperStackLayout.marginTop = 0;

				let prevOffset = -10;
				let baseOffset = 0;
				scrollView.on(ScrollView.scrollEvent, (args: ScrollEventData) => {
					//leaving in the up/down detection as it may be handy in the future.
					if (prevOffset <= scrollView.verticalOffset) {
						//when scrolling down
						if (baseOffset > scrollView.verticalOffset) {
							baseOffset = scrollView.verticalOffset;
						}
						headerView.marginTop = baseOffset - scrollView.verticalOffset;
						if (headerView.marginTop < (headerView.height * -1)) {
							headerView.marginTop = (headerView.height * -1);
						}
					} else {
						//scrolling up,
						if (baseOffset < scrollView.verticalOffset) {
							baseOffset = scrollView.verticalOffset;
						}
						headerView.marginTop = headerView.marginTop + 3;
						if (headerView.marginTop > 0) {
							headerView.marginTop = 0;
						}
					}
					//this accounts for a fast scroll that reaches the top with the header partially shown.
					if (scrollView.verticalOffset === 0) {
						headerView.marginTop = 0;
					}
					prevOffset = scrollView.verticalOffset;
				});
			}
		});
	}
	setMinimumHeight(contentView: Content, anchoredRow: AbsoluteLayout, minHeight: number): void {
		if (this._includesAnchored) {
			minHeight = minHeight - (anchoredRow.height * 0.9); //0.9 is to give it a little bit extra space.
		}
		contentView.minHeight = minHeight;
	}

	getMinimumHeights(): IMinimumHeights {
		let height1 = Platform.screen.mainScreen.heightDIPs;
		let height2 = Platform.screen.mainScreen.widthDIPs;
		//if the first hieght is lager than the second hiehgt it's the portrait views min hieght.
		if (height1 > height2) {
			return {
				portrait: height1,
				landscape: height2
			};
		} else {
			return {
				portrait: height2,
				landscape: height1
			};
		}
	}

	addDropShadow(marginTop: number, width: number): StackLayout {
		let wrapper = new StackLayout();
		wrapper.width = width;
		wrapper.height = 3;
		wrapper.marginTop = marginTop;
		wrapper.addChild(this.shadowView(0.4, width));
		wrapper.addChild(this.shadowView(0.2, width));
		wrapper.addChild(this.shadowView(0.05, width));
		return wrapper;
	}

	shadowView(opacity: number, width: number): StackLayout {
		let shadowRow = new StackLayout();
		shadowRow.backgroundColor = new Color('black');
		shadowRow.opacity = opacity;
		shadowRow.height = 1;
		return shadowRow;
	}

	displayDevWarning(message: string, ...viewsToCollapse: View[]): void {
		let warningText = new Label();
		warningText.text = message;
		warningText.color = new Color('red');
		warningText.textWrap = true;
		warningText.marginTop = 50;
		this.addChild(warningText);
		viewsToCollapse.forEach((view: View) => {
			if (view != null) {
				view.visibility = 'collapse';
			}
		});
	}

	_addChildFromBuilder = (name: string, value: any) => {
		if (value instanceof View) {
			this._childLayouts.push(value);
		}
	};
}