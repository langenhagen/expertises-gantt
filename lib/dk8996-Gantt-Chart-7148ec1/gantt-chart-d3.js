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

    var margin = {
        top : 10,
        right : 20,
        bottom : 15,
        left : 220 // we grant this many pixels for the captions left to the chart
    };
    var selector = 'body';
    var timeDomainStart;            // Date object; will be set by initTimeDomain
    var timeDomainEnd;              // Date object; will be set by initTimeDomain
    var taskTypes = [];
    var taskCssClassMapping = [];
    var tickFormat = "%Y";          // datetime format

    /** TODO doc
    */
    var keyFunction = function(d) { return d.startDate + d.taskName + d.endDate; };

    /** we add some negative x-transform because the caption left of the chart is not taken
    into account by the hover-rectangle otherwise
    */
    var hoverRectTransform = function(d) { return "translate( -220, " + yScale(d.taskName) + ")"; };

    /** TODO doc
    */
    var rectTransform = function(d) {
	    return "translate(" + xScale(d.startDate) + "," + yScale(d.taskName) + ")";
    };


    /** TODO doc
    */
    var initAxes = function() {

        xScale = d3.time.scale()
        .domain([ timeDomainStart, timeDomainEnd ])
        .range([ 0, width ]);

        yScale = d3.scale.ordinal()
        .domain(taskTypes)
        .rangeRoundBands([ 0, height - margin.top - margin.bottom ], 0.1);

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

    /** TODO doc
    */
    function gantt(tasks) {

        // find timeDomainEnd and timeDomainStart
        tasks.sort(function(a, b) { return a.endDate - b.endDate; });
        timeDomainEnd = tasks[tasks.length - 1].endDate;
        tasks.sort(function(a, b) { return a.startDate - b.startDate; });
        timeDomainStart = tasks[0].startDate;


        var entryHeight = 40; // height of one entry row
        height = tasks.length * entryHeight;


        var yearLength = 120;
        //width = document.body.clientWidth - margin.right - margin.left-5;
        width = (timeDomainEnd.getFullYear() - timeDomainStart.getFullYear()) * yearLength;

        initAxes();

        var svg = d3.select(selector)
        .append("svg")
        .attr("class", "chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "gantt-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        svg.selectAll(".chart")
        .data(tasks, keyFunction).enter()
        .append("rect")
        .attr("class", "hoverRect")
        .attr("transform", hoverRectTransform)
        .attr("height", function(d) { return yScale.rangeBand(); })
        .attr("width", 220 + width);

        // y axis
        svg.append("g")
        .attr("class", "y axis")
        .transition()
        .call(yAxis);
        svg.select(".domain").remove();

        // x axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
        .transition()
        .call(xAxis);

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
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", 100)
            .attr("y1", 0)
            .attr("x2", 100)
            .attr("y2", 3000);

        // make the dashed vertical line snap to the nearest year
        svg.on("mousemove", function(){
            var mouseX = d3.mouse(this)[0] + yearLength/2;
            var hoverLineX = mouseX - mouseX % yearLength;
            hoverLineX = hoverLineX < 0 ? 0 : hoverLineX;

            hoverLine
            .attr("x1", hoverLineX)
            .attr("x2", hoverLineX);
        });



        return gantt;
    };


    /** The redraw function
    */
    gantt.redraw = function(tasks) {

        initTimeDomain(tasks);
        initAxes();

        var svg = d3.select(".chart");
        var ganttChartGroup = svg.select(".gantt-chart");

        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);
        rect.enter()
        .insert("rect",":first-child")
        .attr("rx", 500)
        .attr("ry", 5)
        .attr("class", function(d) { return taskCssClassMapping[d.status]; })
        .transition()
	    .attr("y", 0)
        .attr("transform", rectTransform)
        .attr("height", function(d) { return yScale.rangeBand(); })
        .attr("width", function(d) { return Math.max(1,(xScale(d.endDate) - xScale(d.startDate)));});

        rect.transition()
        .attr("transform", rectTransform)
        .attr("height", function(d) { return yScale.rangeBand(); })
        .attr("width", function(d) { return Math.max(1,(xScale(d.endDate) - xScale(d.startDate))); });
        rect.exit().remove();

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
    gantt.selector = function(value) {
    	if (!arguments.length)
    	    return selector;
    	selector = value;
    	return gantt;
    };

    return gantt;
};
