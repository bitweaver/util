<?php
//
// +---------------------------------------------------------------------------+
// | PEAR :: Image :: GraphViz                                                 |
// +---------------------------------------------------------------------------+
// | Copyright (c) 2002-2005 Sebastian Bergmann <sb@sebastian-bergmann.de> and |
// |                         Dr. Volker G�bbels <vmg@arachnion.de>.            |
// +---------------------------------------------------------------------------+
// | This source file is subject to version 3.00 of the PHP License,           |
// | that is available at http://www.php.net/license/3_0.txt.                  |
// | If you did not receive a copy of the PHP license and are unable to        |
// | obtain it through the world-wide-web, please send a note to               |
// | license@php.net so we can mail you a copy immediately.                    |
// +---------------------------------------------------------------------------+
//
// $Id: GraphViz.php,v 1.4 2006/02/03 13:48:22 lsces Exp $
//

//require_once 'System.php';
// Only used to generate temporary file name - changed to tempnam( TEMP_PKG_PATH.GraphViz.'/', 

/**
 * Interface to AT&T's GraphViz tools.
 *
 * The GraphViz class allows for the creation of and the work with directed
 * and undirected graphs and their visualization with AT&T's GraphViz tools.
 *
 * <code>
 * <?php
 * require_once 'Image/GraphViz.php';
 *
 * $graph = new Image_GraphViz();
 *
 * $graph->addNode(
 *   'Node1',
 *   array(
 *     'URL'   => 'http://link1',
 *     'label' => 'This is a label',
 *     'shape' => 'box'
 *   )
 * );
 *
 * $graph->addNode(
 *   'Node2',
 *   array(
 *     'URL'      => 'http://link2',
 *     'fontsize' => '14'
 *   )
 * );
 *
 * $graph->addNode(
 *   'Node3',
 *   array(
 *     'URL'      => 'http://link3',
 *     'fontsize' => '20'
 *   )
 * );
 *
 * $graph->addEdge(
 *   array(
 *     'Node1' => 'Node2'
 *   ),
 *   array(
 *     'label' => 'Edge Label'
 *   )
 * );
 *
 * $graph->addEdge(
 *   array(
 *     'Node1' => 'Node2'
 *   ),
 *   array(
 *     'color' => 'red'
 *   )
 * );
 *
 * $graph->image();
 * ?>
 * </code>
 *
 * @author    Sebastian Bergmann <sb@sebastian-bergmann.de>
 * @author    Dr. Volker G�bbels <vmg@arachnion.de>
 * @author    Karsten Dambekalns <k.dambekalns@fishfarm.de>
 * @copyright Copyright &copy; 2002-2005 Sebastian Bergmann <sb@sebastian-bergmann.de> and Dr. Volker G�bbels <vmg@arachnion.de>
 * @license   http://www.php.net/license/3_0.txt The PHP License, Version 3.0
 * @category  Image
 * @package   Image_GraphViz
 */
class Image_GraphViz {
    /**
    * Path to GraphViz/dot command
    *
    * @var  string
    */
    var $dotCommand = 'dot';

    /**
    * Path to GraphViz/neato command
    *
    * @var  string
    */
    var $neatoCommand = 'neato';

    /**
    * Representation of the graph
    *
    * @var  array
    */
    var $graph;

    /**
    * Constructor.
    *
    * Setting the name of the Graph is useful for including multiple image maps on
    * one page. If not set, the graph will be named 'G'.
    *
    * @param  boolean $directed Directed (TRUE) or undirected (FALSE) graph.
    * @param  array   $attributes Attributes of the graph
    * @param  string  $name Name of the Graph
    * @access public
    */
    function Image_GraphViz($directed = TRUE, $attributes = array(), $name = NULL) {
        $this->setDirected($directed);
        $this->setAttributes($attributes);
        $this->graph['name'] = $name;
    }

    /**
    * Output image of the graph in a given format.
    *
    * @param  string  Format of the output image.
    *                 This may be one of the formats supported by GraphViz.
    * @access public
    */
    function image($format = 'svg') {
        if ($data = $this->fetch($format)) {
            $sendContentLengthHeader = TRUE;

            switch ($format) {
                case 'gif':
                case 'png':
                case 'wbmp': {
                    header('Content-Type: image/' . $format);
                }
                break;

                case 'jpg': {
                    header('Content-Type: image/jpeg');
                }
                break;

                case 'pdf': {
                    header('Content-Type: application/pdf');
                }
                break;

                case 'svg': {
                    header('Content-Type: image/svg+xml');
                }
                break;

                default: {
                    $sendContentLengthHeader = FALSE;
                }
            }

            if ($sendContentLengthHeader) {
                header('Content-Length: ' . strlen($data));
            }

            echo $data;
        }
    }

