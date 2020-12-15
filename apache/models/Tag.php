<?php
class Tag
{
    private $conn;
    private $table = 'tag';

    public $tag_id;
    public $tag;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                tag = :tag';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':tag', $this->tag);

        if($stmt->execute()){
            $this->tag_id = $this->conn->lastInsertId();
            return true;
        }

        printf("Error: %s. \n", $stmt->error);
        return false;
    }

    public function read(){
        $query = 'SELECT *
          FROM
            ' . $this->table . ' t
          ORDER BY
            t.tag';

        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        return $stmt;
    }

    public function read_single() {
        $where = array();
        if (isset($this->tag_id)) array_push($where, 't.tag_id = :tag_id');
        if (isset($this->tag)) array_push($where, 't.tag = :tag');
        $where_clause = empty($where) ? '' : 'WHERE ' . implode(' AND ', $where);

        $query = 'SELECT *
          FROM
            ' . $this->table . ' t ' .
          $where_clause;
        
        $stmt = $this->conn->prepare($query);
        
        if (isset($this->tag_id)) $stmt->bindParam(':tag_id', $this->tag_id);
        if (isset($this->tag)) $stmt->bindParam(':tag', $this->tag);

        $stmt->execute();
        return $stmt;
    }
}