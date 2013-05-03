// Esta es una version de un Controlador de Cargas Asyncronas 
// Encontrada por internet, los creditos le pertenecen a
// Javier Arevalo
// Modificada de http://www.iguanademos.com/Jare/docs/html5/Lessons/

// Async loader
function MultiStepLoader(loadSteps, finale)
{
	if (loadSteps.length == 0)
	{
		finale();
		return;
	}
	var startTime = Date.now()
	var stepsCompleted = 0;
	for (var i = 0; i < loadSteps.length; ++i)
	{
		var stepFunc = loadSteps[i][1];
		stepFunc(LoaderInternalCallback, i);
	}
	
	function LoaderInternalCallback(i)
	{
		window.console && window.console.log("Load step completed: " + loadSteps[i][0] + " in " + (Date.now() - startTime).toString() + " ms" );
		++stepsCompleted;
		if (stepsCompleted >= loadSteps.length)
		{
			finale();
		}
	}	
}

// http://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas/6551032#6551032
function GetRelativePosition(target, x,y) {
	//this section is from http://www.quirksmode.org/js/events_properties.html
	// jQuery normalizes the pageX and pageY
	// pageX,Y are the mouse positions relative to the document
	// offset() returns the position of the element relative to the document
	var offset = $(target).offset();
	var x = x - offset.left;
	var y = y - offset.top;

	return {"x": x, "y": y};
}
