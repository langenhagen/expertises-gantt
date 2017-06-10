/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 *
 * changes made by
 * @author: Andreas Langenhagen
 * @version 170604
 *
 * I cleaned up a lot. Dimitry's code was very messy.
 * Great that He provided something to start with.
 * I added a vertical bar, added row that highlights the entry on which the mouse is floating.
 */

d3.gantt = function() {

    var ganttContainer;             // diagram content ganttContainer
    var legendYContainer;           // the container that will contain the y axis texts
    var legendXContainer;           // the container that will contain the x axis texts
    var timeDomainStart;            // Date object; will be set by initTimeDomain
    var timeDomainEnd;              // Date object; will be set by initTimeDomain
    var taskTypes = [];
    var taskCssClassMapping = [];
    var tickFormat = "%Y";          // datetime format
    var yAxisGroupWidth;            // length of the text on the y axis

    /** TODO doc
    */
    var keyFunction = function(d) { return d.startDate + d.taskName + d.endDate; };

    /** we add some negative x-transform because the caption left of the chart is not taken
    into account by the hover-rectangle otherwise
    */
    var hoverRectTransform = function(d) { return "translate( " + - yAxisGroupWidth + ", " + yScale(d.taskName) + ")"; };

    /** Translates each entry rectangle to its rightful position.
    */
    var rectTransform = function(d) {
	    return "translate(" + xScale(d.startDate) + "," + yScale(d.taskName) + ")";
    };


    /** initializes the scales and the x and y axes.
    */
    var initAxes = function() {

        xScale = d3.time.scale()
            .domain([ timeDomainStart, timeDomainEnd ])
            .range([ 0, width ]);

        yScale = d3.scale.ordinal()
            .domain(taskTypes)
            .rangeRoundBands([ 0, height ], 0.1);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(timeDomainEnd.getFullYear() - timeDomainStart.getFullYear())
            .tickFormat(d3.time.format(tickFormat))
            .tickSize(8)
            .tickPadding(8);

	    yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickSize( -width );
    };

    /** Draws the Gantt chart.
    */
    function gantt(tasks) {

        // find timeDomainEnd and timeDomainStart
        tasks.sort(function(a, b) { return a.endDate - b.endDate; });
        timeDomainEnd = tasks[tasks.length - 1].endDate;
        tasks.sort(function(a, b) { return a.startDate - b.startDate; });
        timeDomainStart = tasks[0].startDate;

        var entryHeight = 30; // height of one entry row
        height = tasks.length * entryHeight;

        var yearLength = 100;
        width = (timeDomainEnd.getFullYear() - timeDomainStart.getFullYear()) * yearLength;

        initAxes();

        // set up the legend container for y axis values
        var svgLegendY = d3.select(legendYContainer)
            .append("svg")
            .attr("height", height);

        // y axis
        var yAxisGroup = svgLegendY.append("g")
            .attr("class", "y axis")
        yAxisGroup.transition()
            .call(yAxis);
        yAxisGroupWidth = parseInt(svgLegendY.style("width"),10);
        yAxisGroup.select(".domain").remove();
        yAxisGroup.attr("transform", "translate(" + yAxisGroupWidth + ", " + 0 + ")");

        // set the x axis legend container to the left
        var legendXContainerElement = document.getElementById(legendXContainer.substring(1));
        legendXContainerElement.style.marginLeft = yAxisGroupWidth;

        var svg = d3.select(ganttContainer)
            .append("svg")
            .attr("class", "chart")
            .attr("width", width)
            .attr("height", height)

        svg.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append("rect")
            .attr("class", "hoverRect")
            .attr("transform", hoverRectTransform)
            .attr("height", function(d) { return yScale.rangeBand(); })
            .attr("width",  yAxisGroupWidth + width);

        // set up the legend container for x axis values
        var svgLegendX = d3.select(legendXContainer)
            .append("svg")
            .attr("width", width);


        // x axis
        var xAxisGroup = svgLegendX.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + 0 + ", " + 0 + ")");
        xAxisGroup.transition()
            .call(xAxis);

        // y horizontal lines axis on the gantt diagram
        var yAxisGroup2 = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + 0 + ", " + 0 + ")");
        yAxisGroup2.transition()
            .call(yAxis);
        yAxisGroup2.select(".domain").remove();

        // 
        svg.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append("rect")
            .attr("rx", 10)
            .attr("ry", 1000)
            .attr("class", function(d) { return taskCssClassMapping[d.status]; })
            .attr("y", 4)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return yScale.rangeBand()-8; })
            .attr("width", function(d) { return Math.max(1,(xScale(d.endDate) - xScale(d.startDate))); });


        // the dashed vertical line near mouse cursor
        hoverLine = svg.append("line")
            .attr("class", "vertical-line")
            .attr("x1", 100)
            .attr("y1", 0)
            .attr("x2", 100)
            .attr("y2", 3000);

        // when scrolling the on the x axis, also scroll the gantt container, also
        // when scrolling the on the x axis, also scroll the gantt container

        var ganttContainerElement = document.getElementById(ganttContainer.substring(1));

        legendXContainerElement.onscroll = function() {
            ganttContainerElement.scrollLeft = legendXContainerElement.scrollLeft;
        };
        ganttContainerElement.onscroll = function() {
            legendXContainerElement.scrollLeft = ganttContainerElement.scrollLeft;
        };

        // make the dashed vertical line snap to the nearest year
        svg.on("mousemove", function() {
            ganttContainerElement.scrollLeft = legendXContainerElement.scrollLeft;

            var mouseX = d3.mouse(this)[0] + yearLength/2;
            var hoverLineX = mouseX - mouseX % yearLength;
            hoverLineX = hoverLineX < 0 ? 0 : hoverLineX;

            hoverLine
                .attr("x1", hoverLineX)
                .attr("x2", hoverLineX);
        });

        return gantt;
    };


    /** Gets / sets the tasks.
    */
    gantt.taskTypes = function(value) {
    	if (!arguments.length)
    	    return taskTypes;
    	taskTypes = value;
    	return gantt;
    };

    /** Gets / sets a dictionary of element types and their css class names.
    */
    gantt.taskCssClassMapping = function(value) {
    	if (!arguments.length)
    	    return taskCssClassMapping;
    	taskCssClassMapping = value;
    	return gantt;
    };

    /** Gets / sets the chart's parent container.
    */
    gantt.ganttContainer = function(value) {
    	if (!arguments.length)
    	    return ganttContainer;
    	ganttContainer = value;
    	return gantt;
    };

    /** Gets / sets the chart's legend y container.
    */
    gantt.legendYContainer = function(value) {
        if (!arguments.length)
            return legendYContainer;
        legendYContainer = value;
        return gantt;
    };

    /** Gets / sets the chart's legend x container.
    */
    gantt.legendXContainer = function(value) {
        if (!arguments.length)
            return legendXContainer;
        legendXContainer = value;
        return gantt;
    };

    /** Gets / sets the chart's parent's container.
    */
    gantt.parentContainer = function(value) {
        if (!arguments.length)
            return parentContainer;
        parentContainer = value;
        return gantt;
    };


    return gantt;
};
