/*
author: andreasl
*/

// Gantt entries : { name, start year, end year (not included), type }
var entries = [
{"name":"Technische Universit\u00e4t Berlin", "startDate":new Date("2007"),"endDate":new Date("2016"),"type":"education"},

{"name":"DAI-Labor",            "startDate":new Date("2011"),"endDate":new Date("2014"),"type":"work"},
{"name":"HERE",                 "startDate":new Date("2016"),"endDate":new Date("2019"),"type":"work"},
{"name":"CeleraOne",            "startDate":new Date("2018"),"endDate":new Date("2021"),"type":"work"},
{"name":"Momox",                "startDate":new Date("2020"),"endDate":new Date("2022"),"type":"work"},
{"name":"Tier Mobility",        "startDate":new Date("2021"),"endDate":new Date("2022"),"type":"work"},
{"name":"Micropsi Industries",  "startDate":new Date("2021"),"endDate":new Date("2025"),"type":"work"},
{"name":"Wandelbots",           "startDate":new Date("2024"),"endDate":new Date("2025"),"type":"work"},

{"name":"Visual Basic", "startDate":new Date("2000"),"endDate":new Date("2007"),"type":"language"},
{"name":"C++",          "startDate":new Date("2006"),"endDate":new Date("2008"),"type":"language"},
{"name":"C++",          "startDate":new Date("2011"),"endDate":new Date("2019"),"type":"language"},
{"name":"C++",          "startDate":new Date("2020"),"endDate":new Date("2025"),"type":"language"},
{"name":"Java",         "startDate":new Date("2008"),"endDate":new Date("2013"),"type":"language"},
{"name":"Java",         "startDate":new Date("2017"),"endDate":new Date("2019"),"type":"language"},
{"name":"Kotlin",       "startDate":new Date("2018"),"endDate":new Date("2019"),"type":"language"},
{"name":"C#",           "startDate":new Date("2011"),"endDate":new Date("2015"),"type":"language"},
{"name":"Python",       "startDate":new Date("2015"),"endDate":new Date("2025"),"type":"language"},
{"name":"HLSL",         "startDate":new Date("2013"),"endDate":new Date("2015"),"type":"language"},
{"name":"GLSL",         "startDate":new Date("2013"),"endDate":new Date("2015"),"type":"language"},
{"name":"GLSL",         "startDate":new Date("2014"),"endDate":new Date("2015"),"type":"language"},
{"name":"Lua",          "startDate":new Date("2018"),"endDate":new Date("2021"),"type":"language"},
{"name":"SQL",          "startDate":new Date("2014"),"endDate":new Date("2015"),"type":"language"},
{"name":"SQL",          "startDate":new Date("2016"),"endDate":new Date("2019"),"type":"language"},
{"name":"SQL",          "startDate":new Date("2020"),"endDate":new Date("2022"),"type":"language"},
{"name":"MongoDB",      "startDate":new Date("2018"),"endDate":new Date("2021"),"type":"language"},
{"name":"Go",           "startDate":new Date("2021"),"endDate":new Date("2024"),"type":"language"},

{"name":"OGRE",         "startDate":new Date("2006"),"endDate":new Date("2008"),"type":"technology"},
{"name":"OGRE",         "startDate":new Date("2011"),"endDate":new Date("2014"),"type":"technology"},
{"name":"OpenGL",       "startDate":new Date("2012"),"endDate":new Date("2014"),"type":"technology"},
{"name":"OpenCV",       "startDate":new Date("2012"),"endDate":new Date("2016"),"type":"technology"},
{"name":"Boost",        "startDate":new Date("2012"),"endDate":new Date("2016"),"type":"technology"},
{"name":"Nginx",        "startDate":new Date("2018"),"endDate":new Date("2022"),"type":"technology"},
{"name":"Pyramid",      "startDate":new Date("2018"),"endDate":new Date("2021"),"type":"technology"},
{"name":"Celery",       "startDate":new Date("2018"),"endDate":new Date("2022"),"type":"technology"},
{"name":"Jupyter",      "startDate":new Date("2018"),"endDate":new Date("2025"),"type":"technology"},
{"name":"Pandas",       "startDate":new Date("2018"),"endDate":new Date("2025"),"type":"technology"},
{"name":"Django",       "startDate":new Date("2021"),"endDate":new Date("2022"),"type":"technology"},
{"name":"AWS",          "startDate":new Date("2021"),"endDate":new Date("2025"),"type":"technology"},
{"name":"Kubernetes",   "startDate":new Date("2024"),"endDate":new Date("2025"),"type":"technology"},
] // end entries

var entryTypeCssStyles = {
    "work":         "bar-work",
    "education":    "bar-education",
    "language":     "bar-language",
    "technology":   "bar-technology"
};

/*The following lines translate the entries into a format that is anticipated
and understood by d3.gantt().
Actually, it would be nice to fix the Gantt Chart library to be a function rather than
relying on certain variables and stuff, but for now, it works with this simple translation code
as well.*/

// Grab the entry names
var entryNames = [];
entries.forEach(function(entry) {
    if( !entryNames.includes( entry["name"]) ) {
        entryNames.push( entry["name"] );
    }
});

// necessary for this d3.gantt stuff...
entries.forEach(function(task) {
    task["taskName"] = task["name"];
    task["status"] = task["type"];
});

var gantt = d3.gantt()
    .parentContainer('#parent-div')
    .ganttContainer('#gantt-div')
    .legendYContainer('#legendY-div')
    .legendXContainer('#legendX-div')
    .outerScrollContainer('scroll-container-div')
    .scrollContainer('scroll-div')
    .taskTypes(entryNames)
    .taskCssClassMapping(entryTypeCssStyles);

gantt(entries);
