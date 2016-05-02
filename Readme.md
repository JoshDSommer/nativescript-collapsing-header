#NativeScript Collapsing Header Plugin for Android & iOS.

[![NativeScript Collapsing Header. Click to Play](https://img.youtube.com/vi/4grgEuX9mLQ/0.jpg)](https://www.youtube.com/embed/4grgEuX9mLQ)
###Install
`$ tns plugin add nativescript-collapsing-header`

###Example xml useage

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd"
	 xmlns:collapsingHeader="nativescript-collapsing-header"
	loaded="pageLoaded">
  	<collapsingHeader:CollapsingHeader>
		<collapsingHeader:Header class="header-template">
			<Label id="headerLabel" text="Collapsing Header"></Label>
		</collapsingHeader:Header>
		<collapsingHeader:Content class="body-template">
			<TextView editable="false" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque, est in viverra vehicula, enim lacus fermentum mi, vel tincidunt libero diam quis nulla. In sem tellus, eleifend quis egestas at, ultricies a neque. Cras facilisis lacinia velit ut lacinia. Phasellus fermentum libero et est ultricies venenatis sit amet ac lectus. Curabitur faucibus nisi id tellus vehicula luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc condimentum est id nibh volutpat tempor. Phasellus sodales velit vel dui feugiat, eget tincidunt tortor sollicitudin. Donec nec risus in purus interdum eleifend. Praesent placerat urna aliquet orci suscipit laoreet. In ac purus nec sapien rhoncus egestas.

			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque, est in viverra vehicula, enim lacus fermentum mi, vel tincidunt libero diam quis nulla. In sem tellus, eleifend quis egestas at, ultricies a neque. Cras facilisis lacinia velit ut lacinia. Phasellus fermentum libero et est ultricies venenatis sit amet ac lectus. Curabitur faucibus nisi id tellus vehicula luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc condimentum est id nibh volutpat tempor. Phasellus sodales velit vel dui feugiat, eget tincidunt tortor sollicitudin. Donec nec risus in purus interdum eleifend. Praesent placerat urna aliquet orci suscipit laoreet. In ac purus nec sapien rhoncus egestas.

			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque, est in viverra vehicula, enim lacus fermentum mi, vel tincidunt libero diam quis nulla. In sem tellus, eleifend quis egestas at, ultricies a neque. Cras facilisis lacinia velit ut lacinia. Phasellus fermentum libero et est ultricies venenatis sit amet ac lectus. Curabitur faucibus nisi id tellus vehicula luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc condimentum est id nibh volutpat tempor. Phasellus sodales velit vel dui feugiat, eget tincidunt tortor sollicitudin. Donec nec risus in purus interdum eleifend. Praesent placerat urna aliquet orci suscipit laoreet. In ac purus nec sapien rhoncus egestas.
			">
			</TextView>
		</collapsingHeader:Content>
	</collapsingHeader:CollapsingHeader>
</Page>
```
###Example css
```css
#headerLabel{
	font-size: 25;
	horizontal-align: center;
	color:#B2EBF2;
	margin-top: 20;
}
.header-template{
	background-color:#212121;
	height: 65;
	width: 100%;
}
.body-template TextView{
	font-size:20;
	padding:5 15;
	border:none;
}
```
To use the collapsing header plugin you need to first import it into your xml layout with  `xmlns:collapsingHeader="nativescript-collapsing-header"`

when using the collapsing header plugin you need at least two layout views inside of the ``<collapsingHeader:CollapsingHeader>`` element. ``<collapsingHeader:Header>`` and ``<collapsingHeader:Content>``.

The ``<collapsingHeader:Header>`` has a property called `dropShadow` if set to true it will create a small drop shadow effect on the bottom of the header.

##ListView support.
As of version 1.4.0 list view support has been added. Instead of a ``<collapsingHeader:Content>`` elment, add a ``<ListView>`` like you would normally, see below for and example.

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd"
	 xmlns:collapsingHeader="nativescript-collapsing-header"
	loaded="pageLoaded">
  	<collapsingHeader:CollapsingHeader>
		<collapsingHeader:Header class="header-template">
			<Label id="headerLabel" text="Collapsing Header"></Label>
		</collapsingHeader:Header>
		<ListView id="songList" items="{{items}}"  separatorColor="#333">
			<ListView.itemTemplate>
			<GridLayout columns="auto, *, auto" rows="auto"  class="list-item">
				<StackLayout row="0" col="1">
				<Label text="{{title}}" textWrap="true" class="title"></Label>
				<Label text="{{artist}}" textWrap="true" class="title-sub"></Label>
				</StackLayout>
			</GridLayout>
			</ListView.itemTemplate>
		</ListView>
	</collapsingHeader:CollapsingHeader>
</Page>
```

## iOS Only
to change the status bar color you there is a property for the ``<collapsingHeader:CollapsingHeader>`` element called `statusIosBarBackgroundColor` if not it defaults to white.

###Plugin Development Work Flow.

* Clone repository to your machine.
* First run `npm install`
* Then run `npm run setup` to prepare the demo project
* Build with `npm run build`
* Run and deploy to your device or emulator with `npm run demo.android` or `npm run demo.ios`


###Special thanks to:
[Nathan Walker](https://github.com/NathanWalker) for setting up the {N} plugin seed that I used to get this plugin up and running. More info can be found about it here:
https://github.com/NathanWalker/nativescript-plugin-seed

##License

[MIT](/LICENSE)