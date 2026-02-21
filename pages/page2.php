<?php
header('Content-Type: application/json; charset=utf-8');
<?php
$con= mysqli_connect("localhost","violet_user","VioletStore2026Secure123","amirSiteDb");
mysqli_set_charset($con,"utf8mb4");
if($_POST["mode"]=="select"){
	if($_POST["id"]==""){
		if($_POST["gender"]=="")
       $r=mysqli_query($con,"select * from t1 where name like '%{$_POST["name"]}%' and case_ like '%{$_POST["case_"]}%' and strap like '%{$_POST["strap"]}%' and glasp like '%{$_POST["glasp"]}%'");
	   else
	   $r=mysqli_query($con,"select * from t1 where name like '%{$_POST["name"]}%' and case_ like '%{$_POST["case_"]}%' and strap like '%{$_POST["strap"]}%' and glasp like '%{$_POST["glasp"]}%' and gender= '{$_POST["gender"]}' ");
	}

	else{
		$r=mysqli_query($con,"select * from t1 where id={$_POST["id"]} ");
	}
	
$i=0;
while($row=mysqli_fetch_object($r)){
    $ar[$i++]=$row;
}
	if($i>=1){
	$p=0;
	for($j=($_POST["page"]*6)-6;$j<$_POST["page"]*6;$j++){
		if(isset($ar[$j]))
		  $ar2[$p++]=$ar[$j];
	}
	$ar2[$p]=["pages"=>count($ar)/6];
    $myJSON = json_encode($ar2, JSON_UNESCAPED_UNICODE);
	echo($myJSON);
	}
	else{
	echo(0);
	}
	
	
}
else if($_POST["mode"]=="insert"){
	
	$r=mysqli_query($con,"insert into t1 (name,case_,strap,glasp,picUrl,gender) values ('{$_POST["name"]}','{$_POST["case_"]}','{$_POST["strap"]}','{$_POST["glasp"]}','{$_POST["picUrl"]}','{$_POST["gender"]}')");
	$r=mysqli_query($con,"select * from t1 where name='{$_POST['name']}' and case_ ='{$_POST['case_']}' and glasp='{$_POST['glasp']}' and gender='{$_POST['gender']}'");
	$row=mysqli_fetch_row( $r);
	if($row==null)
		print("failed");
	else
       {
	    print("success");
		move_uploaded_file($_FILES["pic"]["tmp_name"],"../pictures/products/".$_POST["name"].$_FILES["pic"]["name"]);
		$r=mysqli_query($con,"update t1 set picUrl='pictures/products/".$_POST["name"].$_FILES["pic"]["name"]."' where id=".$row[0]);
	   }
}
else if($_POST["mode"]=="delete"){
	$r=mysqli_query($con,"delete from t1 where id={$_POST['id']}");
	$r=mysqli_query($con,"select * from t1 where id={$_POST['id']}");
	if(mysqli_fetch_row( $r)==null){
	    unlink("../".$_POST["picUrl"]);
		//var_dump($_POST);
		print("success");
	}
	else
	    print("failed");
}
else if($_POST["mode"]=="update"){
	$r=mysqli_query($con,"update t1 set name='{$_POST["name"]}',case_='{$_POST["case_"]}',strap='{$_POST["strap"]}',glasp='{$_POST["glasp"]}',picUrl='{$_POST["picUrl"]}',gender='{$_POST["gender"]}' where id={$_POST["id"]}");
	$r=mysqli_query($con,"select * from t1 where name='{$_POST['name']}' and case_ ='{$_POST['case_']}' and glasp='{$_POST['glasp']}' and gender='{$_POST['gender']}'");
	$row=mysqli_fetch_row( $r);
	if($row==null)
		print("failed");
	else
       {
	    print("success");
		move_uploaded_file($_FILES["pic"]["tmp_name"],"../pictures/products/".$_POST["name"].$_FILES["pic"]["name"]);
		$r=mysqli_query($con,"update t1 set picUrl='pictures/products/".$_POST["name"].$_FILES["pic"]["name"]."' where id=".$row[0]);
	   }
}

else if($_POST["mode"]=="login"){
	
	$r=mysqli_query($con,"select * from admin where username = '{$_POST["id"]}' and password= '{$_POST["name"]}' ");
	if($r->num_rows==0)
	   echo("0");
	else
	   echo("1");   
	
}
else if($_POST["mode"]=="changePass"){
	if($_POST["newPass"]!=$_POST["repeatedPass"])
	die("کلمه عبور با تکرار یکی نمی باشد");

	$r=mysqli_query($con,"select * from admin");
	$row=mysqli_fetch_row($r);
	if($row[1]!=$_POST["oldPass"])
	die("کلمه عبور فعلی صحیح نمی باشد");

	$r=mysqli_query($con,"update admin set password='{$_POST["newPass"]}'");
	$r=mysqli_query($con,"select * from admin where password='{$_POST["newPass"]}'");
	$row=mysqli_fetch_row( $r);
	if($row==null)
		print("عملیات با شکست مواجه شد");
	else
       {
	    print("عملیات موفقیت امیز بود");
		
	   }
}

?>