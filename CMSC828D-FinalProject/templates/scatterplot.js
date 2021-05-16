// function server_call(end_point){
//     let url = new URL("http://localhost:8000/" + end_point);
//     url.search = new URLSearchParams().toString();
//     return fetch(url,{"credentials": "same-origin"})
//         .then(response => response.json())
// }

var Paper = 'all';
var title_string='All Papers'
var use_keyword = false;
var dt_from = "1970/05/04";
var dt_to = "2015/12/01";
// var dt_from;
// var dt_to;

$('.slider-time').html(dt_from);
$('.slider-time2').html(dt_to);
var min_val = Date.parse(dt_from) / 1000;
var max_val = Date.parse(dt_to) / 1000;
// var min_val;
// var max_val;

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function formatDT(__dt) {
    var year = __dt.getFullYear();
    var month = zeroPad(__dt.getMonth() + 1, 2);
    var date = zeroPad(__dt.getDate(), 2);
    return year + '-' + month + '-' + date;
};


d3.select('.btn').on('click', function() {
    d3.selectAll(".key_row").remove();
    d3.selectAll(".key_square").remove();
    var stext = d3.selectAll(".form-control").node().value
	title_string = stext
    stext = stext.toLowerCase();
    console.log(stext);
    time_from = document.getElementById('ranges');
    var spans = time_from.getElementsByTagName("span");
    use_keyword = true;
    dt_cur_from = spans[0].innerHTML;
    dt_cur_to = spans[1].innerHTML;

    dt_cur_from = new Date(dt_cur_from);
    dt_cur_to = new Date(dt_cur_to);	
    let url_key = new URL("http://localhost:8000/get-keywords/" + stext +"/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
    // console.log(url_key);
    url_key.search = new URLSearchParams().toString();
    fetch(url_key, { "credentials": "same-origin" })
        .then(response => response.json())
        .then(Data_key => {
            console.log(Data_key);
            UpdateScatterplot(Data_key,title_string);			
            var key = d3.select(".card-body")
                .selectAll("div")
                .data(Data_key)
                .enter()
                .append("div")
                .attr("class", "key_row")
                .attr("id", function(d) { return d.title; })
            key.append("div")
                .attr("class", "key_square");
            // .style("background-color", "#C8DAF8")
            key.append("div")
                .attr("class", "key_id")
                .attr("id", "key_line")
                // .style("background-color", "#E9F0FC")
                .text(function(d) { return d.title; })
                .on('click', function(d) {
                    d3.select(".info").remove();
                    console.log(d.id);
                    let urls = new URL("http://localhost:8000/get-data/" + d.id);
                    urls.search = new URLSearchParams().toString();
                    fetch(urls, { "credentials": "same-origin" })
                        .then(response => response.json())
                        .then(Data2 => {
                            d2 = Data2
                            $('.title_div').html(d2.title);
                            $('.body_div').html("Article: "+d2.body);
                            $('.paper_div').html("Paper: "+d2.paper);
                        })
                })
                .on("mouseover", function(d){
                    d3.select(this).style("color", "blue")
                })
                .on("mouseout", function(d){
                    d3.select(this).style("color", "black")
                })
        });

});

//default show 1970 - 2015
let url_dif = new URL("http://localhost:8000/get-paper-date-range/all/1970-05-04/2015-12-01");
url_dif.search = new URLSearchParams().toString();
fetch(url_dif, { "credentials": "same-origin" })
    .then(response => response.json())
    .then(Datas => {
        d1 = Datas;
        // console.log(d1);
        UpdateScatterplot(d1, "All");

    });

$("#slider-range").slider({
    range: true,
    min: min_val,
    max: max_val,
    step: 10,
    values: [min_val, max_val],

    slide: function(e, ui) {
        console.log(min_val, max_val);
        dt_cur_from = new Date(ui.values[0] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
        dt_cur_to = new Date(ui.values[1] * 1000); //.format("yyyy-mm-dd hh:ii:ss");                
        $('.slider-time').html(formatDT(dt_cur_from));
        $('.slider-time2').html(formatDT(dt_cur_to));


    }	
});
$( "#slider-range" ).on( "slidestop", function(e, ui) {
        console.log(min_val, max_val);
        dt_cur_from = new Date(ui.values[0] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
        dt_cur_to = new Date(ui.values[1] * 1000); //.format("yyyy-mm-dd hh:ii:ss");                
        $('.slider-time').html(formatDT(dt_cur_from));
        $('.slider-time2').html(formatDT(dt_cur_to));
        // var All = "all";
        console.log("Heeellllooooo");
		var slider_title
		if(use_keyword){
			slider_title = title_string
			console.log(title_string)
            let url = new URL("http://localhost:8000/get-keywords/"+title_string.toLowerCase()+"/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
            url.search = new URLSearchParams().toString();
            fetch(url, { "credentials": "same-origin" })
                .then(response => response.json())
                .then(Datas => {
                    d1 = Datas;
                    let mn = dt_cur_from.getFullYear();
                    let mx = dt_cur_to.getFullYear();
                    // console.log(mn);
                    // console.log(mx);
                    UpdateScatterplot(d1,slider_title);
                })			
		}
		else{
		    if (Paper ==='all'){
			    slider_title = 'All'
			    }
		    else if(Paper ==='black_explosion'){
			    slider_title='Black Explosion'
			    }
		    else{
			    slider_title='Mitzpeh'
			    }	
            let url = new URL("http://localhost:8000/get-paper-date-range/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
            url.search = new URLSearchParams().toString();
            fetch(url, { "credentials": "same-origin" })
                .then(response => response.json())
                .then(Datas => {
                    d1 = Datas;
                    let mn = dt_cur_from.getFullYear();
                    let mx = dt_cur_to.getFullYear();
                    // console.log(mn);
                    // console.log(mx);
                    UpdateScatterplot(d1,slider_title);
            })				
		}



    } );



SelectPaperBtn = document.querySelector("#Radio_Type").Paper_type_radio;
//take the radio button value
for (var i = 0; i < SelectPaperBtn.length; i++) {
    SelectPaperBtn[i].addEventListener('change', function() {
        console.log(this.value);
        SelectPaper = this.value;

        if (SelectPaper === 'All') {
            use_keyword = false;
            Paper = "all"
            console.log('All');
            console.log(Paper);
			console.log(use_keyword)
            time_from = document.getElementById('ranges');
            var spans = time_from.getElementsByTagName("span");

            dt_cur_from = spans[0].innerHTML;
            dt_cur_to = spans[1].innerHTML;

            dt_cur_from = new Date(dt_cur_from);
            dt_cur_to = new Date(dt_cur_to);


            let url = new URL("http://localhost:8000/get-paper-date-range/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
            url.search = new URLSearchParams().toString();
            fetch(url, { "credentials": "same-origin" })
                .then(response => response.json())
                .then(Datas => {
                    d1 = Datas;
                    let mn = dt_cur_from.getFullYear();
                    let mx = dt_cur_to.getFullYear();
                    // console.log(mn);
                    // console.log(mx);
                    UpdateScatterplot(d1,"All Papers");
                })


         
        }
		else if (SelectPaper === 'Both'){
            Paper = "all";
            console.log('Both');
            console.log(Paper);

            time_from = document.getElementById('ranges');
            var spans = time_from.getElementsByTagName("span");

            dt_cur_from = spans[0].innerHTML;
            dt_cur_to = spans[1].innerHTML;

            dt_cur_from = new Date(dt_cur_from);
            dt_cur_to = new Date(dt_cur_to);
            if(use_keyword){
                let url = new URL("http://localhost:8000/get-keywords/"+title_string.toLowerCase()+"/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
                url.search = new URLSearchParams().toString();
                fetch(url, { "credentials": "same-origin" })
                    .then(response => response.json())
                    .then(Datas => {
                        d1 = Datas;
                        //console.log(d1);
                        let mn = dt_cur_from.getFullYear();
                        let mx = dt_cur_to.getFullYear();

                        UpdateScatterplot(d1,title_string);				
			        })
			}
			else{
                let url = new URL("http://localhost:8000/get-paper-date-range/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
                url.search = new URLSearchParams().toString();
                fetch(url, { "credentials": "same-origin" })
                    .then(response => response.json())
                    .then(Datas => {
                        d1 = Datas;
                        //console.log(d1);
                        let mn = dt_cur_from.getFullYear();
                        let mx = dt_cur_to.getFullYear();

                        UpdateScatterplot(d1,"Both");
                })				
			}			
		}
		else if (SelectPaper === 'Black_Explosion') {

            Paper = "black_explosion";
            console.log('Black_Explosion');
            console.log(Paper);

            time_from = document.getElementById('ranges');
            var spans = time_from.getElementsByTagName("span");

            dt_cur_from = spans[0].innerHTML;
            dt_cur_to = spans[1].innerHTML;

            dt_cur_from = new Date(dt_cur_from);
            dt_cur_to = new Date(dt_cur_to);
            if(use_keyword){
                let url = new URL("http://localhost:8000/get-keywords/"+title_string.toLowerCase()+"/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
                url.search = new URLSearchParams().toString();
                fetch(url, { "credentials": "same-origin" })
                    .then(response => response.json())
                    .then(Datas => {
                        d1 = Datas;


                        UpdateScatterplot(d1,title_string);				
			        })
			}
			else{
                let url = new URL("http://localhost:8000/get-paper-date-range/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
                url.search = new URLSearchParams().toString();
                fetch(url, { "credentials": "same-origin" })
                    .then(response => response.json())
                    .then(Datas => {
                        d1 = Datas;

                        UpdateScatterplot(d1,"Black Explosion");
                })				
			}



        } 
		else {
            // var dt_from = "1983/09/01";
            // var dt_to= "2015/11/05";

            // $('.slider-time').html(dt_from);
            // $('.slider-time2').html(dt_to);
            // min_val = Date.parse(dt_from)/1000;
            // max_val = Date.parse(dt_to)/1000;

            time_from = document.getElementById('ranges');
            var spans = time_from.getElementsByTagName("span");

            dt_cur_from = spans[0].innerHTML;
            dt_cur_to = spans[1].innerHTML;

            dt_cur_from = new Date(dt_cur_from);
            dt_cur_to = new Date(dt_cur_to);

            Paper = "mitzpeh";
            console.log('Mitzpeh');
            console.log(Paper);
            if(use_keyword){
                let url = new URL("http://localhost:8000/get-keywords/"+title_string.toLowerCase()+"/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
                url.search = new URLSearchParams().toString();
                fetch(url, { "credentials": "same-origin" })
                    .then(response => response.json())
                    .then(Datas => {
                        d1 = Datas;
                        //console.log(d1);
                        let mn = dt_cur_from.getFullYear();
                        let mx = dt_cur_to.getFullYear();

                        UpdateScatterplot(d1,title_string);				
			        })
			}
			else{
                let url = new URL("http://localhost:8000/get-paper-date-range/" + Paper + "/" + formatDT(dt_cur_from) + "/" + formatDT(dt_cur_to));
                url.search = new URLSearchParams().toString();
                fetch(url, { "credentials": "same-origin" })
                    .then(response => response.json())
                    .then(Datas => {
                        d1 = Datas;
                        //console.log(d1);
                        let mn = dt_cur_from.getFullYear();
                        let mx = dt_cur_to.getFullYear();

                        UpdateScatterplot(d1,"Mitzpeh");
                })				
			}
        }
    });

}

function UpdateScatterplot(Data,title_str) {
    d3.selectAll("#circ").remove();
    d3.selectAll("#x_axis").remove();
    d3.selectAll("#y_axis").remove();
    d3.selectAll("#title_string").remove();	
    //  var w = 1290;
    //  var h = 1000;
    // console.log(Data['year']);
    // console.log(d3.min(Data.word_count));
    // console.log(d3.max(Data.word_count));
    var min_word = Math.min.apply(Math, Data.map(function(o) { return o.word_count; }))
    var max_word = Math.max.apply(Math, Data.map(function(o) { return o.word_count; }))
    var min_year = Math.min.apply(Math, Data.map(function(o) { return o.year; }))
    var max_year = Math.max.apply(Math, Data.map(function(o) { return o.year; }))	
	//var num_data_points
        // var margin = { top: 20, right: 30, bottom: 100, left: 100 },
    var svg = d3.select('svg'),
    w = +svg.attr("width"),
    h = +svg.attr("height");
    console.log(w)
    console.log(h)
    w = 0.85 * w;
    h = 0.85 * h;
    // w = 750;
    // h = 500;
    
    var margin = { top: (0.1 * h), right: (0.025 * w), bottom: (0.05 * h), left: (0.075 * w) };


    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w)
        .attr("height", h)
        // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        //pan and zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .extent([
            [0, 0],
            [w, h]
        ])
        .on("zoom", zoomed);

    svg.append("rect")
        .attr("width", w)
        .attr("height", h)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);
    //var yearScale = d3.scaleLinear()
    //    .domain([mn, mx]).range([0, w]);
    var yearScale = d3.scaleLinear()
        .domain([min_year, max_year+1]).range([0, w]);		

    var hrScale = d3.scaleLinear()
        .domain([min_word, max_word]).range([h, 0]);

    var xAxis = d3.axisBottom().scale(yearScale).ticks(10);

    var yAxis = d3.axisLeft().scale(hrScale).ticks(15, "s");

    function scaleYear(year) {
        return yearScale(year);
    }

    function scaleHomeruns(homeruns) {
        return hrScale(homeruns);
    }
    // **** Code for creating scales, axes and labels ****


    var gx = svg.append('g').attr('id', 'x_axis')
        // .attr('transform', 'translate(0,890)')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top + h) + ')')
        // .attr("width", w)
        // .attr("height", h)
        .style("font","15px times")
        .call(xAxis);
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    var gy = svg.append('g').attr('id', 'y_axis')
        // .attr('transform', 'translate(50,0)')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .style("font","15px times")
        .call(yAxis);

    svg.append('text').attr('id','title_string')
        .attr('class', 'label')
        .attr('transform', 'translate(400,20)')
        .text('Newspapers by Year and Word Count: ' + title_str + ' Version');

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate(550,550)')
        .text('Year');


    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate(15,320) rotate(270)')
        .text('Word Count');
    //Draw points
    var points_g = svg.append("g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("clip-path", "url(#clip)")
        .classed("points_g", true);

    groups = points_g.selectAll("circle")
        .data(Data)
        .enter()
        // .join("circle")
        .append("g")
        .attr('id', 'circ')
        .attr('transform', function(d) {
            return 'translate(' + scaleYear(d.year_dec) + ',' + scaleHomeruns(d.word_count) + ')'
        });
    // svg.call(tooltip);
    groups
        .append('circle')
        .attr("r", 1.5)
        .style('fill', function(d) {
            if (d.paper == "black_explosion") {
                return 'red';
            } else {
                return 'black';
            }
        })
        .attr("stroke-width", 0.2)
        .attr("stroke", "blue")
        .on('click', function(d) {
            d3.select(".info").remove()
            console.log(d.id);
            let urls = new URL("http://localhost:8000/get-data/" + d.id);
            urls.search = new URLSearchParams().toString();
            fetch(urls, { "credentials": "same-origin" })
                .then(response => response.json())
                .then(Data2 => {
                    d2 = Data2
                    $('.title_div').html(d2.title);
                    $('.body_div').html("Article: "+d2.body);
                    $('.paper_div').html("Paper: "+d2.paper);
                })

        })
        .on("mouseover", function(d){
            d3.select(this).attr("r", 5)
        })
        .on("mouseout", function(d){
            d3.select(this).attr("r", 1.5)
        })
        



    function zoomed() {
        // create new scale ojects based on event
        var new_xScale = d3.event.transform.rescaleX(yearScale);
        var new_yScale = d3.event.transform.rescaleY(hrScale);
        // update axes
        gx.call(xAxis.scale(new_xScale));
        gy.call(yAxis.scale(new_yScale));
        groups.data(Data)
            .attr('transform', function(d) {
                return 'translate(' + new_xScale(d.year_dec) + ',' + new_yScale(d.word_count) + ')'
            });
        // .attr('cx', function(d) { return new_xScale(d.year_dec) })
        // .attr('cy', function(d) { return new_yScale(d.word_count) });
    }


}