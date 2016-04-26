import { ScrollView } from 'ui/scroll-view';
import { GridLayout } from 'ui/layouts/grid-layout';
import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { View } from 'ui/core/view';
import { StackLayout } from 'ui/layouts/stack-layout';
export declare class Header extends StackLayout {
    private _dropShadow;
    dropShadow: boolean;
    constructor();
}
export declare class Content extends StackLayout {
}
export interface IMinimumHeights {
    portrait: number;
    landscape: number;
}
export declare class CollapsingHeader extends GridLayout {
    header: Header;
    content: Content;
    private _childLayouts;
    private _topOpacity;
    private _loaded;
    private _minimumHeights;
    private _statusBarBackgroundColor;
    statusIosBarBackgroundColor: string;
    android: any;
    ios: any;
    constructor();
    private constructView();
    disableBounce(scrollView: ScrollView): void;
    validateView(headerView: AbsoluteLayout, contentView: Content): void;
    addScrollEvent(scrollView: ScrollView, headerView: AbsoluteLayout): void;
    setMinimumHeight(contentView: Content, minHeight: number): void;
    getMinimumHeights(): IMinimumHeights;
    addDropShadow(marginTop: number, width: number): StackLayout;
    private shadowView(opacity, width);
    displayDevWarning(message: string, ...viewsToCollapse: View[]): void;
}
