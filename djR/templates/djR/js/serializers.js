// credits for the json prettyfier: http://joncom.be/code/javascript-json-formatter/

function RealTypeOf(v) {
  if (typeof(v) == "object") {
    if (v === null) return "null";
    if (v.constructor == (new Array).constructor) return "array";
    if (v.constructor == (new Date).constructor) return "date";
    if (v.constructor == (new RegExp).constructor) return "regex";
    return "object";
  }
  return typeof(v);
}

function SortObject(oData) {
    var oNewData = {};
    var aSortArray = [];

    // sort keys
    $.each(oData, function(sKey) {
        aSortArray.push(sKey);
    });
    aSortArray.sort(SortLowerCase);

    // create new data object
    $.each(aSortArray, function(i) {
        if (RealTypeOf(oData[(aSortArray[i])]) == "object" ) {
            oData[(aSortArray[i])] = SortObject(oData[(aSortArray[i])]);
        }
        oNewData[(aSortArray[i])] = oData[(aSortArray[i])];
    });

    return oNewData;

    function SortLowerCase(a,b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    }
}

function FormatVisual(oData, sIndent) {
    if (arguments.length < 2) {
        var sIndent = "<br />";
    }
    var sIndentStyle = '<span style="margin-left:2em"></span>';
    var sDataType = RealTypeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "";
    } else {
        var iCount = 0;
        $.each(oData, function() {
            iCount++;
            return;
        });
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "";
    }

    // loop through items
    var iCount = 0;
    $.each(oData, function(sKey, vValue) {
    	//console.log(sKey+' , '+vValue);
    	var type = RealTypeOf(vValue);
    	var keytype = RealTypeOf(sKey);
        if (iCount > 0) {
            sHTML += ",";
        }
        sHTML += sIndent+ sIndentStyle;
        if (sDataType == "array") {
        	if ( type == "object") {
        		sHTML += ("\n" + sKey+' <span class=\"object\">Object</span>');
        	}
        	else if ( type == "array") {
        		sHTML += ("\n" + sKey+' </span> <span class=\"array\">Array</span>');
        	}
        	else {
        		sHTML += ("\n" + sKey+' ');
        	}
        }
        else {
        	if ( type == "object") {
        		sHTML += ("\n<span class=\"blue\">"+ sKey + "</span> <span class=\"object\">Object</span>");
        	}
        	else if ( type == "array") {
        		sHTML += ('\n<span class="blue">'+sKey+'</span> <span class=\"array\">Array</span>');
        	}
        	else {
        		sHTML += ("\n<span class=\"blue\">"+ sKey + "</span> : ");
        	}
        }
        sHTML += '<div class="pull-right light small" style="margin-right:2em">'+type+'</div>';
        // display relevant data type
        switch (type) {
            case "array":
            case "object":
                sHTML += FormatVisual(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
            case "number":
                sHTML += "<span class=\"number\">"+vValue.toString()+"</span>";
                break;
            case "null":
                sHTML += "<span class=\"light\">null</span>";
                break;
            case "string":
                sHTML += ('<span class="light">"</span>' + vValue + '<span class="light">"</span>');
                break;
            default:
                sHTML += ("TYPEOF: " + typeof(vValue));
        }

        // loop
        iCount++;
    });
    return sHTML;
}

function FormatJSON(oData, sIndent) {
    if (arguments.length < 2) {
        var sIndent = "<br />";
    }
    var sIndentStyle = '<span style="margin-left:2em"></span>';
    var sDataType = RealTypeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "[";
    } else {
        var iCount = 0;
        $.each(oData, function() {
            iCount++;
            return;
        });
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "{";
    }

    // loop through items
    var iCount = 0;
    $.each(oData, function(sKey, vValue) {
        if (iCount > 0) {
            sHTML += '<span class="light">,</span>';
        }
        if (sDataType == "array") {
            sHTML += ("\n" + sIndent + sIndentStyle);
        } else {
            sHTML += ("\n" + sIndent + sIndentStyle + "\"<span class=\"blue\">" + sKey + "</span>\"" + ": ");
        }

        // display relevant data type
        switch (RealTypeOf(vValue)) {
            case "array":
            case "object":
                sHTML += FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                sHTML += "null";
                break;
            case "string":
                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + typeof(vValue));
        }

        // loop
        iCount++;
    });
    if (sDataType == "array") {
        sHTML += ("\n" + sIndent + "]");
    } else {
        sHTML += ("\n" + sIndent + "}");
    }
    return sHTML;
}