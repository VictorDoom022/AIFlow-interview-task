
var tableRowCount = 0;
var selectedTableRow = 0;

$("#hideBtn").click(function(){
    $("#tableDiv").slideToggle();
});

async function getSupplier(){
    await $.ajax({
        type: 'GET',
        url: '/AIFlowsAssignment/backend/supplierController.php',
        processData: false,
        contentType: false,
        success: function(data){
            var parsedData = JSON.parse(data);
            // remove previous table row before render the updated ones
            removeTableRow();

            if(parsedData.length == 0 || parsedData == null){
                addRow(1, false);
            }

            // reverse loop
            for(var i = parsedData.length - 1; i >= 0; i--){
                var renderedTableRow = renderTableRow(i, parsedData[i]);
                $('#row').eq(0).after(renderedTableRow);
            }

            calculateTableRow();
        }
    });
}

function removeTableRow(){
    for(var i = 0; i < tableRowCount; i++){
        $('#row-' + i).remove();
    }
}

// render table row to existing data
function renderTableRow(index, supplier){

    var viewCertButton = '';

    if(supplier.cert == ""){
        viewCertButton = `<button class="btn btn-danger mt-4" style="width: 100%">No Cert</button>`;
    }else{
        viewCertButton = `<a href="`+ supplier.cert +`" class="btn btn-primary mt-4" style="width: 100%">View Cert</a>`;
    }

    return `
        <tr id="row-`+ index +`">
            <td>
                <p class="mt-4 fw-bold">`+ (index + 1 )+`</p>
            </td>
            <td>
                <select onclick="addRow(`+ (tableRowCount + 1) +`, true)" name="name-`+ supplier.id +`" id="name-`+ supplier.id +`" class="form-select mt-4">
                    <option value="` + supplier.name + `">` + supplier.name + `</option>
                    <option value="Astar Steel Sdn Bhd">Astar Steel Sdn Bhd</option>
                    <option value="Yick Hoe Steel Industries Sdn Bhd">Yick Hoe Steel Industries Sdn Bhd</option>
                </select>
            </td>
            <td>
                <input onclick="addRow(`+ (tableRowCount + 1) +`, true)" name="cost-`+ supplier.id +`" id="cost-`+ supplier.id +`" type="text" class="form-control mt-4" value="`+ supplier.cost +`">
            </td>
            <td>
                <input onclick="addRow(`+ (tableRowCount + 1) +`, true)" name="grade-`+ supplier.id +`" id="grade-`+ supplier.id +`" type="text" class="form-control mt-4" value="`+ supplier.grade +`">
            </td>
            <td>
                <div class="d-flex fw-bold">
                    <div>
                        <label>T</label>
                        <input onclick="addRow(`+ (tableRowCount + 1) +`, true)" name="measurementTall-`+ supplier.id + `" id="measurementTall-`+ supplier.id + `" type="text" class="form-control" value="`+ supplier.measurementTall +`">
                    </div>
                    
                    <span class="m-auto px-1">x</span>

                    <div>
                        <label>W</label>
                        <input onclick="addRow(`+ (tableRowCount + 1) +`, true)" name="measurementWidth-`+ supplier.id + `" id="measurementWidth-`+ supplier.id + `" type="text" class="form-control" value="`+ supplier.measurementWidth +`">
                    </div>
                    
                    <span class="m-auto px-1">x</span>

                    <div>
                        <label>L</label>
                        <input onclick="addRow(`+ (tableRowCount + 1) +`, true)" name="measurementLength-`+ supplier.id + `" id="measurementLength-`+ supplier.id + `" type="text" class="form-control" value="`+ supplier.measurementLength +`">
                    </div>
                </div>
            </td>
            <td>
                <input onclick="addRow(`+ (tableRowCount + 1) +`, true)" name="weight-`+ supplier.id +`" id="weight-`+ supplier.id +`" type="text" class="form-control mt-4" value="` + supplier.weight + `">
            </td>
            <td>
                <select onclick="addRow(`+ (tableRowCount + 1) +`, true)"  name="UOM" id="UOM-`+ supplier.id +`" class="form-select mt-4">
                    <option value="KGS">` + supplier.UOM + `</option>
                </select>
            </td>
            <td>
                `+ viewCertButton +`
            </td>
            <td style="display: flex; flex-direction: column;">
                <span id="cert-label-`+ supplier.id +`">&nbsp;</span>
                <label class="btn btn-primary" style="min-width: 6rem;">
                    Select File
                    <input onchange="$('#cert-label-`+ supplier.id + `').text(this.files[0].name)" name="cert-`+ supplier.id +`" id="cert-`+ supplier.id +`" type="file" style="display:none">
                </label>
            </td>
            <td>
                <input onclick="editSupplier(`+ supplier.id +`)" class="btn btn-primary mt-4" name="addSupplier" type="button" value="Submit">
            </td>
        </tr>
    `;
}

$("#supplierTable").on("click", "tr", function(e){
    //current selected table row
    // console.log($(e.currentTarget).index());
    selectedTableRow = $(e.currentTarget).index();
    console.log('selectedTableRow: ' + selectedTableRow);

})

function calculateTableRow() {
    var rowCount = $("#supplierTable tr").length - 1;
    tableRowCount = rowCount - 1;
    console.log('tableRowCount: ' + tableRowCount);
}

