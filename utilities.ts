import * as app from 'application';
import * as Platform from 'platform';
import {ScrollView, ScrollEventData} from 'ui/scroll-view';
import {GridLayout, ItemSpec, GridUnitType} from 'ui/layouts/grid-layout';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {View, AddChildFromBuilder} from 'ui/core/view';
import {Label} from 'ui/label';
import { ListView } from 'ui/list-view';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Color} from 'color';
import {CollapsingHeader, Header, Content, IMinimumHeights} from './nativescript-collapsing-header';
import { SwipeDirection, GestureEventData, SwipeGestureEventData, PanGestureEventData } from 'ui/gestures';


export class CollapsingUtilities {

	public static disableBounce(view: ScrollView | ListView): void {
		//no ui bounce. causes problems
		if (app.ios) {
			view.ios.bounces = false;
		} else if (app.android && view.android != null) {
			view.android.setOverScrollMode(2);
		}

	}

	public static validateView(parent: GridLayout, headerView: AbsoluteLayout, contentView: Content | ListView): void {
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

	public static addListScrollEvent(listView: ListView, headerView: AbsoluteLayout) {
		if (app.android) {
			//listView.height = listView.height + headerView.height;

			const animateHideHeader = (headerHidden: boolean, headerView: AbsoluteLayout, listView: ListView): boolean => {
				if (headerHidden === false) {
					headerView.animate({
						translate: { x: 0, y: (headerView.height * -1) },
						duration: 700,
					});
					listView.animate({
						translate: { x: 0, y: (headerView.height * -1) },
						duration: 700,
					});
					headerHidden = true;
				}
				return headerHidden;
			};
			const animateShowHeader = (headerHidden: boolean, headerView: AbsoluteLayout, listView: ListView): boolean => {
				if (headerHidden === true) {
					headerView.animate({
						translate: { x: 0, y: 0 },
						duration: 400,
					});
					listView.animate({
						translate: { x: 0, y: 0 },
						duration: 400,
					});
					headerHidden = false;
				}
				return headerHidden;
			};

			let headerHidden: boolean = false;
			let mLastFirstVisibleItem: number;
			listView.height = <any>'100%';
			listView.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener(<android.widget.AbsListView.IOnScrollListener>{

				onScrollStateChanged: function (view: android.widget.AbsListView, scrollState: number) {

				},
				onScroll: function (view: android.widget.AbsListView, firstVisibleItem: number, visibleItemCount: number, totalItemCount: number) {
					if (mLastFirstVisibleItem < firstVisibleItem) {
						console.log("SCROLLING DOWN " + firstVisibleItem);
						headerHidden = animateHideHeader(headerHidden, headerView, listView);
					}
					if (mLastFirstVisibleItem > firstVisibleItem) {
						console.log("SCROLLING UP" + firstVisibleItem);
						headerHidden = animateShowHeader(headerHidden, headerView, listView);

						if (firstVisibleItem === 0) {
							listView.marginTop = headerView.height;
							console.log(listView.marginTop + " should be " + headerView.height)
						}
					}
					mLastFirstVisibleItem = firstVisibleItem;
				}
			}));
		} else if (app.ios) {
			listView.on('pan', (args: PanGestureEventData) => {
				console.log('swiping...');
				console.log(args.deltaY);
				let marginTop = 0;
				if (args.deltaY < 0) {
					// marginTop = args.deltaY;
					// if (marginTop < (headerView.height * -1)) {
					// 	marginTop = (headerView.height * -1);
					// }
				} else {
					// if (baseOffset < 0) {
					// 	marginTop = (baseOffset - args.deltaY * -1);
					// // } else {
					// marginTop = headerView.marginTop;
					// marginTop = marginTop + args.deltaY;
					// // }
					// if (marginTop > 0) {
					// 	marginTop = 0;
					// }
				}
				// console.log('margin top : ' + marginTop);
				// headerView.marginTop = marginTop;
				// listView.marginTop = headerView.marginTop;
			});
		}
	}

	public static addScrollEvent(scrollView: ScrollView, headerView: AbsoluteLayout) {
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

	public static displayDevWarning(parent: GridLayout, message: string, ...viewsToCollapse: View[]): void {
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