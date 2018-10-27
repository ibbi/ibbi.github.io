var CachedCanvases = new Object(); 

function CreateCanvasCached(name) {
	if (!CachedCanvases[name]) {
		var canvas = document.createElement('canvas');
		CachedCanvases[name] = canvas;
		return canvas;
	}
	return CachedCanvases[name];
}
function TakeScreenshot() {
	var bufferScreenshot = CreateCanvasCached("Screenshot");
	bufferScreenshot.height = drawingAreaHeight; bufferScreenshot.width = drawingAreaWidth;
	var contextScreenshot = bufferScreenshot.getContext("2d");
	contextScreenshot.drawImage(
	document.getElementById("canvas2"), 0, 0, drawingAreaWidth, drawingAreaHeight);
	contextScreenshot.drawImage(
	document.getElementById("canvas"), 0, 0, drawingAreaWidth, drawingAreaHeight);
	contextScreenshot.drawImage(
	document.getElementById("canvas3"), 0, 0, drawingAreaWidth, drawingAreaHeight);
	var dataURL = bufferScreenshot.toDataURL();
	return dataURL;
}