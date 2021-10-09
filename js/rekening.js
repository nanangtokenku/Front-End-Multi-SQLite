//  Declare SQL Query for SQLite
var createStatement = "CREATE TABLE IF NOT EXISTS Rekening (id INTEGER PRIMARY KEY AUTOINCREMENT, koderekening TEXT UNIQUE, namarekening TEXT, jenisrekening TEXT, saldonormal TEXT)";
var selectAllStatement = "SELECT * FROM Rekening ORDER BY koderekening ASC";
var insertStatement = "INSERT INTO Rekening (koderekening, namarekening, jenisrekening, saldonormal) VALUES (?, ?, ?, ?)";
var updateStatement = "UPDATE Rekening SET koderekening = ?, namarekening = ?, jenisrekening = ?, saldonormal = ? WHERE id=?";
var deleteStatement = "DELETE FROM Rekening WHERE id=?";
var dropStatement = "DROP TABLE Rekening";
var db = openDatabase("DanaBookJogjaide", "1.0", "Dana Book", 200000); // Open SQLite Database
var dataset;
var DataType;

function initDatabase() // Function Call When Page is ready.
{
    try {
        if (!window.openDatabase) // Check browser is supported SQLite or not.
        {
            alert('Databases are not supported in this browser.');
        } else {
            createTable(); // If supported then call Function for create table in SQLite
        }
    } catch (e) {
        if (e == 2) {
            // Version number mismatch. 
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }
        return;
    }
}

function createTable() // Function for Create Table in SQLite.
{
    db.transaction(function(tx) {
        tx.executeSql(createStatement, [], showRecords, onError);
    });
}

function insertRecord() // Get value from Input and insert record . Function Call when Save/Submit Button Click..
{
	if($('input:text[id=koderekening]').val() == ""){
		return;
	}
	if($('input:text[id=namarekening]').val() == ""){
		return;
	}
    var koderekeningtemp = $('input:text[id=koderekening]').val();
    var namarekeningtemp = $('input:text[id=namarekening]').val();
    var jenisrekeningtemp = $('#jenisrekening').val();
    var saldonormaltemp = $('#saldonormal').val();
    db.transaction(function(tx) {
        tx.executeSql(insertStatement, [koderekeningtemp, namarekeningtemp, jenisrekeningtemp, saldonormaltemp], loadAndReset, onError);
    });
    //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );
}

function deleteRecord(id) // Get id of record . Function Call when Delete Button Click..
{
	
  swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function(isConfirm) {
      if (isConfirm) {
        swal({
          title: 'Shortlisted!',
          text: 'Item Telah di hapus.',
          icon: 'success'
        }).then(function() {
          	var iddelete = id.toString();
			db.transaction(function(tx) {
				tx.executeSql(deleteStatement, [id], showRecords, onError);
			});
			resetForm(); 
        });
      } else {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    })


}

function updateRecord() // Get id of record . Function Call when Delete Button Click..
{
    var koderekeningupdate = $('input:text[id=koderekening]').val().toString();
    var namarekeningupdate = $('input:text[id=namarekening]').val().toString();
    var jenisrekeningtemp = $('#jenisrekening').val().toString();
    var saldonormaltemp = $('#saldonormal').val().toString();
    var useridupdate = $("#id").val();
    db.transaction(function(tx) {
        tx.executeSql(updateStatement, [koderekeningupdate, namarekeningupdate, jenisrekeningtemp, saldonormaltemp, Number(useridupdate)], loadAndReset, onError);
    });
}

function dropTable() // Function Call when Drop Button Click.. Talbe will be dropped from database.
{
	  swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function(isConfirm) {
      if (isConfirm) {
        swal({
          title: 'Shortlisted!',
          text: 'Tabel telah Dikosongkan.',
          icon: 'success'
        }).then(function() {
			db.transaction(function(tx) {
				tx.executeSql(dropStatement, [], showRecords, onError);
			});
			resetForm();
			initDatabase(); 
        });
      } else {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    })

}

function loadRecord(i) // Function for display records which are retrived from database.
{
    var item = dataset.item(i);
    $("#koderekening").val((item['koderekening']).toString());
    $("#namarekening").val((item['namarekening']).toString());
    $("#jenisrekening").val((item['jenisrekening']).toString());
    $("#saldonormal").val((item['saldonormal']).toString());
    $("#id").val((item['id']).toString());
}

function resetForm() // Function for reset form input values.
{
    $("#koderekening").val("");
    $("#namarekening").val("");
    $("#id").val("");
}

function loadAndReset() //Function for Load and Reset...
{
    resetForm();
    showRecords()
}

function onError(tx, error) // Function for Hendeling Error...
{
    alert(error.message);
}


function showRecords() // Function For Retrive data from Database Display records as list
{
    $("#results").html('')
    db.transaction(function(tx) {
        tx.executeSql(selectAllStatement, [], function(tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var linkeditdelete = '<li>' + item['koderekening'] + ' , ' + item['namarekening'] + '    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' + '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                $("#results").append(linkeditdelete);
            }
        });
    });
}


function uploadrekening(){
	    db.transaction(function(tx) {
        tx.executeSql(selectAllStatement, [], function(tx, result) {
            dataset = result.rows;
			var myJsonString = JSON.stringify(dataset);
			console.log(myJsonString);
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var linkeditdelete = '<li>' + item['koderekening'] + ' , ' + item['namarekening'] + '    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' + '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                //$("#results").append(linkeditdelete);
            }
        });
    });
	
}

$(document).ready(function() // Call function when page is ready for load..
    {
        ;
        $("body").fadeIn(2000); // Fede In Effect when Page Load..
        initDatabase();
        $("#submitButton").click(insertRecord); // Register Event Listener when button click.
        $("#btnUpdate").click(updateRecord);
        $("#btnReset").click(resetForm);
        $("#btnDrop").click(dropTable);
        $("#uploadrekening").click(uploadrekening);
    });