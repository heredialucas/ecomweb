<?php 
class CResp {}
//resultado es un json: 
/*
Respuesta {
	Inicio: TimeStamp	//Inicio del pedido
	Script: 1			//Validez del script subido por ftp
	ConexionDB: 1		//Validez de conexion a DB
	Ejecucion: 1		//Ejecución de script sql
	Fin: TimeStamp
}
*/
$resp= new CResp();
$resp->Inicio= date('Ymd G:i:s');
$resp->Script=0;
$resp->ConexionDB=0;
$resp->Ejecucion=0;
$resp->Fin="";
$resp->Error="";
try {
	//echo (new \DateTime())->format('Y-m-d H:i:s');
	//echo '<br>';
	//echo 'Abriendo Novedades.sql... ';
	$sentSql= file_get_contents('/home/lblmtol/public_html/Sincro/Sincro.sql', FALSE);
	if($sentSql) {
		$resp->Script= 1;
		//echo '<br>';
		//echo 'Conectando a DB... ';
		$mysqli = new mysqli("localhost", "ecomweb", "Sumate.al.Exito.1994", "ecomweb_Data");
		/* ejecutar multi consulta */
		if ($mysqli) {
		//if ($mysqli->connect_errno) {
			//echo 'OK<br>';
			//echo 'Ejecutando script sql... ';
			$resp->ConexionDB= 1;
			if ($mysqli->multi_query($sentSql)) {
				do {
					/* almacenar primer juego de resultados */
					/*
					if ($result = $mysqli->store_result()) {
						while ($row = $result->fetch_row()) {
							printf("%s\n", $row[0]);
						}
						$result->free();
					}
					*/
					/* mostrar divisor */
					/*
					if ($mysqli->more_results()) {
						printf("-----------------\n");
					}
					*/
				} while ($mysqli->next_result());
				//echo 'Ok<br>';
				$resp->Ejecucion= 1;
			} else {
				//echo 'Error!<br>';
				//echo $mysqli->error .'<br>';
				$resp->Error= $mysqli->error;
			}
		} else {
			//echo 'Error!<br>';
			//echo $mysqli->connect_error .'<br>';
			//echo $mysqli->error .'<br>';
			$resp->Error= $mysqli->connect_error;
		}
		/* cerrar conexión */
		$mysqli->close();
		//echo 'OK<br>';
	}
} catch (Exception $e) {
	//echo 'Caught exception: ' .$e->getMessage() ."\n";
	//echo 'Error<br>';
	$resp->Error= $e->getMessage();
} finally {
	$resp->Fin= date('Ymd G:i:s');
}
echo json_encode($resp);
?>