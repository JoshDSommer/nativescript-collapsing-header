import * as app from 'application';
import * as Platform from 'platform';
import {ScrollView, ScrollEventData} from 'ui/scroll-view';
import {GridLayout, ItemSpec, GridUnitType} from 'ui/layouts/grid-layout';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {View} from 'ui/core/view';
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

export class CollapsingHeader extends GridLayout  {
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
		let contentView: Content;
		let scrollView: ScrollView = new ScrollView();
		let viewsToFade: View[];
		let maxTopViewHeight: number;
		let controlsToFade: string[];
		let headerView: AbsoluteLayout = new AbsoluteLayout();
		let statusBarBackground: AbsoluteLayout = new AbsoluteLayout();
		let row = new ItemSpec(3, GridUnitType.star);
		let column = new ItemSpec(1, GridUnitType.star);
		let invalidSetup = false;
		this._minimumHeights = this.getMinimumHeights();
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

				//if the childlayouts isnt' set.
				if (this._childLayouts.length == 0) {
					//itterate through and set child layous
					this.eachLayoutChild((view: View, isLast: boolean) => {
						this._unregisterLayoutChild(view);
						this._childLayouts.push(view);
					});
				}

				this._loaded = true;
				this.addRow(row);
				this.addColumn(column);
				this.addChild(scrollView);
				this.addChild(headerView);
				this.addChild(statusBarBackground);

				GridLayout.setRow(scrollView, 2);
				GridLayout.setRow(headerView, 1);
				GridLayout.setRow(statusBarBackground, 0);
				GridLayout.setColumn(scrollView, 2);
				GridLayout.setColumn(headerView, 1);
				GridLayout.setColumn(statusBarBackground, 0);

				statusBarBackground.height = 25;
				statusBarBackground.width = this._minimumHeights.portrait;
				statusBarBackground.backgroundColor = new Color(this.statusIosBarBackgroundColor);
				statusBarBackground.verticalAlignment = 'top';
				statusBarBackground.marginTop = -25;
				//creates a new stack layout to wrap the content inside of the plugin.
				let wrapperStackLayout = new StackLayout();
				scrollView.content = wrapperStackLayout;
				this.disableBounce(scrollView);

				this._childLayouts.forEach(element => {
					if (element instanceof Content) {
						this.removeChild(element); //rmoves the elment from the parent for manipulation
						wrapperStackLayout.addChild(element);
						contentView = element;
					}
				});
				this._childLayouts.forEach(element => {
					if (element instanceof Header) {
						this.removeChild(element);

						headerView.addChild(element);
						if ((<Header>element).dropShadow) {
							headerView.height = element.height;
							headerView.addChild(this.addDropShadow(element.height, element.width));
						} else {
							headerView.height = element.height;
						}
						element.verticalAlignment = 'top';
					}
				});

				this.validateView(headerView, contentView);

				headerView.marginTop = 0;
				wrapperStackLayout.paddingTop = headerView.height;
				wrapperStackLayout.marginTop = 0;

				this.addScrollEvent(scrollView, headerView);

			}
		});
	}

	public disableBounce(scrollView: ScrollView): void {
		//no ui bounce. causes problems
		if (app.ios) {
			scrollView.ios.bounces = false;
		} else if (app.android) {
			scrollView.android.setOverScrollMode(2);
		}

	}

	public validateView(headerView: AbsoluteLayout, contentView: Content): void {
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
	}

	public addScrollEvent(scrollView: ScrollView, headerView: AbsoluteLayout) {
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

	public setMinimumHeight(contentView: Content, minHeight: number): void {
		contentView.minHeight = minHeight;
	}

	public getMinimumHeights(): IMinimumHeights {
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

	public addDropShadow(marginTop: number, width: number): StackLayout {
		let wrapper = new StackLayout();
		wrapper.width = width;
		wrapper.height = 3;
		wrapper.marginTop = marginTop;
		wrapper.addChild(this.shadowView(0.4, width));
		wrapper.addChild(this.shadowView(0.2, width));
		wrapper.addChild(this.shadowView(0.05, width));
		return wrapper;
	}

	private shadowView(opacity: number, width: number): StackLayout {
		let shadowRow = new StackLayout();
		shadowRow.backgroundColor = new Color('black');
		shadowRow.opacity = opacity;
		shadowRow.height = 1;
		return shadowRow;
	}

	public displayDevWarning(message: string, ...viewsToCollapse: View[]): void {
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
}