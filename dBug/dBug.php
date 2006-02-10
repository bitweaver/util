<?php
error_reporting(E_ALL);

/*********************************************************************************************************************\
 *
 * AUTHOR
 * =============
 * Kwaku Otchere 
 * ospinto@hotmail.com
 * 
 * Thanks to Andrew Hewitt (rudebwoy@hotmail.com) for the idea and suggestion
 * 
 * All the credit goes to ColdFusion's brilliant cfdump tag
 * Hope the next version of PHP can implement this or have something similar
 * I love PHP, but var_dump BLOWS!!!
 *
 * FOR DOCUMENTATION AND MORE EXAMPLES: VISIT http://dbug.ospinto.com
 *
 *
 * PURPOSE
 * =============
 * Dumps/Displays the contents of a variable in a colored tabular format
 * Based on the idea, javascript and css code of Macromedia's ColdFusion cfdump tag
 * A much better presentation of a variable's contents than PHP's var_dump and print_r functions
 *
 *
 * USAGE
 * =============
 * new dBug ( variable [,forceType] );
 * example:
 * new dBug ( $myVariable );
 *
 * 
 * if the optional "forceType" string is given, the variable supplied to the 
 * function is forced to have that forceType type. 
 * example: new dBug( $myVariable , "array" );
 * will force $myVariable to be treated and dumped as an array type, 
 * even though it might originally have been a string type, etc.
 *
 * NOTE!
 * ==============
 * forceType is REQUIRED for dumping an xml string or xml file
 * new dBug ( $strXml, "xml" );
 * 
\*********************************************************************************************************************/
?>
<script language="JavaScript">
/* code modified from ColdFusion's cfdump code */
	function dBug_toggleRow(source) {
		target=(document.all) ? source.parentElement.cells[1] : source.parentNode.lastChild
		dBug_toggleTarget(target,dBug_toggleSource(source));
	}
	
	function dBug_toggleSource(source) {
		if (source.style.fontStyle=='italic') {
			source.style.fontStyle='normal';
			source.title='click to collapse';
			return 'open';
		} else {
			source.style.fontStyle='italic';
			source.title='click to expand';
			return 'closed';
		}
	}

	function dBug_toggleTarget(target,switchToState) {
		target.style.display=(switchToState=='open') ? '' : 'none';
	}

	function dBug_toggleTable(source) {
		var switchToState=dBug_toggleSource(source);
		if(document.all) {
			var table=source.parentElement.parentElement;
			for(var i=1;i<table.rows.length;i++) {
				target=table.rows[i];
				dBug_toggleTarget(target,switchToState);
			}
		}
		else {
			var table=source.parentNode.parentNode;
			for (var i=1;i<table.childNodes.length;i++) {
				target=table.childNodes[i];
				if(target.style) {
					dBug_toggleTarget(target,switchToState);
				}
			}
		}
	}
</script>

