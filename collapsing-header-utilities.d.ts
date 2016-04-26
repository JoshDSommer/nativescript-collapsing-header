import { ScrollView } from 'ui/scroll-view';
import { GridLayout } from 'ui/layouts/grid-layout';
import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { View } from 'ui/core/view';
import { StackLayout } from 'ui/layouts/stack-layout';
import { Content, IMinimumHeights } from './nativescript-collapsing-header';
export declare class CollapsingHeaderUtilities {
    disableBounce(scrollView: ScrollView): void;
    validateView(parent: GridLayout, headerView: AbsoluteLayout, contentView: Content): void;
    addScrollEvent(scrollView: ScrollView, headerView: AbsoluteLayout): void;
    setMinimumHeight(contentView: Content, minHeight: number): void;
    getMinimumHeights(): IMinimumHeights;
    addDropShadow(marginTop: number, width: number): StackLayout;
    private shadowView(opacity, width);
    displayDevWarning(parent: GridLayout, message: string, ...viewsToCollapse: View[]): void;
}
