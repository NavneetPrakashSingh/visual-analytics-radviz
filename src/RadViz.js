let DOMRadViz,
TableTitle, 
ColorAccessor, 
Dimensionality, 
DAnchor, 
DATA;
 function RadViz(){

	 function RV(div) {		

		 let radiusDA = 7,
			 radiusDT = 5; 
		 let nodecolor = d3.scaleOrdinal(d3[selectedColor]); 
		 const formatnumber = d3.format(',d');		
		 let margin = {top:50, right:150, bottom:50, left:200},
			 width = selectedWidth,
			 height = selectedHeight;		
		 let chartRadius = Math.min((height-margin.top-margin.bottom) , (width-margin.left-margin.right))/2;		
		 
		 var titles = TableTitle; 
		 titles.unshift('index');
		 
		 var dimensions = Dimensionality,
			 normalizeSuffix = '_normalized',
			 dimensionNamesNormalized = dimensions.map(function(d) { return d + normalizeSuffix; }),
			 DN = dimensions.length,
			 DA = DAnchor.slice(), 
			 dataE = DATA.slice();

		 dataE.forEach((d,i) => {
			 d.index = i;
			 d.id = i;
			 d.color = nodecolor(ColorAccessor(d));
		 });
		 dataE = addNormalizedValues(dataE);
		 dataE = calculateNodePosition(dataE, dimensionNamesNormalized, DA); 
		 
		 
		 let DAdata = dimensions.map(function(d, i) {
			 return {
				 theta: DA[i],
				 x: Math.cos(DA[i])*chartRadius+chartRadius,
				 y: Math.sin(DA[i])*chartRadius+chartRadius,
				 fixed: true,
				 name: d
				 };
		 });

		 let colorspace = [], colorclass = [];
		 dataE.forEach(function(d, i){
			 if(colorspace.indexOf(d.color)<0) {
				 colorspace.push(d.color); 
				 colorclass.push(d.class); }
		 });	
			 
		 const radviz = d3.select(DOMRadViz);
		 let svg = radviz.append('svg').attr('id', 'radviz')
			 .attr('width', width)
			 .attr('height', height);						
		 svg.append('rect').attr('fill', 'transparent')
			 .attr('width', width)
			 .attr('height', height);
		 let center = svg.append('g').attr('class', 'center').attr('transform', `translate(${margin.left},${margin.top})`); 	
		 svg.append('rect').attr('class', 'DAtip-rect');			
		 let DAtipContainer = svg.append('g').attr('x', 0).attr('y', 0);
		 let DAtip = DAtipContainer.append('g')
			 .attr('class', 'DAtip')
			 .attr('transform', `translate(${margin.left},${margin.top})`)
			 .attr('display', 'none');
		 DAtip.append('rect');
		 DAtip.append('text').attr('width', 150).attr('height', 25)
			 .attr('x', 0).attr('y', 25)
			 .text(':').attr('text-anchor', 'start').attr('dominat-baseline', 'middle');	
		 // prepare DT tooltip components
		 svg.append('rect').attr('class', 'tip-rect')
			 .attr('width', 80).attr('height', 200)
			 .attr('fill', 'transparent')
			 .attr('backgroundColor', d3.rgb(100,100,100)); // add tooltip container				
		 let tooltipContainer = svg.append('g')
			 .attr('class', 'tip')
			 .attr('transform', `translate(${margin.left},${margin.top})`)
			 .attr('display', 'none');

		 const RVRadviz		= d3.select(DOMRadViz).data([RVradviz()]);

		 RVRadviz.each(render);
		 function render(method) {
			 d3.select(this).call(method);	
		 }		
	
		 $('.resetRadViz').click(function(){
			if(path){
				resetRadViz();
			}else{
				alert("Please select a dataset first!");
			}
		 })

		 function resetRadViz() {
			 DA = DAnchor.slice();
			 DAdata = dimensions.map(function(d, i) {
				 return {
					 theta: DA[i], //[0, 2*PI]
					 x: Math.cos(DA[i])*chartRadius+chartRadius,
					 y: Math.sin(DA[i])*chartRadius+chartRadius,
					 fixed: true,
					 name: d
					 };
			 });
			 calculateNodePosition(dataE, dimensionNamesNormalized, DA);		
			 RVRadviz.each(render);
			 alert("Radviz was successfully reseted");
		 } 

		 function RVradviz(){
			 function chart(div) {
				 div.each(function() {
					 drawCircumference(chartRadius, center);
					 drawDA(center, DAdata, radiusDA,svg,margin,chartRadius,DA,dataE,dimensionNamesNormalized,radiusDT);
					 drawDALabel(center, DAdata);
	
					 let tooltip = tooltipContainer.selectAll('text').data(titles)
							 .enter().append('g').attr('x', 0).attr('y',function(d,i){return 25*i;});
					 tooltip.append('rect').attr('width', 150).attr('height', 25).attr('x', 0).attr('y',function(d,i){return 25*i;})
							 .attr('fill', d3.rgb(200,200,200));
					 tooltip.append('text').attr('width', 150).attr('height', 25).attr('x', 5).attr('y',function(d,i){return 25*(i+0.5);})
							 .text(d=>d + ':').attr('text-anchor', 'start').attr('dominat-baseline', 'hanging');

					 drawDT(center,dataE,radiusDT, chartRadius,svg,margin);
					 drawLegend(margin,chartRadius, center, colorspace,radiusDT, colorclass,dataE );
 
					 
				 });
			 }
			 return chart;
		 }

		 function addNormalizedValues(data) {
			 data.forEach(function(d) {
				 dimensions.forEach(function(dimension) {
					 d[dimension] = +d[dimension];
				 });
			 });
			 var normalizationScales = {};
			 dimensions.forEach(function(dimension) {
				 normalizationScales[dimension] = d3.scaleLinear().domain(d3.extent(data.map(function(d, i) {
					 return d[dimension];
				 }))).range([0, 1]);
			 });
			 data.forEach(function(d) {
				 dimensions.forEach(function(dimension) {
					 d[dimension + '_normalized'] = normalizationScales[dimension](d[dimension]);
				 });
			 });
			 data.forEach(function(d) {
				 let dsum = 0;
				 dimensionNamesNormalized.forEach(function (k){ dsum += d[k]; }); // sum
				 d.dsum = dsum;
			 });			
			 return data;
		 }
	 }

	 RV.DOMRadViz = function(_a) {
	 if (!arguments.length) {return console.log('No RadViz DOM')};
		 DOMRadViz = _a;
		 return RV;
	 };	
	 RV.TableTitle = function(_a) {
	 if (!arguments.length) {return console.log('Input TableTitle')};
		 TableTitle = _a;
		 return RV;
	 };
	 RV.ColorAccessor = function(_a) {
		 if (!arguments.length) return console.log('Input ColorAccessor');
		 ColorAccessor = _a;
		 return RV;
	 };	
	 RV.Dimensionality = function(_a) {
		 if (!arguments.length) return console.log('Input Dimensionality');
		 Dimensionality = _a;
		 return RV;
	 };
	 RV.DAnchor = function(_a) {
		 if (!arguments.length) return console.log('Input initial DAnchor');
		 DAnchor = _a;
		 return RV;
	 };	
	 RV.DATA = function(_a) {
		 if (!arguments.length) return console.log('Input DATA');
		 DATA = _a;
		 return RV;
	 };	
	 
	 return RV;
 };