import { GridLayout } from 'ui/layouts/grid-layout';
import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { View, AddChildFromBuilder } from 'ui/core/view';
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
export declare class CollapsingHeader extends GridLayout implements AddChildFromBuilder {
    private _controlsToFade;
    private _childLayouts;
    private _includesAnchored;
    private _topOpacity;
    private _loaded;
    private _minimumHeights;
    controlsToFade: string;
    android: any;
    ios: any;
    constructor();
    setMinimumHeight(contentView: Content, anchoredRow: AbsoluteLayout, minHeight: number): void;
    getMinimumHeights(): IMinimumHeights;
    addDropShadow(marginTop: number, width: number): StackLayout;
    shadowView(opacity: number, width: number): StackLayout;
    displayDevWarning(message: string, ...viewsToCollapse: View[]): void;
    _addChildFromBuilder: (name: string, value: any) => void;
}
