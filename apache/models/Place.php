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
        $query = 'SELECT *
          FROM
            ' .$this->table . ' t
          WHERE
            place_id = :place_id
          LIMIT 0,1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':place_id', $this->place_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->name = $row['place'];
    }
}