async function editSupplier(id){

    var name = document.getElementById('name-' + id).value;
    var cost = document.getElementById('cost-' + id).value;
    var grade = document.getElementById('grade-' + id).value;
    var measurementTall = document.getElementById('measurementTall-' + id).value;
    var measurementWidth = document.getElementById('measurementWidth-' + id).value;
    var measurementLength = document.getElementById('measurementLength-' + id).value;
    var weight = document.getElementById('weight-' + id).value;
    var UOM = document.getElementById('UOM-' + id).value;
    var cert = document.getElementById('cert-' + id).files[0];


    var formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('cost', cost);
    formData.append('grade', grade);
    formData.append('measurementTall', measurementTall);
    formData.append('measurementWidth', measurementWidth);
    formData.append('measurementLength',measurementLength );
    formData.append('weight', weight);
    formData.append('UOM', UOM);
    if(cert != null) {
        formData.append('cert', cert);
    }
    formData.append('editSupplier', 'editSupplier');
    
    await $.ajax({
        type: 'POST',
        url: '/AIFlowsAssignment/backend/supplierController.php',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            getSupplier();
        },
        error: function(){

        }
    })
}

async function addSupplier(index){

    var name = document.getElementById('name-new-' + index).value;
    var cost = document.getElementById('cost-new-' + index).value;
    var grade = document.getElementById('grade-new-' + index).value;
    var measurementTall = document.getElementById('measurementTall-new-' + index).value;
    var measurementWidth = document.getElementById('measurementWidth-new-' + index).value;
    var measurementLength = document.getElementById('measurementLength-new-' + index).value;
    var weight = document.getElementById('weight-new-' + index).value;
    var UOM = document.getElementById('UOM-new-' + index).value;
    var cert = document.getElementById('cert-new-' + index).files[0];


    var formData = new FormData();
    formData.append('name', name);
    formData.append('cost', cost);
    formData.append('grade', grade);
    formData.append('measurementTall', measurementTall);
    formData.append('measurementWidth', measurementWidth);
    formData.append('measurementLength',measurementLength );
    formData.append('weight', weight);
    formData.append('UOM', UOM);
    if(cert != null) {
        formData.append('cert', cert);
    }
    formData.append('addSupplier', 'addSupplier');

    await $.ajax({
        type: 'POST',
        url: '/AIFlowsAssignment/backend/supplierController.php',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            getSupplier();
        },
        error: function(){

        }
    })
}

// render new table row with no data.
// isContinuous determine if the row is the new row added with existing data.
function addRow(index, isContinuous){
    if(tableRowCount == selectedTableRow){
        var rowID = '#row';
        
        if(isContinuous == true){
            rowID = '#row-' + (tableRowCount -1)
        }

        if(isContinuous == null && tableRowCount > 0){
            rowID = '#row-' + (tableRowCount)
        }

        $(rowID).eq(0).after(
            `
            <tr id="row-`+ (tableRowCount + 1) +`">
                <td>
                    <p class="mt-4 fw-bold">`+ (tableRowCount + 1) +`</p>
                </td>
                <td>
                    <select onclick="addRow(`+ (tableRowCount + 1) +`)" name="name" id="name-new-`+ index +`" class="form-select mt-4">
                        <option value="" selected></option>
                        <option value="Astar Steel Sdn Bhd">Astar Steel Sdn Bhd</option>
                        <option value="Yick Hoe Steel Industries Sdn Bhd">Yick Hoe Steel Industries Sdn Bhd</option>
                    </select>
                </td>
                <td>
                    <input onclick="addRow(`+ (tableRowCount + 1) +`)" name="cost" id="cost-new-`+ index +`" type="text" class="form-control mt-4">
                </td>
                <td>
                    <input onclick="addRow(`+ (tableRowCount + 1) +`)" name="grade" id="grade-new-`+ index +`" type="text" class="form-control mt-4">
                </td>
                <td>
                    <div class="d-flex fw-bold">
                        <div>
                            <label>T</label>
                            <input onclick="addRow(`+ (tableRowCount + 1) +`)" name="measurementTall" type="text" id="measurementTall-new-`+ index +`" class="form-control">
                        </div>
                        
                        <span class="m-auto px-1">x</span>

                        <div>
                            <label>W</label>
                            <input onclick="addRow(`+ (tableRowCount + 1) +`)" name="measurementWidth" type="text" id="measurementWidth-new-`+ index +`" class="form-control">
                        </div>
                        
                        <span class="m-auto px-1">x</span>

                        <div>
                            <label>L</label>
                            <input onclick="addRow(`+ (tableRowCount + 1) +`)" name="measurementLength" type="text" id="measurementLength-new-`+ index +`" class="form-control">
                        </div>
                    </div>
                </td>
                <td>
                    <input onclick="addRow(`+ (tableRowCount + 1) +`)" name="weight" type="text" id="weight-new-`+ index +`" class="form-control mt-4">
                </td>
                <td>
                    <select onclick="addRow(`+ (tableRowCount + 1) +`)"  name="UOM" id="UOM-new-`+ index +`" class="form-select mt-4">
                        <option value="KGS">KGS</option>
                    </select>
                </td>
                <td style="display: flex; flex-direction: column;">
                    <span id="cert-label-new-`+ index +`">&nbsp;</span>
                    <label class="btn btn-primary" style="min-width: 6rem;">
                        Select File
                        <input onchange="$('#cert-label-new-`+ index + `').text(this.files[0].name)" id="cert-new-`+ index +`" type="file" style="display:none">
                    </label>
                </td>
                <td></td>
                <td>
                    <input onclick="addSupplier(`+ index +`)" class="btn btn-primary mt-4" name="addSupplier" type="button"  value="Submit">
                </td>
            </tr>`
        );
        calculateTableRow();
    }
}