<style type="text/css">
	table.dBug_array,table.dBug_object,table.dBug_resource,table.dBug_resourceC,table.dBug_xml {
		font-family:Verdana, Arial, Helvetica, sans-serif; color:#000000; font-size:12px;
	}
	
	.dBug_arrayHeader,
	.dBug_objectHeader,
	.dBug_resourceHeader,
	.dBug_resourceCHeader,
	.dBug_xmlHeader 
		{ font-weight:bold; color:#FFFFFF; }
	
	/* array */
	table.dBug_array { background-color:#006600; }
	table.dBug_array td { background-color:#FFFFFF; }
	table.dBug_array td.dBug_arrayHeader { background-color:#009900; }
	table.dBug_array td.dBug_arrayKey { background-color:#CCFFCC; }
	
	/* object */
	table.dBug_object { background-color:#0000CC; }
	table.dBug_object td { background-color:#FFFFFF; }
	table.dBug_object td.dBug_objectHeader { background-color:#4444CC; }
	table.dBug_object td.dBug_objectKey { background-color:#CCDDFF; }
	
	/* resource */
	table.dBug_resourceC { background-color:#884488; }
	table.dBug_resourceC td { background-color:#FFFFFF; }
	table.dBug_resourceC td.dBug_resourceCHeader { background-color:#AA66AA; }
	table.dBug_resourceC td.dBug_resourceCKey { background-color:#FFDDFF; }
	
	/* resource */
	table.dBug_resource { background-color:#884488; }
	table.dBug_resource td { background-color:#FFFFFF; }
	table.dBug_resource td.dBug_resourceHeader { background-color:#AA66AA; }
	table.dBug_resource td.dBug_resourceKey { background-color:#FFDDFF; }
	
	/* xml */
	table.dBug_xml { background-color:#888888; }
	table.dBug_xml td { background-color:#FFFFFF; }
	table.dBug_xml td.dBug_xmlHeader { background-color:#AAAAAA; }
	table.dBug_xml td.dBug_xmlKey { background-color:#DDDDDD; }
</style>

<?php
class dBug {
	
	var $xmlDepth=array();
	var $xmlCData;
	var $xmlSData;
	var $xmlDData;
	var $xmlCount=0;
	var $xmlAttrib;
	var $xmlName;
	var $arrType=array("array","object","resource","boolean");
	
	//constructor
	function dBug($var,$forceType="") {
		$arrAccept=array("array","object","xml"); //array of variable types that can be "forced"
		if(in_array($forceType,$arrAccept))
			$this->{"varIs".ucfirst($forceType)}($var);
		else
			$this->checkType($var);
	}
	
	//create the main table header
	function makeTableHeader($type,$header,$colspan=2) {
		echo "<table cellspacing=2 cellpadding=3 class=\"dBug_".$type."\">
				<tr>
					<td class=\"dBug_".$type."Header\" colspan=".$colspan." style=\"cursor:hand\" onClick='dBug_toggleTable(this)'>".$header."</td>
				</tr>";
	}
	
	//create the table row header
	function makeTDHeader($type,$header) {
		echo "<tr>
				<td valign=\"top\" onClick='dBug_toggleRow(this)' style=\"cursor:hand\" class=\"dBug_".$type."Key\">".$header."</td>
				<td>";
	}
	
	//close table row
	function closeTDRow() {
		return "</td>\n</tr>\n";
	}
	
	//error
	function  error($type) {
		$error="Error: Variable is not a";
		//thought it would be nice to place in some nice grammar techniques :)
		// this just checks if the type starts with a vowel or "x" and displays either "a" or "an"
		if(in_array(substr($type,0,1),array("a","e","i","o","u","x")))
			$error.="n";
		return ($error." ".$type." type");
	}

	//check variable type
	function checkType($var) {
		switch(gettype($var)) {
			case "resource":
				$this->varIsResource($var);
				break;
			case "object":
				$this->varIsObject($var);
				break;
			case "array":
				$this->varIsArray($var);
				break;
			case "boolean":
				$this->varIsBoolean($var);
				break;
			default:
				$var=($var=="") ? "[empty string]" : $var;
				echo "<table cellspacing=0><tr>\n<td>".$var."</td>\n</tr>\n</table>\n";
				break;
		}
	}
	
	//if variable is a boolean type
	function varIsBoolean($var) {
		$var=($var==1) ? "TRUE" : "FALSE";
		echo $var;
	}
			
	//if variable is an array type
	function varIsArray($var) {
		$this->makeTableHeader("array","array");
		if(is_array($var)) {
			foreach($var as $key=>$value) {
				$this->makeTDHeader("array",$key);
				if(in_array(gettype($value),$this->arrType))
					$this->checkType($value);
				else {
					$value=(trim($value)=="") ? "[empty string]" : $value;
					echo $value."</td>\n</tr>\n";
				}
			}
		}
		else echo "<tr><td>".$this->error("array").$this->closeTDRow();
		echo "</table>";
	}
	
	//if variable is an object type
	function varIsObject($var) {
		$this->makeTableHeader("object","object");
		$arrObjVars=get_object_vars($var);
		if(is_object($var)) {
			foreach($arrObjVars as $key=>$value) {
				$value=(trim($value)=="") ? "[empty string]" : $value;
				$this->makeTDHeader("object",$key);
				if(in_array(gettype($value),$this->arrType))
					$this->checkType($value);
				else echo $value.$this->closeTDRow();
			}
			$arrObjMethods=get_class_methods(get_class($var));
			foreach($arrObjMethods as $key=>$value) {
				$this->makeTDHeader("object",$value);
				echo "[function]".$this->closeTDRow();
			}
		}
		else echo "<tr><td>".$this->error("object").$this->closeTDRow();
		echo "</table>";
	}

	//if variable is a resource type
	function varIsResource($var) {
		$this->makeTableHeader("resourceC","resource",1);
		echo "<tr>\n<td>\n";
		switch(get_resource_type($var)) {
			case "fbsql result":
			case "mssql result":
			case "msql query":
			case "pgsql result":
			case "sybase-db result":
			case "sybase-ct result":
			case "mysql result":
				$db=current(explode(" ",get_resource_type($var)));
				$this->varIsDBResource($var,$db);
				break;
			case "gd":
				$this->varIsGDResource($var);
				break;
			case "xml":
				$this->varIsXmlResource($var);
				break;
			default:
				echo get_resource_type($var).$this->closeTDRow();
				break;
		}
		echo $this->closeTDRow()."</table>\n";
	}
	
	//if variable is an xml type
	function varIsXml($var) {
		$this->varIsXmlResource($var);
	}
	
	//if variable is an xml resource type
	function varIsXmlResource($var) {
		$xml_parser=xml_parser_create();
		xml_parser_set_option($xml_parser,XML_OPTION_CASE_FOLDING,0); 
		xml_set_element_handler($xml_parser,array(&$this,"xmlStartElement"),array(&$this,"xmlEndElement")); 
		xml_set_character_data_handler($xml_parser,array(&$this,"xmlCharacterData"));
		xml_set_default_handler($xml_parser,array(&$this,"xmlDefaultHandler")); 
		
		$this->makeTableHeader("xml","xml document",2);
		$this->makeTDHeader("xml","xmlRoot");
		
		//attempt to open xml file
		$bFile=(!($fp=@fopen($var,"r"))) ? false : true;
		
		//read xml file
		if($bFile) {
			while($data=str_replace("\n","",fread($fp,4096)))
				$this->xmlParse($xml_parser,$data,feof($fp));
		}
		//if xml is not a file, attempt to read it as a string
		else {
			if(!is_string($var)) {
				echo $this->error("xml").$this->closeTDRow()."</table>\n";
				return;
			}
			$data=$var;
			$this->xmlParse($xml_parser,$data,1);
		}
		
		echo $this->closeTDRow()."</table>\n";
		
	}
	
	//parse xml
	function xmlParse($xml_parser,$data,$bFinal) {
		if (!xml_parse($xml_parser,$data,$bFinal)) { 
				   die(sprintf("XML error: %s at line %d\n", 
							   xml_error_string(xml_get_error_code($xml_parser)), 
							   xml_get_current_line_number($xml_parser)));
		}
	}
	
	//xml: inititiated when a start tag is encountered
	function xmlStartElement($parser,$name,$attribs) {
		$this->xmlAttrib[$this->xmlCount]=$attribs;
		$this->xmlName[$this->xmlCount]=$name;
		$this->xmlSData[$this->xmlCount]='$this->makeTableHeader("xml","xml element",2);';
		$this->xmlSData[$this->xmlCount].='$this->makeTDHeader("xml","xmlName");';
		$this->xmlSData[$this->xmlCount].='echo "<strong>'.$this->xmlName[$this->xmlCount].'</strong>".$this->closeTDRow();';
		$this->xmlSData[$this->xmlCount].='$this->makeTDHeader("xml","xmlAttributes");';
		if(count($attribs)>0)
			$this->xmlSData[$this->xmlCount].='$this->varIsArray($this->xmlAttrib['.$this->xmlCount.']);';
		else
			$this->xmlSData[$this->xmlCount].='echo "&nbsp;";';
		$this->xmlSData[$this->xmlCount].='echo $this->closeTDRow();';
		$this->xmlCount++;
	} 
	
	//xml: initiated when an end tag is encountered
	function xmlEndElement($parser,$name) {
		for($i=0;$i<$this->xmlCount;$i++) {
			eval($this->xmlSData[$i]);
			$this->makeTDHeader("xml","xmlText");
			echo (!empty($this->xmlCData[$i])) ? $this->xmlCData[$i] : "&nbsp;";
			echo $this->closeTDRow();
			$this->makeTDHeader("xml","xmlComment");
			echo (!empty($this->xmlDData[$i])) ? $this->xmlDData[$i] : "&nbsp;";
			echo $this->closeTDRow();
			$this->makeTDHeader("xml","xmlChildren");
			unset($this->xmlCData[$i],$this->xmlDData[$i]);
		}
		echo $this->closeTDRow();
		echo "</table>";
		$this->xmlCount=0;
	} 
	
	//xml: initiated when text between tags is encountered
	function xmlCharacterData($parser,$data) {
		$count=$this->xmlCount-1;
		if(!empty($this->xmlCData[$count]))
			$this->xmlCData[$count].=$data;
		else
			$this->xmlCData[$count]=$data;
	} 
	
	//xml: initiated when a comment or other miscellaneous texts is encountered
	function xmlDefaultHandler($parser,$data) {
		//strip '<!--' and '-->' off comments
		$data=str_replace(array("&lt;!--","--&gt;"),"",htmlspecialchars($data));
		$count=$this->xmlCount-1;
		if(!empty($this->xmlDData[$count]))
			$this->xmlDData[$count].=$data;
		else
			$this->xmlDData[$count]=$data;
	}
	
	//if variable is a database resource type
	function varIsDBResource($var,$db="mysql") {
		$numrows=call_user_func($db."_num_rows",$var);
		$numfields=call_user_func($db."_num_fields",$var);
		$this->makeTableHeader("resource",$db." result",$numfields+1);
		echo "<tr><td class=\"dBug_resourceKey\">&nbsp;</td>";
		for($i=0;$i<$numfields;$i++) {
			$field[$i]=call_user_func($db."_fetch_field",$var,$i);
			echo "<td class=\"dBug_resourceKey\">".$field[$i]->name."</td>";
		}
		echo "</tr>";
		for($i=0;$i<$numrows;$i++) {
			$row=call_user_func($db."_fetch_array",$var,constant(strtoupper($db)."_ASSOC"));
			echo "<tr>\n";
			echo "<td class=\"dBug_resourceKey\">".($i+1)."</td>"; 
			for($k=0;$k<$numfields;$k++) {
				$tempField=$field[$k]->name;
				$fieldrow=$row[($field[$k]->name)];
				$fieldrow=($fieldrow=="") ? "[empty string]" : $fieldrow;
				echo "<td>".$fieldrow."</td>\n";
			}
			echo "</tr>\n";
		}
		echo "</table>";
		if($numrows>0)
			call_user_func($db."_data_seek",$var,0);
	}
	
	//if variable is an image/gd resource type
	function varIsGDResource($var) {
		$this->makeTableHeader("resource","gd",2);
		$this->makeTDHeader("resource","Width");
		echo imagesx($var).$this->closeTDRow();
		$this->makeTDHeader("resource","Height");
		echo imagesy($var).$this->closeTDRow();
		$this->makeTDHeader("resource","Colors");
		echo imagecolorstotal($var).$this->closeTDRow();
		echo "</table>";
	}
}
?>