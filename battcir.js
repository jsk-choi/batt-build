const convert = {
    miToKm: 1.67,
    mmToIn: 0.0393701,
    kgToLb: 2.2
};

const colors = {
    red: '#747474',
    black: '#b56464'
};

const celltypes = [
    {
        cell: '30Q',
        price: 4.1,
        ah: 3,
        discharge: 20,
        dia: 18.5,
        len: 65,
        weight: 49
    },
    {
        cell: 'VTC6',
        price: 4.2,
        ah: 3,
        discharge: 20,
        dia: 18.5,
        len: 65,
        weight: 49
    },
    {
        cell: '30T',
        price: 7,
        ah: 3,
        discharge: 35,
        dia: 20.5,
        len: 70,
        weight: 69
    },
    {
        cell: '40T',
        price: 7,
        ah: 4,
        discharge: 30,
        dia: 20.5,
        len: 70,
        weight: 69
    },
    {
        cell: 'P42A',
        price: 7,
        ah: 4,
        discharge: 45,
        dia: 20.5,
        len: 70,
        weight: 69
    }
];
const costs = {
    cell_material_cost: 0.75,
    cell_labor: {
        low: 2.4,
        med: 2.8,
        high: 3.2
    },
    shipping: 30,
    labor_10s: 0,
    labor_12s: 0.3,
    bms_10s: 34,
    bms_12s: 35
};

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
const cellSpace = 2.03;

const initSpaceX = 5;
const initSpaceY = 5;

context.lineWidth = 1;

let drawBatt = (p_batt, p_cell) => {

    context.clearRect(0, 0, canvas.width, canvas.height);

    let centerX = p_cell.dia * initSpaceX;
    let centerY = p_cell.dia * initSpaceY;
    let radius = p_cell.dia;

    for (var s = 0; s < (p_batt.s / 2); s++) {

        let color = colors.red;

        if ((s % 2) == 1) {
            color = colors.black;
        }

        for (var p = 0; p < p_batt.p; p++) {

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.stroke();

            // TOP VIEW
            context.beginPath();
            context.rect(centerX - p_cell.dia, centerY + (p_cell.dia * 3), p_cell.dia * 2, p_cell.len * 2);
            context.fill();
            context.stroke();

            context.beginPath();
            context.rect(centerX - p_cell.dia, centerY + (p_cell.len * 3 + 10), p_cell.dia * 2, p_cell.len * 2);
            context.fillStyle = color == colors.red ? colors.black : colors.red;
            context.fill();
            context.stroke();

            centerX += p_cell.dia * cellSpace;
        }
    }

    let lenEnd = centerX;
    centerX = p_cell.dia * initSpaceX;
    centerY = p_cell.dia * initSpaceY;

    context.beginPath();
    context.fillStyle = "black";

    context.lineWidth = 1;

    // SIDE VIEW DIMS
    // X, Y, W, H
    context.strokeRect(
        lenEnd - radius + 10,
        centerY + (p_cell.len - 10),
        15,
        1);
    context.strokeRect(
        lenEnd - radius + 10,
        centerY + (p_cell.len * 5 + 10),
        15,
        1);
    context.strokeRect(
        lenEnd - radius + 25,
        centerY + (p_cell.len - 10),
        1,
        p_cell.len * 4 + 21);

    // TOP VIEW DIMS
    // X, Y, W, H
    context.strokeRect(
        centerX - radius, 
        centerY - (radius * 2), 
        lenEnd - (radius * 5), 
        1); 
    context.strokeRect(
        centerX - radius,
        centerY - (radius * 2),
        1,
        15);
    context.strokeRect(
        lenEnd - radius,
        centerY - (radius * 2),
        1,
        15);

    context.font = '18px Calibri';

    // text, X, Y, maxWidth
    let lenStr = `${p_batt.dim_length_in}" (${p_batt.dim_length_mm}mm)`;
    let widthStr = `${p_batt.dim_width_in}" (${p_batt.dim_width_mm}mm)`;
    context.fillText(
        lenStr,
        (lenEnd / 2) - 20,
        centerY - ((radius * 2) + 5)
    )
    context.fillText(
        widthStr,
        lenEnd - radius + 35,
        p_cell.len * 4 + 30
    )

    context.closePath();
    context.fill();
    context.stroke();
};