    /**
    * Return image (data) of the graph in a given format.
    *
    * @param  string  Format of the output image.
    *                 This may be one of the formats supported by GraphViz.
    * @return string  The image (data) created by GraphViz.
    * @access public
    * @since  1.1.0
    */
    function fetch($format = 'svg') {
        if ($file = $this->saveParsedGraph()) {
            $outputfile = $file . '.' . $format;
            $command  = $this->graph['directed'] ? $this->dotCommand : $this->neatoCommand;
            $command .= " -T$format -o$outputfile $file";
    
            @`$command`;
            @unlink($file);
    
            $fp = fopen($outputfile, 'rb');
    
            if ($fp) {
                $data = fread($fp, filesize($outputfile));
                fclose($fp);
                @unlink($outputfile);
            }
    
            return $data;
        }
    
        return FALSE;
    }

    /**
    * Add a cluster to the graph.
    *
    * @param  string  ID.
    * @param  array   Title.
    * @param  array   Attributes of the cluster.
    * @access public
    */
    function addCluster($id, $title, $attributes = array()) {
        $this->graph['clusters'][$id]['title'] = $title;
        $this->graph['clusters'][$id]['attributes'] = $attributes;
    }

    /**
    * Add a note to the graph.
    *
    * @param  string  Name of the node.
    * @param  array   Attributes of the node.
    * @param  string  Group of the node.
    * @access public
    */
    function addNode($name, $attributes = array(), $group = 'default') {
        $this->graph['nodes'][$group][$name] = $attributes;
    }

    /**
    * Remove a node from the graph.
    *
    * @param  Name of the node to be removed.
    * @access public
    */
    function removeNode($name, $group = 'default') {
        if (isset($this->graph['nodes'][$group][$name])) {
            unset($this->graph['nodes'][$group][$name]);
        }
    }

    /**
    * Add an edge to the graph.
    *
    * Caveat! This cannot handle multiple identical edges. If you use non-numeric
    * IDs for the nodes, this will not do (too much) harm. For numeric IDs the
    * array_merge() that is used will change the keys when merging arrays, leading
    * to new nodes appearing in the graph.
    *
    * @param  array Start and End node of the edge.
    * @param  array Attributes of the edge.
    * @access public
    */
    function addEdge($edge, $attributes = array()) {
        if (is_array($edge)) {
            $from = key($edge);
            $to   = $edge[$from];
            $id   = $from . '_' . $to;

            if (!isset($this->graph['edges'][$id])) {
                $this->graph['edges'][$id] = $edge;
            } else {
                $this->graph['edges'][$id] = array_merge(
                  $this->graph['edges'][$id],
                  $edge
                );
            }

            if (is_array($attributes)) {
                if (!isset($this->graph['edgeAttributes'][$id])) {
                    $this->graph['edgeAttributes'][$id] = $attributes;
                } else {
                    $this->graph['edgeAttributes'][$id] = array_merge(
                      $this->graph['edgeAttributes'][$id],
                      $attributes
                    );
                }
            }
        }
    }

    /**
    * Remove an edge from the graph.
    *
    * @param  array Start and End node of the edge to be removed.
    * @access public
    */
    function removeEdge($edge) {
        if (is_array($edge)) {
              $from = key($edge);
              $to   = $edge[$from];
              $id   = $from . '_' . $to;

            if (isset($this->graph['edges'][$id])) {
                unset($this->graph['edges'][$id]);
            }

            if (isset($this->graph['edgeAttributes'][$id])) {
                unset($this->graph['edgeAttributes'][$id]);
            }
        }
    }

    /**
    * Add attributes to the graph.
    *
    * @param  array Attributes to be added to the graph.
    * @access public
    */
    function addAttributes($attributes) {
        if (is_array($attributes)) {
            $this->graph['attributes'] = array_merge(
              $this->graph['attributes'],
              $attributes
            );
        }
    }

    /**
    * Set attributes of the graph.
    *
    * @param  array Attributes to be set for the graph.
    * @access public
    */
    function setAttributes($attributes) {
        if (is_array($attributes)) {
            $this->graph['attributes'] = $attributes;
        }
    }

