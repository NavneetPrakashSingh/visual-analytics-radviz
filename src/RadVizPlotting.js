//draws the circumference for the circle
/*
|D3 methods used in the following function:
|   .append(name_to_be_appended): Appends a new element with the specific name as the last child of element to which it is appended
|   .attr(attribute_name, attribute_property): Helps to set attribute to a specific value
|   .rgb(red,gree,blue): Specifies the color for d3 attribute element to be appended
*/
function drawCircumference(chartRadius, center) {
    let panel = center.append('circle')
        .attr('class', 'big-circle')
        .attr('stroke', d3.rgb(0,0,0))
        .attr('stroke-width', 3)
        .attr('fill', 'transparent')
        .attr('r', chartRadius)
        .attr('cx', chartRadius)
        .attr('cy', chartRadius);
}

/*
|   D3 methods used in the following function:
|   .format(type_of_format): displays the data in the specified format E.g. .4r, .4f, .4n, .3n, etc
|   .remove(): removes DOM elements 
|   .selectAll(): Selecting all the DOM elements in order to do something on them
|   .data(): specifies data on which the operation is to be performed
|   .enter(): created the initial join of the data to the element
|   .append(): adds the new element with the specified name to be added as the last child of each element
|   .attr(attribute_name, attribute_property): Helps to set attribute to a specific value
*/

function drawDA(center, DAdata, radiusDA,svg,margin,chartRadius, DA,dataE,dimensionNamesNormalized,radiusDT){
    const formatnumber = d3.format(',d');	
    center.selectAll('circle.DA-node').remove();
    let DANodes = center.selectAll('circle.DA-node')
        .data(DAdata)
        .enter().append('circle').attr('class', 'DA-node')
        .attr('fill', d3.rgb(120,120,120))
        .attr('stroke', d3.rgb(120,120,120))
        .attr('stroke-width', 1)
        .attr('r', radiusDA)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .on('mouseenter', function(d){
            let damouse = d3.mouse(this); // get current mouse position
            svg.select('g.DAtip').select('text').text('(' + formatnumber((d.theta/Math.PI)*180) + ')').attr('fill', 'darkorange').attr('font-size', '18pt');
            svg.select('g.DAtip').attr('transform',  `translate(${margin.left + damouse[0] +0},${margin.top+damouse[1] - 50})`);
            svg.select('g.DAtip').attr('display', 'block');
        })
        .on('mouseout', function(d){
            svg.select('g.DAtip').attr('display', 'none');
        })
        .call(d3.drag()
            .on('start',function(d){
                d3.select(this).raise().classed('active', true);
            })
            .on('drag', function(d){
                d3.select(this).classed('active', false);
                d3.select(this).attr('stroke-width', 0);
            })
            .on('end', function(d,i){
                d3.select(this).raise().classed('active', true);
                let tempx = d3.event.x - chartRadius;
                let tempy = d3.event.y - chartRadius;
                let newAngle = Math.atan2( tempy , tempx ) ;	
                newAngle = newAngle<0? 2*Math.PI + newAngle : newAngle;
                d.theta = newAngle;
                d.x = chartRadius + Math.cos(newAngle) * chartRadius;
                d.y = chartRadius + Math.sin(newAngle) * chartRadius;
                d3.select(this).attr('cx', d.x).attr('cy', d.y);
                drawDA(center, DAdata, radiusDA,svg,margin,chartRadius, DA,dataE,dimensionNamesNormalized,radiusDT);
                drawDALabel(center, DAdata);
                DA[i] = newAngle;
                calculateNodePosition(dataE, dimensionNamesNormalized, DA);
                drawDT(center,dataE,radiusDT, chartRadius,svg,margin);
            })
        );
}	

/*
|   D3 methods used in the following function:
|   .remove(): removes DOM elements 
|   .selectAll(): Selecting all the DOM elements in order to do something on them
|   .data(): specifies data on which the operation is to be performed
|   .enter(): created the initial join of the data to the element
|   .append(): adds the new element with the specified name to be added as the last child of each element
|   .attr(attribute_name, attribute_property): Helps to set attribute to a specific value
|   .text(text_label): adds text label to the svg
*/

function drawDALabel(center, DAdata) {
    center.selectAll('text.DA-label').remove();
    let DANodesLabel = center.selectAll('text.DA-label')
        .data(DAdata).enter().append('text').attr('class', 'DA-label')
        .attr('x', d => d.x).attr('y', d => d.y)
        .attr('text-anchor', d=>Math.cos(d.theta)>0?'start':'end')
        .attr('dominat-baseline', d=>Math.sin(d.theta)<0?'baseline':'hanging')
        .attr('dx', d => Math.cos(d.theta) * 15)
        .attr('dy', d=>Math.sin(d.theta)<0?Math.sin(d.theta)*(15):Math.sin(d.theta)*(15)+ 10)
        .text(d => d.name)
        .attr('font-size', '18pt');					
}