let drawBattStacked = (p_batt, p_cell) => {

    context.clearRect(0, 0, canvas.width, canvas.height);

    let centerX = p_cell.dia * initSpaceX;
    let centerY = p_cell.dia * initSpaceY;
    let radius = p_cell.dia;

    let stackCtUp = Math.round((p_batt.p / 2) + 0.1);
    let stackCtDown = p_batt.p - stackCtUp;
    let color = colors.red;

    // TOP ROW
    for (var s = 0; s < (p_batt.s / 2); s++) {

        color = colors.red;

        let pCount = stackCtUp;

        if ((s % 2) == 1) {
            color = colors.black;
            pCount = stackCtDown;
        }

        for (var p = 0; p < pCount; p++) {

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.stroke();

            // TOP VIEW
            context.beginPath();
            context.rect(centerX - p_cell.dia, centerY + (p_cell.dia * 4), p_cell.dia * 2, p_cell.len * 2);
            context.fill();
            context.stroke();

            context.beginPath();
            context.rect(centerX - p_cell.dia, centerY + (p_cell.len * 3 + 30), p_cell.dia * 2, p_cell.len * 2);
            context.fillStyle = color == colors.red ? colors.black : colors.red;
            context.fill();
            context.stroke();

            centerX += p_cell.dia * cellSpace;
        }
    }

    //color = color == colors.red ? colors.red : colors.black;

    context.beginPath();
    context.rect(centerX - p_cell.dia, centerY + (p_cell.dia * 4), p_cell.dia, p_cell.len * 2);
    context.fillStyle = color;
    context.fill();
    context.stroke();

    context.beginPath();
    context.rect(centerX - p_cell.dia, centerY + (p_cell.len * 3 + 30), p_cell.dia, p_cell.len * 2);
    context.fillStyle = color == colors.red ? colors.black : colors.red;
    context.fill();
    context.stroke();

    centerX = (p_cell.dia * initSpaceX) + p_cell.dia;
    centerY += p_cell.dia * 1.8;

    // BOTTOM ROW
    for (var s = 0; s < (p_batt.s / 2); s++) {

        let color = colors.red;
        let pCount = stackCtDown;

        if ((s % 2) == 1) {
            color = colors.black;
            pCount = stackCtUp;
        }

        for (var p = 0; p < pCount; p++) {

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
            context.lineWidth = 1;
            context.stroke();

            centerX += p_cell.dia * cellSpace;
        }
    }






    let lenEnd = centerX;
    centerX = p_cell.dia * initSpaceX;
    centerY = p_cell.dia * initSpaceY;

    context.beginPath();
    context.fillStyle = "black";

    context.lineWidth = 1;

    // TOP VIEW DIMS
    // X, Y, W, H
    context.strokeRect(
        centerX - radius,
        centerY - (radius * 2),
        lenEnd - (radius * 5),
        1);
    context.strokeRect(
        centerX - radius,
        centerY - (radius * 2),
        1,
        15);
    context.strokeRect(
        lenEnd - radius,
        centerY - (radius * 2),
        1,
        15);

    centerY += p_cell.dia;

    // SIDE VIEW DIMS
    // X, Y, W, H
    context.strokeRect(
        lenEnd - radius + 10,
        centerY + (p_cell.len - 10),
        15,
        1);
    context.strokeRect(
        lenEnd - radius + 10,
        centerY + (p_cell.len * 5 + 10),
        15,
        1);
    context.strokeRect(
        lenEnd - radius + 25,
        centerY + (p_cell.len - 10),
        1,
        p_cell.len * 4 + 21);

    context.font = '18px Calibri';

    // text, X, Y, maxWidth
    let lenStr = `${p_batt.dim_length_in}" (${p_batt.dim_length_mm}mm)`;
    let widthStr = `${p_batt.dim_width_in}" (${p_batt.dim_width_mm}mm)`;
    context.fillText(
        lenStr,
        (lenEnd / 2) - 20,
        centerY - ((radius * 2) + 25)
    )
    context.fillText(
        widthStr,
        lenEnd - radius + 35,
        p_cell.len * 4 + 55
    )

    context.closePath();
    context.fill();
    context.stroke();
};

