{% load i18n staticfiles %}

<script type="text/javascript">
{% include "djR/js/serializers.js" %}
function get_type(thing){
    if(thing===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
}
function set_table(table, id) {
	$('#res_v_title').css("display", "none");;
	$('#res_v').html('<div class="jumbotron lighter big text-center" style="margin-top:1.5em">{% trans "Ready to run a query" %}</div>');
	$("#q_btns").css("display", "inline-block");
	$('input[name="$table"]').val(table);
	$(".btn-table").removeClass("btn-primary").addClass("btn-default");
	$("#"+id).removeClass("btn-default").addClass("btn-primary");
}
function count_all() {
	// count query
	var db = $('select[name="$db"]').val();
	var table = $('input[name="$table"]').val();
	var q = '{"$db":"'+db+'", "$table":"'+table+'", "$query":[["$count"]]}';
	post_query(q);
}
function pop_tables() {
	$("#q_btns").css("display", "none");
	var db = $('select[name="$db"]').val();
	q = '{"$db":"'+db+'"}';
	get_tables('#sidebar', q, db);
}
function get_tables(container, q, db) {
	var url = '{% url "r-post" %}';
	ajaxPost(url, {'q': q}, function(content){
		var data = JSON.parse(content)["data"];
		var arrayLength = data.length;
		var output = "<h4>TABLES</h4>\n";
		for (var i = 0; i < arrayLength; i++) {
			var table = data[i];
			var qx = JSON.stringify('{"$db":"'+db+'", "$table":"'+table+'"}');
			output = output+'<a id="table_'+i+'" class="btn btn-block btn-default btn-table" href="javascript:set_table(\''+table+'\', \'table_'+i+'\')">'+table+'</a>\n';
		}
		$(container).html(output);
    });
}
function run_q() {
	var db = $('select[name="$db"]').val();
	var table = $('input[name="$table"]').val();
	var limit = $('input[name="$limit"]').val();
	var query = '"$query": [["$limit", {"n":'+limit+'}]]';
	var q = '{"$db":"'+db+'", "$table":"'+table+'", '+query+'}';
	post_query(q);
}
function format_entry_OLD(key, val) {
	output = '<div><span class="blue" style="font-weight:bold">'+key+'</span> : '+JSON.stringify(val)+'</div>';
	return output
}
function post_query(q) {
	var url = '{% url "r-post" %}';
	$("#res_v").html('');
	ajaxPost(url, {'q': q}, function(content){
		var res = JSON.parse(content)["data"];
		var qtime = JSON.parse(content)["time"];
		if (get_type(res) == '[object Number]') {
			$('#res_v').html('');
			$('#num_results').html(res);
		}
		if (get_type(res) == '[object Array]') {
			var arrayLength = res.length;
			var output = '';
			var json_output = '';
			num = 0;
			for (var i = 0; i < arrayLength; i++) {
				var num = i+1;
				var keys = Object.keys(res[i]);
				var kl = keys.length;
				var idr = i+'_res';
				//console.log(i+' : '+JSON.stringify(res[i]));
				output = output+'<div id="'+idr+'" class="result_cell">';
				output = output+'<div class="pull-right light big">'+num+'</div>';
				output = output+FormatVisual(res[i]);
				output = output+'</div>'
				json_output = json_output+'<div id="'+idr+'" class="result_cell">';
				json_output = json_output+'<div class="pull-right light big">'+num+'</div>';
				json_output = json_output+FormatJSON(res[i]);
				json_output = json_output+'</div>'
			}
			$('#num_results').html(arrayLength);
		}
		$('#results').show();
		$('#results_title').show();
		$("#res_v").html(output);
		$('#res_j').html(json_output);
		$('#q_time').html(qtime+' ms');
    });
}
</script>