    /**
    * Set directed/undirected flag for the graph.
    *
    * @param  boolean Directed (TRUE) or undirected (FALSE) graph.
    * @access public
    */
    function setDirected($directed) {
        if (is_bool($directed)) {
            $this->graph['directed'] = $directed;
        }
    }

    /**
    * Load graph from file.
    *
    * @param  string  File to load graph from.
    * @access public
    */
    function load($file) {
        if ($serialized_graph = implode('', @file($file))) {
            $this->graph = unserialize($serialized_graph);
        }
    }

    /**
    * Save graph to file.
    *
    * @param  string  File to save the graph to.
    * @return mixed   File the graph was saved to, FALSE on failure.
    * @access public
    */
    function save($file = '') {
        $serialized_graph = serialize($this->graph);

        if (empty($file)) {
            $file = tempnam( TEMP_PKG_PATH.GraphViz.'/', 'graph_');
        }

        if ($fp = @fopen($file, 'w')) {
            @fputs($fp, $serialized_graph);
            @fclose($fp);

            return $file;
        }

        return FALSE;
    }

    /**
    * Parse the graph into GraphViz markup.
    *
    * @return string  GraphViz markup
    * @access public
    */
    function parse() {
        if (isset($this->graph['name']) && is_string($this->graph['name'])) {
            $parsedGraph = "digraph " . $this->graph['name'] . " {\n";
        } else {
            $parsedGraph = "digraph G {\n";
        }

        if (isset($this->graph['attributes'])) {
            foreach ($this->graph['attributes'] as $key => $value) {
                $attributeList[] = $key . '="' . $value . '"';
            }

            if (!empty($attributeList)) {
                $parsedGraph .= 'graph [ '.implode(',', $attributeList) . " ];\n";
            }
        }

        if (isset($this->graph['nodes'])) {
            foreach($this->graph['nodes'] as $group => $nodes) {
                if ($group != 'default') {
                    $parsedGraph .= sprintf(
                      "subgraph \"cluster_%s\" {\nlabel=\"%s\";\n",

                      $group,
                      isset($this->graph['clusters'][$group]) ? $this->graph['clusters'][$group]['title'] : ''
                    );

                    if (isset($this->graph['clusters'][$group]['attributes'])) {
                        unset($attributeList);

                        foreach ($this->graph['clusters'][$group]['attributes'] as $key => $value) {
                            $attributeList[] = $key . '="' . $value . '"';
                        }

                        if (!empty($attributeList)) {
                            $parsedGraph .= implode(',', $attributeList) . ";\n";
                        }
                    }
                }

                foreach($nodes as $node => $attributes) {
                    unset($attributeList);

                    foreach($attributes as $key => $value) {
                        $attributeList[] = $key . '="' . $value . '"';
                    }

                    if (!empty($attributeList)) {
                        $parsedGraph .= sprintf(
                          "\"%s\" [ %s ];\n",
                          addslashes(stripslashes($node)),
                          implode(',', $attributeList)
                        );
                    }
                }

                if ($group != 'default') {
                  $parsedGraph .= "}\n";
                }
            }
        }

        if (isset($this->graph['edges'])) {
            foreach($this->graph['edges'] as $label => $node) {
                unset($attributeList);

                $from = key($node);
                $to   = $node[$from];

                foreach($this->graph['edgeAttributes'][$label] as $key => $value) {
                    $attributeList[] = $key . '="' . $value . '"';
                }

                $parsedGraph .= sprintf(
                  '"%s" -> "%s"',
                  addslashes(stripslashes($from)),
                  addslashes(stripslashes($to))
                );
                
                if (!empty($attributeList)) {
                    $parsedGraph .= sprintf(
                      ' [ %s ]',
                      implode(',', $attributeList)
                    );
                }

                $parsedGraph .= ";\n";
            }
        }

        return $parsedGraph . "}\n";
    }

    /**
    * Save GraphViz markup to file.
    *
    * @param  string  File to write the GraphViz markup to.
    * @return mixed   File to which the GraphViz markup was
    *                 written, FALSE on failure.
    * @access public
    */
    function saveParsedGraph($file = '') {
        $parsedGraph = $this->parse();

        if (!empty($parsedGraph)) {
            if (empty($file)) {
                $file = tempnam( TEMP_PKG_PATH.GraphViz.'/', 'graph_');
            }

            if ($fp = @fopen($file, 'w')) {
                @fputs($fp, $parsedGraph);
                @fclose($fp);

                return $file;
            }
        }

        return FALSE;
    }
}
?>
