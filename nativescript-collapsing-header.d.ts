import { GridLayout } from 'ui/layouts/grid-layout';
import { AddChildFromBuilder } from 'ui/core/view';
import { StackLayout } from 'ui/layouts/stack-layout';
import { CollapsingHeaderUtilities } from './collapsing-header-utilities';
export declare class Utilities extends CollapsingHeaderUtilities {
}
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
    _addChildFromBuilder: (name: string, value: any) => void;
}
