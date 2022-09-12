<?php
require_once('connect_db.php');

if(
    isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    $_SERVER['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest" && 
    $_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['addSupplier'])
){
    $name = $_POST['name'];
    $cost = $_POST['cost'];
    $grade = $_POST['grade'];
    $measurementTall = $_POST['measurementTall'];
    $measurementWidth = $_POST['measurementWidth'];
    $measurementLength = $_POST['measurementLength'];
    $weight = $_POST['weight'];
    $UOM = $_POST['UOM'];

    if(array_key_exists('cert', $_FILES)){
        $target_dir = "C:/xampp/htdocs/AIFlowsAssignment/uploads/";
        $target_file = $target_dir . basename($_FILES["cert"]["name"]);
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        // Check if file already exists
        if (file_exists($target_file)) {
            echo "Sorry, file already exists.";
            $uploadOk = 0;
        }

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
        } else {
            if (move_uploaded_file($_FILES["cert"]["tmp_name"], $target_file)) {
                $sql = "INSERT INTO supplier (name, cost, grade, measurementTall, measurementWidth, measurementLength, weight, UOM, cert)
                VALUES ('$name', '$cost', '$grade', '$measurementTall', '$measurementWidth', '$measurementLength', '$weight', '$UOM', '$target_file')
                ";

                mysqli_query($conn, $sql);
                mysqli_close($conn);

                echo json_encode('success - upload file');
            } else {
                echo json_encode('File not uploaded, saving record failed');
            }
        } 
    }else{
        $sql = "INSERT INTO supplier (name, cost, grade, measurementTall, measurementWidth, measurementLength, weight, UOM, cert)
        VALUES ('$name', '$cost', '$grade', '$measurementTall', '$measurementWidth', '$measurementLength', '$weight', '$UOM', '')
        ";

        mysqli_query($conn, $sql);
        mysqli_close($conn);

        echo json_encode('success');
    }
    
}

if(
    isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    $_SERVER['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest" && 
    $_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['editSupplier'])
){
    $id = $_POST['id'];
    $name = $_POST['name'];
    $cost = $_POST['cost'];
    $grade = $_POST['grade'];
    $measurementTall = $_POST['measurementTall'];
    $measurementWidth = $_POST['measurementWidth'];
    $measurementLength = $_POST['measurementLength'];
    $weight = $_POST['weight'];
    $UOM = $_POST['UOM'];

    if(array_key_exists('cert', $_FILES)){
        $target_dir = "C:/xampp/htdocs/AIFlowsAssignment/uploads/";
        $target_file = $target_dir . basename($_FILES["cert"]["name"]);
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        // Check if file already exists
        if (file_exists($target_file)) {
            echo "Sorry, file already exists.";
            $uploadOk = 0;
        }

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
        } else {
            if (move_uploaded_file($_FILES["cert"]["tmp_name"], $target_file)) {
                $sql = "UPDATE supplier SET name='$name', cost='$cost', grade='$grade', measurementTall = '$measurementTall', measurementWidth = '$measurementWidth', measurementLength = '$measurementLength', weight = '$weight', UOM = '$UOM', cert = '$target_file'
                WHERE id = '$id'
                ";
                mysqli_query($conn, $sql);
                mysqli_close($conn);

                echo json_encode('success');
            } else {
                echo json_encode('File not uploaded, saving record failed');
            }
        } 
    }else{
        $sql = "UPDATE supplier SET name='$name', cost='$cost', grade='$grade', measurementTall = '$measurementTall', measurementWidth = '$measurementWidth', measurementLength = '$measurementLength', weight = '$weight', UOM = '$UOM'
        WHERE id = '$id'
        ";

        mysqli_query($conn, $sql);
        mysqli_close($conn);

        echo json_encode('success');
    }
    
}

if(
    isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    $_SERVER['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest" && 
    $_SERVER['REQUEST_METHOD'] == "GET" 
){
    $data = [];
    $sql = "SELECT * FROM supplier";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0){
        while($row = mysqli_fetch_assoc($result)){
            $dataMap = Array(
                'id' => $row['id'],
                'name' => $row['name'],
                'cost' => $row['cost'],
                'grade' => $row['grade'],
                'measurementTall' => $row['measurementTall'],
                'measurementWidth' => $row['measurementWidth'],
                'measurementLength' => $row['measurementLength'],
                'weight' => $row['weight'],
                'UOM' => $row['UOM'],
                'cert' => $row['cert']
            );
            array_push($data, $dataMap);
        }
    }

    echo json_encode($data);
}
?>