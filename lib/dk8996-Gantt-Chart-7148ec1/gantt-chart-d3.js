/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 *
 * changes made by
 * @author: Andreas Langenhagen
 * @version 170506
 *
 * I cleaned up a lot. Dimitry's code was very messy.
 *
 */

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
        top : 10,
        right : 20,
        bottom : 15,
        left : 220 // we grant this many pixels for the captions left to the chart
    };
    var selector = 'body';
    var timeDomainStart;    // Date object; will be set by initTimeDomain
    var timeDomainEnd;      // Date object; will be set by initTimeDomain
    var taskTypes = [];
    var taskStatus = [];
    var height; // to be set later
    var clientWidth;  // to be set later
    var tickFormat = "%Y"; // datetime format

    /** TODO doc
    */
    var keyFunction = function(d) { return d.startDate + d.taskName + d.endDate; };

    /** we add some negative x-transform because the caption left of the chart is not taken
    into account by the hover-rectangle otherwise
    */
    var hoverRectTransform = function(d) { return "translate( -220, " + y(d.taskName) + ")"; };

    /** TODO doc
    */
    var rectTransform = function(d) {
	    return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };


    /** TODO doc
    */
    var initTimeDomain = function(tasks) {
        tasks.sort(function(a, b) { return a.endDate - b.endDate; });
        timeDomainEnd = tasks[tasks.length - 1].endDate;
        tasks.sort(function(a, b) { return a.startDate - b.startDate; });
        timeDomainStart = tasks[0].startDate;
    };

    /** TODO doc
    */
    var initAxes = function() {
	    x = d3.time.scale()
        .domain([ timeDomainStart, timeDomainEnd ])
        .range([ 0, width ]).clamp(false);

        y = d3.scale.ordinal()
        .domain(taskTypes)
        .rangeRoundBands([ 0, height - margin.top - margin.bottom ], 0.1);

        xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(timeDomainEnd.getFullYear() - timeDomainStart.getFullYear())
        .tickFormat(d3.time.format(tickFormat))
        .tickSize(8)
        .tickPadding(8);

	    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize( -width );
    };

    /** TODO doc
    */
    function gantt(tasks) {

        initTimeDomain(tasks);

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
        .attr("height", function(d) { return y.rangeBand(); })
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
        .attr("class", function(d) {
            if(taskStatus[d.status] == null)
                return "bar";
            return taskStatus[d.status];
        })
        .attr("y", 4)
        .attr("transform", rectTransform)
        .attr("height", function(d) { return y.rangeBand()-8; })
        .attr("width", function(d) { return Math.max(1,(x(d.endDate) - x(d.startDate))); });

        // the dashed vertical line near mouse cursor
        hoverLine = svg.append("line")
            .style("stroke", "black")
            .attr("x1", 100)
            .attr("y1", 0)
            .attr("x2", 100)
            .attr("y2", 3000);

        svg.on("mousemove", function(){
            hoverLine
            .attr("x1", d3.mouse(this)[0])
            .attr("x2", d3.mouse(this)[0]);

        });

        return gantt;
    };

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
	 .attr("class", function(d){
        if(taskStatus[d.status] == null)
            return "bar";
        return taskStatus[d.status];
     })
	 .transition()
	 .attr("y", 0)
	 .attr("transform", rectTransform)
	 .attr("height", function(d) { return y.rangeBand(); })
	 .attr("width", function(d) {
	     return Math.max(1,(x(d.endDate) - x(d.startDate)));
     });

    rect.transition()
    .attr("transform", rectTransform)
    .attr("height", function(d) { return y.rangeBand(); })
    .attr("width", function(d) { return Math.max(1,(x(d.endDate) - x(d.startDate))); });

	rect.exit().remove();

	return gantt;
    };

    gantt.margin = function(value) {
    	if (!arguments.length)
    	    return margin;
    	margin = value;
    	return gantt;
    };

    gantt.timeDomain = function(value) {
    	if (!arguments.length)
    	    return [ timeDomainStart, timeDomainEnd ];
    	timeDomainStart = +value[0], timeDomainEnd = +value[1];
    	return gantt;
    };

    gantt.taskTypes = function(value) {
    	if (!arguments.length)
    	    return taskTypes;
    	taskTypes = value;
    	return gantt;
    };

    gantt.taskStatus = function(value) {
    	if (!arguments.length)
    	    return taskStatus;
    	taskStatus = value;
    	return gantt;
    };

    gantt.width = function(value) {
    	if (!arguments.length)
    	    return width;
    	width = +value;
    	return gantt;
    };

    gantt.height = function(value) {
    	if (!arguments.length)
    	    return height;
    	height = +value;
    	return gantt;
    };

    gantt.tickFormat = function(value) {
    	if (!arguments.length)
    	    return tickFormat;
    	tickFormat = value;
    	return gantt;
    };

    gantt.selector = function(value) {
    	if (!arguments.length)
    	    return selector;
    	selector = value;
    	return gantt;
    };

    return gantt;
};