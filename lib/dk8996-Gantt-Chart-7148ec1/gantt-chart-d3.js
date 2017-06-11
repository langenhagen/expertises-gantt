/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 *
 * dramatic changes made by
 * @author: Andreas Langenhagen
 * @version 170611
 *
 * Great that Dimitry provided something to start with.
 * I added a vertical line that marks the year on which the mouse is floating,
 * added row that highlights the entry on which the mouse is floating,
 * made the axes stick to the foreground,
 * and put div containters in front of everything that enable unified scrolling.
 */

d3.gantt = function() {

    var outerScrollContainer;       // the container managing the two-directional scrolling
    var scrollContainer;            // the container defining the possible scrolling values
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

    /** initializes the scales and the x and y axes.
    */
    var initAxes = function() {

        xScale = d3.time.scale()
            .domain([ timeDomainStart, timeDomainEnd ])
            .range([ 0, width ]);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(timeDomainEnd.getFullYear() - timeDomainStart.getFullYear())
            .tickFormat(d3.time.format(tickFormat))
            .tickSize(8)
            .tickPadding(8);

        yScale = d3.scale.ordinal()
            .domain(taskTypes)
            .rangeRoundBands([ 0, height ], 0);

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

        var yearLength = 100; // length of one year in the diagram
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
        yAxisGroup.attr("transform", "translate("+yAxisGroupWidth+","+0+")");

        // set the x axis legend container to the left
        var legendXContainerElement = document.getElementById(legendXContainer.substring(1));
        legendXContainerElement.style.marginLeft = yAxisGroupWidth;

        var svg = d3.select(ganttContainer)
            .append("svg")
            .attr("class", "chart")
            .attr("width", width)
            .attr("height", height)

        // the horizontal rectangle highlighting the entry under the cursor
        var hoverRect = svg.append("rect")
            .attr("class", "hoverRect")
            .attr("height", entryHeight+4)
            .attr("width",  yAxisGroupWidth + width)
            .attr("transform", "translate( "+0+",-"+10000+")");

        // set up the legend container for x axis values
        var svgLegendX = d3.select(legendXContainer)
            .append("svg")
            .attr("width", width);

        // x axis
        var xAxisGroup = svgLegendX.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+0+","+0+")");
        xAxisGroup.transition()
            .call(xAxis);

        // y horizontal lines axis on the gantt diagram
        var yAxisGroup2 = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+0+","+0+")");
        yAxisGroup2.transition()
            .call(yAxis);
        yAxisGroup2.select(".domain").remove();

        // the rectangle gantt entries
        var rectHeight = yScale.rangeBand()-8;
        var rectTransform = function(d) {
            return "translate("+xScale(d.startDate)+","+yScale(d.taskName)+")";
        };
        var rectWidth = function(d) {
            return Math.max(1,(xScale(d.endDate) - xScale(d.startDate)));
        };

        svg.selectAll(".chart").data(tasks, keyFunction).enter().append("rect")
            .attr("rx", 10)
            .attr("ry", 1000)
            .attr("class", function(d) { return taskCssClassMapping[d.status]; })
            .attr("y", 4)
            .attr("transform", rectTransform)
            .attr("height", rectHeight)
            .attr("width", rectWidth);


        var textTransform = function(d) {
            return "translate("+
                        (xScale(d.startDate)+
                        (d.endDate.getFullYear()-d.startDate.getFullYear())*yearLength/2)+
                    ","+
                        (yScale(d.taskName) + rectHeight/2 - 2) +
                    ")";
        };
        var textContent = function(d) {
            var years = d.endDate.getFullYear()-d.startDate.getFullYear();
            return years + (years == 1 ? " year" : " years" );
        };
        svg.selectAll(".chart").data(tasks, keyFunction).enter().append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("dy", ".35em")
            .attr("class", "text-entry")
            .attr("transform", textTransform)
            .text( textContent );

        // the dashed vertical line near mouse cursor
        var hoverLine = svg.append("line")
            .attr("class", "vertical-line")
            .attr("x1", -1000)
            .attr("y1", 0)
            .attr("x2", -1000)
            .attr("y2", 4000);


        // manage the scrolling
        var scrollContainerElement = document.getElementById(scrollContainer);
        scrollContainerElement.style.width = yAxisGroupWidth + width;
        scrollContainerElement.style.height =  height + legendXContainerElement.offsetHeight + 10;
        var verticalScrollElement = document.getElementById("vertical-scroll-div");
        var ganttContainerElement = document.getElementById(ganttContainer.substring(1));
        var outerScrollContainerElement = document.getElementById(outerScrollContainer);
        outerScrollContainerElement.onscroll = function() {
            legendXContainerElement.scrollLeft = outerScrollContainerElement.scrollLeft;
            ganttContainerElement.scrollLeft = outerScrollContainerElement.scrollLeft;
            ganttContainerElement.scrollTop = outerScrollContainerElement.scrollTop;
            verticalScrollElement.scrollTop = outerScrollContainerElement.scrollTop;
        };

        // make the dashed vertical line snap to the nearest year
        // make the horizontal bar snap to nearest entry row
        outerScrollContainerElement.onmousemove = function(event) {

            var parentOffset = $(this).parent().offset();

            var mouseX = outerScrollContainerElement.scrollLeft + event.pageX - parentOffset.left - yAxisGroupWidth + yearLength/2;
            var hoverLineX = mouseX - mouseX % yearLength;
            hoverLineX = hoverLineX < 0 ? 0 : hoverLineX;

            hoverLine
                .attr("x1", hoverLineX)
                .attr("x2", hoverLineX);

            var mouseY = outerScrollContainerElement.scrollTop + event.pageY - parentOffset.top + yScale.rangeBand()/2;
            var hoverRectY = mouseY - yScale.rangeBand()/2 - mouseY % (yScale.rangeBand());
            hoverRectY = hoverRectY < yScale.rangeBand()/2 ? yScale.rangeBand()/2 : hoverRectY;

            hoverRect
                .attr("transform", "translate( "+0+","+(hoverRectY-2)+")");
        };

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

    /** Gets / sets the outer scroll container.
    The outer scroll container contains the scroll container.
    The scroll operations will be executed on the outer scroll container.
    The scroll container itself defines the width and thus the scrolling values that can be set.
    */
    gantt.outerScrollContainer = function(value) {
        if (!arguments.length)
            return outerScrollContainer;
        outerScrollContainer = value;
        return gantt;
    };

    /** Gets / sets the scroll container.
    The outer scroll container contains the scroll container.
    The scroll operations will be executed on the outer scroll container.
    The scroll container itself defines the width and thus the scrolling values that can be set.
    */
    gantt.scrollContainer = function(value) {
        if (!arguments.length)
            return scrollContainer;
        scrollContainer = value;
        return gantt;
    };

    return gantt;
};
