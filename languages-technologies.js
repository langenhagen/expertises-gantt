/*
author: langenhagen
version: 170501
*/


// Our Gantt entries : (name, start year, end year (not included), type )
var entries = [
{"name":"Technische Universit\u00e4t Berlin", "startDate":new Date("2007"),"endDate":new Date("2016"),"type":"education"},

{"name":"DAI-Labor",    "startDate":new Date("2011"),"endDate":new Date("2014"),"type":"work"},
{"name":"HERE",         "startDate":new Date("2016"),"endDate":new Date("2018"),"type":"work"},

{"name":"Basic",        "startDate":new Date("1998"),"endDate":new Date("2001"),"type":"language"},
{"name":"Visual Basic", "startDate":new Date("2000"),"endDate":new Date("2007"),"type":"language"},
{"name":"C++",          "startDate":new Date("2006"),"endDate":new Date("2008"),"type":"language"},
{"name":"C++",          "startDate":new Date("2011"),"endDate":new Date("2018"),"type":"language"},
{"name":"C",            "startDate":new Date("2008"),"endDate":new Date("2010"),"type":"language"},
{"name":"Java",         "startDate":new Date("2007"),"endDate":new Date("2013"),"type":"language"},
{"name":"Java",         "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"language"},
{"name":"C#",           "startDate":new Date("2012"),"endDate":new Date("2015"),"type":"language"},
{"name":"Java",         "startDate":new Date("2007"),"endDate":new Date("2013"),"type":"language"},
{"name":"Python",       "startDate":new Date("2015"),"endDate":new Date("2018"),"type":"language"},
{"name":"Java",         "startDate":new Date("2007"),"endDate":new Date("2013"),"type":"language"},
{"name":"Ruby",         "startDate":new Date("2007"),"endDate":new Date("2008"),"type":"language"},
{"name":"Ruby",         "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"language"},
{"name":"Objective C",  "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"language"},
{"name":"HLSL",         "startDate":new Date("2014"),"endDate":new Date("2016"),"type":"language"},
{"name":"GLSL",         "startDate":new Date("2014"),"endDate":new Date("2016"),"type":"language"},
{"name":"CUDA",         "startDate":new Date("2015"),"endDate":new Date("2016"),"type":"language"},
{"name":"JavaScript",   "startDate":new Date("2014"),"endDate":new Date("2016"),"type":"language"},
{"name":"HTML",         "startDate":new Date("2014"),"endDate":new Date("2016"),"type":"language"},
{"name":"PHP",          "startDate":new Date("2014"),"endDate":new Date("2016"),"type":"language"},
{"name":"CSS",          "startDate":new Date("2014"),"endDate":new Date("2016"),"type":"language"},
{"name":"SQL",          "startDate":new Date("2014"),"endDate":new Date("2015"),"type":"language"},
{"name":"SQL",          "startDate":new Date("2016"),"endDate":new Date("2018"),"type":"language"},
{"name":"Matlab",       "startDate":new Date("2012"),"endDate":new Date("2013"),"type":"language"},
{"name":"AutoIt",       "startDate":new Date("2008"),"endDate":new Date("2011"),"type":"language"},

{"name":"Windows Forms",    "startDate":new Date("2000"),"endDate":new Date("2006"),"type":"technology"},
{"name":"Irrlicht",         "startDate":new Date("2005"),"endDate":new Date("2006"),"type":"technology"},
{"name":"OGRE",             "startDate":new Date("2006"),"endDate":new Date("2008"),"type":"technology"},
{"name":"OGRE",             "startDate":new Date("2011"),"endDate":new Date("2014"),"type":"technology"},
{"name":"OpenGL",           "startDate":new Date("2012"),"endDate":new Date("2014"),"type":"technology"},
{"name":"DirectX",          "startDate":new Date("2013"),"endDate":new Date("2015"),"type":"technology"},
{"name":"OpenCV",           "startDate":new Date("2012"),"endDate":new Date("2016"),"type":"technology"},
{"name":"Boost",            "startDate":new Date("2012"),"endDate":new Date("2016"),"type":"technology"},
{"name":"Unity",            "startDate":new Date("2012"),"endDate":new Date("2015"),"type":"technology"},
{"name":"Processing",       "startDate":new Date("2014"),"endDate":new Date("2016"),"type":"technology"},
{"name":"Android",          "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"technology"},
{"name":"iOS",              "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"technology"},
{"name":"PlantUML",         "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"technology"},
{"name":"Jira",             "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"technology"},
{"name":"Gerrit",           "startDate":new Date("2017"),"endDate":new Date("2018"),"type":"technology"},

] // end entries

var format = "%Y";

var entryTypeCssStyles = {
    "work":         "bar-work",
    "education":    "bar-education",
    "language":     "bar-language",
    "technology":   "bar-technology"
};


/* The following lines translate the entries into a format that is anticipated
and understood by d3.gantt().
Actually, it would be nice to fix the Gantt Chart library to be a function rather than
relying on certain variables and stuff, but for now, it works with this simple translation code
as well */

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

var gantt = d3.gantt().taskTypes(entryNames).taskStatus(entryTypeCssStyles).tickFormat(format);
gantt(entries);