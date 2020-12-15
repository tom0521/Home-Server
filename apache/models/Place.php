<?php
class Place
{
    private $conn;
    private $table = 'place';

    public $place_id;
    public $place;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                place = :place';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':place', $this->place);

        if($stmt->execute()){
            $this->place_id = $this->conn->lastInsertId();
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
            t.place';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read_single(){
        $where = array();
        if (isset($this->place_id)) array_push($where, 't.place_id = :place_id');
        if (isset($this->place)) array_push($where, 't.place = :place');
        $where_clause = empty($where) ? '' : 'WHERE ' . implode(' AND ', $where);

        $query = 'SELECT *
          FROM
            ' .$this->table . ' t ' .
          $where_clause;

        $stmt = $this->conn->prepare($query);
        
        if (isset($this->place_id)) $stmt->bindParam(':place_id', $this->place_id);
        if (isset($this->place)) $stmt->bindParam(':place', $this->place);

        $stmt->execute();
        return $stmt;
    }
}