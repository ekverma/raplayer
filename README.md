# RA Player

RA Player is a web video player built from the ground up for an HTML5 world using Preact library which enables annotation.

## Features
* [preact](https://github.com/developit/preact)
* [unistore](https://github.com/developit/unistore)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [eslint](http://eslint.org)

## Requirements
* node `^5.6.0`
* npm `^3.0.0`

### Install from source

First, clone the project:

```bash
$ git clone https://github.com/MindTickle/raplayer.git
$ cd raplayer
$ npm install    # Install project dependencies
$ npm build or npm build:dev
```
## Usage

```javascript 
$ const raPlayer = new RaPlayer(playerConf);
$ raPlayer.setup();
```

## API
RaPlayer accepts following options:
 
```javascript 
 {
 	targetVideoContainer: < string > ,
 	targetCommentContainer: < string > ,
 	id: < string > ,
 	showControlsOnly: true | false,
 	controlOptions: true | false,
 	primaryTracks: Array,
 	secondaryTracks: Array,
 	app: {
 		cname: < string > ,
 		socialId: < string > ,
 		subjectId: < string > ,
 		learnerId: < string > ,
 		entityId: < string > ,
 		author: Object
 	},
 	showOnboarding: true | false,
 	downloadSrc: < string > ,
 	edit: $scope.isAddingCommentAllowed,
 	onRenderComplete: callback,
 	onCommentPaneRender: callback,
 	filter: {
 		authors: Array of Object
 	}
 }
```

Where track accept argument of following type:

```javascript
[{
	src: '720p.mp4',
	label: '360p'
}, {
	src: '360p.mp4',
	label: '144p'
}]
 
 ```

## Development

For faster local development with this module, you can link them with npm as described below:

```bash
$ cd ~/raplayer
$ npm link

$ cd ~/your-project
$ npm link raplayer

```


## Deployment

This project follows semantic versioning.We release patch versions for bugfixes, minor versions for new features, and major versions for any breaking changes

```bash
$ npm version patch
$ npm version minor
$ npm version major

```