let batt = {
    s: 0,
    p: 0,
    stack: true
};

let cell = {
    cell: '',
    dia: 19.5,
    len: 65
};

let batt_calc = (p_batt, p_cell) => {

    let cell_qt = p_batt.s * p_batt.p;
    let cell_labor = 0;

    if (cell_qt < 25) {
        cell_labor = costs.cell_labor.high;
    } 
    else if (cell_qt < 51) {
        cell_labor = costs.cell_labor.med;
    } 
    else {
        cell_labor = costs.cell_labor.low;
    }

    p_batt.dim_length_mm = ((p_batt.s * p_batt.p) / (p_batt.stack ? 4 : 2)) * p_cell.dia;        
    p_batt.dim_width_mm = (p_cell.len * 2) + 10;
    p_batt.dim_height_mm = (((p_cell.dia * 1.28) * (p_batt.stack ? 2 : 1)) + 3).toFixed(0);

    p_batt.dim_length_in = (p_batt.dim_length_mm * convert.mmToIn).toFixed(1);
    p_batt.dim_width_in = (p_batt.dim_width_mm * convert.mmToIn).toFixed(1);
    p_batt.dim_height_in = (p_batt.dim_height_mm * convert.mmToIn).toFixed(1);

    p_batt.desc = `${p_batt.s}s${p_batt.p}p - ${p_cell.cell}`;
    p_batt.volt_nom = (p_batt.s * 3.6).toFixed(1);
    p_batt.volt_max = (p_batt.s * 4.2).toFixed(1);
    p_batt.wh = p_cell.ah * p_batt.p * p_batt.s * 3.6;
    p_batt.range_mi = Math.round(p_batt.wh / 20);
    p_batt.range_km = Math.round(p_batt.range_mi * convert.miToKm);
    p_batt.discharge = p_cell.discharge * p_batt.p;

    p_batt.weight_kg = ((p_cell.weight * cell_qt) / 1000) * 1.1;
    p_batt.weight_lb = p_batt.weight_kg * convert.kgToLb;
    
    let battCalc = {
        batt: p_batt,
        cell: p_cell,
        costs: [
            {
                item: `Cell-${p_cell.cell}`,
                price: p_cell.price.toFixed(2),
                qt: cell_qt,
                total: (p_cell.price * cell_qt).toFixed(2)
            },
            {
                item: `Per-cell Material cost`,
                price: costs.cell_material_cost.toFixed(2),
                qt: cell_qt,
                total: (costs.cell_material_cost * cell_qt).toFixed(2)
            },
            {
                item: `Per-cell Labor`,
                price: (cell_labor + costs[`labor_${p_batt.s}s`]).toFixed(2),
                qt: cell_qt,
                total: ((cell_labor + costs[`labor_${p_batt.s}s`]) * cell_qt).toFixed(2)
            },
            {
                item: `BMS-${p_batt.s}s`,
                price: costs[`bms_${p_batt.s}s`].toFixed(2),
                qt: 1,
                total: (costs[`bms_${p_batt.s}s`]).toFixed(2)
            },
            {
                item: `Shipping`,
                price: costs.shipping.toFixed(2),
                qt: '',
                total: (costs.shipping).toFixed(2)
            }
        ]
    };

    battCalc.costs.push({
        item: `PayPal fee`,
        price: '',
        qt: '',
        total: battCalc.costs.reduce((sum, itm) => {
            return sum + (itm.total) * 0.038;
        }, 0).toFixed(2)
    });

    battCalc.costs.push({
        item: `Total`,
        price: '',
        qt: '',
        total: battCalc.costs.reduce((sum, itm) => {
            return sum + parseFloat(itm.total);
        }, 0).toFixed(2)
    });
    
    return battCalc;
};