/*
|   D3 methods used in the following function:
|   .remove(): removes DOM elements 
|   .selectAll(): Selecting all the DOM elements in order to do something on them
|   .data(): specifies data on which the operation is to be performed
|   .enter(): created the initial join of the data to the element
|   .append(): adds the new element with the specified name to be added as the last child of each element
|   .attr(attribute_name, attribute_property): Helps to set attribute to a specific value
|   .mouse(current_mouse): Gets the current mouse position
|   .transition(): Animates the current element to the new position
*/

function drawDT(center,dataE, radiusDT, chartRadius,svg,margin){
    center.selectAll('.circle-data').remove();
    let DTNodes = center.selectAll('.circle-data')
        .data(dataE).enter().append('circle').attr('class', 'circle-data')
        .attr('id', d=>d.index)
        .attr('r', radiusDT)
        .attr('fill', d=>d.color)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('cx', d => d.x0*chartRadius + chartRadius)
        .attr('cy', d => d.y0*chartRadius + chartRadius)
        .on('mouseenter', function(d) {
            let mouse = d3.mouse(this); 
            let tip = svg.select('g.tip').selectAll('text').text(function(k, i){
                return k + ': ' + d[k];
            });
            svg.select('g.tip').attr('transform',  `translate(${margin.left + mouse[0] +20},${margin.top+mouse[1] - 120})`);
            svg.select('g.tip').attr('display', 'block');
            d3.select(this).raise().transition().attr('r', radiusDT*2).attr('stroke-width', 3);		
        })
        .on('mouseout', function(d) {
            svg.select('g.tip').attr('display', 'none');
            d3.select(this).transition().attr('r', radiusDT).attr('stroke-width', 0.5);
        });					
}	

/*
|   Calculates the position for the nodes. Normalized dimensions are passed and as mentioned in the research paper, the distances
|   and the angles are calculated as shown below. 
*/

function calculateNodePosition(dataE, dimensionNamesNormalized, DA) {
    dataE.forEach(function(d) {
        let dsum = d.dsum, dx = 0, dy = 0;
        dimensionNamesNormalized.forEach(function (k, i){ 
            dx += Math.cos(DA[i])*d[k]; 
            dy += Math.sin(DA[i])*d[k]; }); // dx & dy
        d.x0 = dx/dsum;
        d.y0 = dy/dsum;
        d.dist 	= Math.sqrt(Math.pow(dx/dsum, 2) + Math.pow(dy/dsum, 2)); // calculate r
        d.distH = Math.sqrt(Math.pow(dx/dsum, 2) + Math.pow(dy/dsum, 2)); // calculate r
        d.theta = Math.atan2(dy/dsum, dx/dsum) * 180 / Math.PI; 
    });
    return dataE;
} 

/*
|   D3 methods used in the following function:
|   .remove(): removes DOM elements 
|   .selectAll(): Selecting all the DOM elements in order to do something on them
|   .data(): specifies data on which the operation is to be performed
|   .enter(): created the initial join of the data to the element
|   .append(): adds the new element with the specified name to be added as the last child of each element
|   .attr(attribute_name, attribute_property): Helps to set attribute to a specific value
|   .text(text_label): adds text label to the svg
*/

function drawLegend(margin,chartRadius, center, colorspace, radiusDT, colorclass,dataE) {
    let heightLegend = 25, xLegend = margin.left+chartRadius*2, yLegend = 25;
    let legendcircle = center.selectAll('circle.legend').data(colorspace)
        .enter().append('circle').attr('class', 'legend')
        .attr('r', radiusDT)
        .attr('cx', xLegend)
        .attr('cy', (d, i) => i*yLegend)
        .attr('fill', d=>d);
    let legendtexts = center.selectAll('text.legend').data(colorclass)
        .enter().append('text').attr('class', 'legend')
        .attr('x', xLegend + 2 * radiusDT)
        .attr('y', (d, i) => i*yLegend+5)
        .text(d => d).attr('font-size', '16pt').attr('dominat-baseline', 'middle')
        .on('mouseover', function(d){
            let tempa = d3.select(DOMRadViz).selectAll('.circle-data');
            tempa.nodes().forEach((element) => {
                let tempb = element.getAttribute('id');
                if (dataE[tempb][targetField] != d) {
                    d3.select(element).attr('fill-opacity', 0.2).attr('stroke-width', 0);
                }
            });
        })
        .on('mouseout', function(d) {
            d3.select(DOMRadViz).selectAll('.circle-data')
                .attr('fill-opacity', 1).attr('stroke-width', 0.5);
        });					
}	