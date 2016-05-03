import { ScrollView } from 'ui/scroll-view';
import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { View } from 'ui/core/view';
import { ListView } from 'ui/list-view';
import { StackLayout } from 'ui/layouts/stack-layout';
import { Content, IMinimumHeights } from './nativescript-collapsing-header';
export declare class CollapsingUtilities {
    private static animateHideHeader(headerHidden, headerView, content);
    private static animateShowHeader(headerHidden, headerView, content);
    static disableBounce(view: ScrollView | ListView): void;
    static validateView(parent: AbsoluteLayout, headerView: AbsoluteLayout, contentView: Content | ListView): void;
    static addListScrollEvent(listView: ListView, headerView: AbsoluteLayout | StackLayout): void;
    static addScrollEvent(scrollView: ScrollView, headerView: AbsoluteLayout): void;
    static setMinimumHeight(contentView: Content, minHeight: number): void;
    static getMinimumHeights(): IMinimumHeights;
    static addDropShadow(marginTop: number, width: number): StackLayout;
    private static shadowView(opacity, width);
    static displayDevWarning(parent: AbsoluteLayout, message: string, ...viewsToCollapse: View[]): void;
}