$(() => {

    let $sel_cells = $('#batt-celltype');
    $sel_cells.append($("<option/>").attr("value", '--').text('--'));
    celltypes.forEach((cell) => {
        $sel_cells.append($("<option/>").attr("value", cell.cell).text(cell.cell));
    });
    
    $('.selection').change((e) => {

        // ALL OPTIONS SELECTED
        if (!(
            $('#batt-series')[0].selectedIndex > 0 && 
            $('#batt-parallel')[0].selectedIndex > 0 && 
            $('#batt-celltype')[0].selectedIndex > 0)) {
            return;
        }

        $('#tblCost tbody').empty();
        $('#tblCost').parent().show();
        $('#tblSpecs').parent().show();

        // SELECTED CELL
        cell = celltypes.filter(x => { return x.cell == $('#batt-celltype').val() }).shift();

        // BATTERY SPECS
        batt = {
            s: parseInt($('#batt-series').val()),
            p: parseInt($('#batt-parallel').val()),
            stack: $('#batt-stacked').prop('checked')        
        };

        let query_param = {
            "s": batt.s,
            "p": batt.p,
            "stack": batt.stack,
            "cell": cell.cell
        };


        let state = { 'page_id': 1, 'user_id': 5 }
        let title = ''
        let url = 'index.html?sel=' + JSON.stringify(query_param);

        history.pushState(state, title, url)

        console.log(decodeURIComponent(window.location.search));
        var urlParams = new URLSearchParams(decodeURIComponent(window.location.search));
        //const urlParams = new URLSearchParams(window.location.search);
        const myParam = JSON.parse(urlParams.get('sel'));
        console.log(myParam);


        //var thisSelection = batt_calc(batt, cell);
        
        //var tplSpecs = $.templates("tplSpecs", {
        //    markup: '#tplSpecs',
        //    converters: {
        //        toFixedZero: (v) => {
        //            return v.toFixed(0);
        //        }
        //    }
        //});
        //var htmlSpecs = tplSpecs.render(thisSelection);
        //$('#secSpecs').html(htmlSpecs).show();

        //var tplPrice = $.templates("#tplPrice");
        //var htmlPrice = tplPrice.render(thisSelection);
        //$('#secPrice').html(htmlPrice).show();

        //if (batt.stack){
        //    drawBattStacked(batt, cell);
        //}
        //else {
        //    drawBatt(batt, cell);
        //}

        //// COMPARE TABLE MAP
        //let compare_data = celltypes.map(x => {

        //    let this_calc = batt_calc(batt, x);

        //    let retVal = {
        //        cell: this_calc.cell.cell,
        //        price: this_calc.costs.filter(x => 
        //            { 
        //                return x.item == 'Total'
        //            }
        //        ).shift().total,
        //        wh: this_calc.batt.wh.toFixed(0),
        //        range_mi: this_calc.batt.range_mi,
        //        range_km: this_calc.batt.range_km,
        //        dim_mm: `${this_calc.batt.dim_length_mm}x${this_calc.batt.dim_width_mm}x${this_calc.batt.dim_height_mm}mm`,
        //        dim_in: `${this_calc.batt.dim_length_in}x${this_calc.batt.dim_width_in}x${this_calc.batt.dim_height_in}in`
        //    };
        //    retVal.cost_wh = (retVal.price / retVal.wh).toFixed(2);

        //    return retVal;
        //});

        //var tplCompare = $.templates("#tplCompare");
        //var htmlCompare = tplCompare.render({
        //    data: compare_data
        //});
        //$('#secCompare').html(htmlCompare).show();
    });

    $('body').resize((e) => {
        $('#myCanvas').width(e.width)
    });

    $(window).resize(function () {
        $('#myCanvas').prop('width', $(window).width() - 30);
        $('#batt-celltype').change();
    });

    $(window).resize();
    $('#batt-series')[0].selectedIndex = 2;
    $('#batt-parallel')[0].selectedIndex = 4;
    $('#batt-celltype')[0].selectedIndex = 4;
    $('#batt-stacked').prop('checked', true);
    $('#batt-celltype').change();
});
