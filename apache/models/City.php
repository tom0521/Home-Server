<?php
class City
{
    private $conn;
    private $table = 'city';

    public $city_id;
    public $city;
    public $state;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                city = :city,
                state = :state';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':city', $this->city);
        $stmt->bindParam(':state', $this->state);

        if($stmt->execute()){
            $this->city_id = $this->conn->lastInsertId();
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
            t.state,
            t.city';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}