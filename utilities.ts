import * as app from 'application';
import * as Platform from 'platform';
import {ScrollView, ScrollEventData} from 'ui/scroll-view';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {View, AddChildFromBuilder} from 'ui/core/view';
import {Label} from 'ui/label';
import { ListView } from 'ui/list-view';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Color} from 'color';
import {CollapsingHeader, Header, Content, IMinimumHeights} from './nativescript-collapsing-header';
import { SwipeDirection, GestureEventData, SwipeGestureEventData, PanGestureEventData } from 'ui/gestures';


export class CollapsingUtilities {

	private static animateHideHeader(headerHidden: boolean, headerView: AbsoluteLayout, content: ListView | ScrollView): boolean {
		if (headerHidden === false) {
			headerView.animate({
				translate: { x: 0, y: (headerView.height * -1) },
				duration: 500,
			});
			if (content instanceof ListView) {
				content.animate({
					translate: { x: 0, y: (headerView.height * -1) },
					duration: 500,
				});
			}

			headerHidden = true;
		}
		return headerHidden;
	};
	private static animateShowHeader(headerHidden: boolean, headerView: AbsoluteLayout, content: ListView | ScrollView): boolean {
		if (headerHidden === true) {
			headerView.animate({
				translate: { x: 0, y: 0 },
				duration: 400,
			});
			if (content instanceof ListView) {
				content.animate({
					translate: { x: 0, y: 0 },
					duration: 400,
				});
			}
			headerHidden = false;
		}
		return headerHidden;
	};

	public static disableBounce(view: ScrollView | ListView): void {
		//no ui bounce. causes problems
		if (app.ios) {
			view.ios.bounces = false;
		} else if (app.android && view.android != null) {
			view.android.setOverScrollMode(2);
		}
	}

	public static validateView(parent: AbsoluteLayout, headerView: AbsoluteLayout, contentView: Content | ListView): void {
		if (headerView == null || contentView == null) {
			this.displayDevWarning(parent, 'ScrollView Setup Invalid. You must have Header and Content tags',
				headerView,
				contentView, contentView);
			return;
		}
		if (isNaN(headerView.height)) {
			this.displayDevWarning(parent, 'Header MUST have a height set.',
				headerView, contentView);
			return;
		}
	}

	public static addListScrollEvent(listView: ListView, headerView: StackLayout) {
		let headerHidden: boolean = false;
		const animateHideHeader = this.animateHideHeader;
		const animateShowHeader = this.animateShowHeader;

		listView.height = <any>'100%';

		if (app.android) {

			let mLastFirstVisibleItem: number;
			listView.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener(<android.widget.AbsListView.IOnScrollListener>{

				onScrollStateChanged: function (view: android.widget.AbsListView, scrollState: number) {

				},
				onScroll: function (view: android.widget.AbsListView, firstVisibleItem: number, visibleItemCount: number, totalItemCount: number) {
					if (mLastFirstVisibleItem < firstVisibleItem) {
						headerHidden = animateHideHeader(headerHidden, headerView, listView);
					}
					if (mLastFirstVisibleItem > firstVisibleItem) {
						headerHidden = animateShowHeader(headerHidden, headerView, listView);
					}
					mLastFirstVisibleItem = firstVisibleItem;
				}
			}));
		} else if (app.ios) {
			listView.on('pan', (args: PanGestureEventData) => {
				if (args.deltaY < 0) {
					headerHidden = animateHideHeader(headerHidden, headerView, listView);

				} else {
					headerHidden = animateShowHeader(headerHidden, headerView, listView);
				}
			});
		}
	}

	public static addScrollEvent(scrollView: ScrollView, headerView: StackLayout) {
		let prevOffset = -10;
		let headerHidden: boolean = false;
		const animateHideHeader = this.animateHideHeader;
		const animateShowHeader = this.animateShowHeader;
		let wrapperStackLayout = <StackLayout>scrollView.content;
		scrollView.on(ScrollView.scrollEvent, (args: ScrollEventData) => {
			console.log(scrollView.verticalOffset);
			if (prevOffset <= scrollView.verticalOffset) {
				headerHidden = animateHideHeader(headerHidden, headerView, scrollView);
				wrapperStackLayout.paddingTop = 0;
			} else {
				headerHidden = animateShowHeader(headerHidden, headerView, scrollView);
				wrapperStackLayout.paddingTop = headerView.height;
			}
			prevOffset = scrollView.verticalOffset;
		});
	}

	public static setMinimumHeight(contentView: Content, minHeight: number): void {
		(<any>contentView).minHeight = minHeight;
	}

	public static getMinimumHeights(): IMinimumHeights {
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

	public static addDropShadow(marginTop: number, width: number): StackLayout {
		let wrapper = new StackLayout();
		wrapper.width = width;
		wrapper.height = 3;
		wrapper.marginTop = marginTop;
		wrapper.addChild(this.shadowView(0.4, width));
		wrapper.addChild(this.shadowView(0.2, width));
		wrapper.addChild(this.shadowView(0.05, width));
		return wrapper;
	}

	private static shadowView(opacity: number, width: number): StackLayout {
		let shadowRow = new StackLayout();
		shadowRow.backgroundColor = new Color('black');
		shadowRow.opacity = opacity;
		shadowRow.height = 1;
		return shadowRow;
	}

	public static displayDevWarning(parent: AbsoluteLayout, message: string, ...viewsToCollapse: View[]): void {
		let warningText = new Label();
		warningText.text = message;
		warningText.color = new Color('red');
		warningText.textWrap = true;
		warningText.marginTop = 50;
		parent.addChild(warningText);
		viewsToCollapse.forEach((view: View) => {
			if (view != null) {
				view.visibility = 'collapse';
			}
		});
	}
}