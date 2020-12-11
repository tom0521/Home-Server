<?php
class City
{
    private $conn;
    private $table = 'city';

    public $city_id;
    public $city;
    public $state_province;
    public $country;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                city = :city,
                state_province = :state_province,
                country = :country';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':city', $this->city);
        $stmt->bindParam(':state_province', $this->state);
        $stmt->bindParam(':country', $this->country);

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
            t.country,
            t.state_province,
            t.city';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read_single(){
        $where = array();
        if (isset($this->city_id)) array_push($where, 't.city_id = :city_id');
        if (isset($this->city)) array_push($where, 't.city = :city');
        if (isset($this->state_province)) array_push($where, 't.state_province = :state_province');
        if (isset($this->country)) array_push($where, 't.country = :country');
        $where_clause = empty($where) ? '' : 'WHERE ' . implode(' AND ', $where);

        $query = 'SELECT *
          FROM
            ' . $this->table . ' t ' .
          $where_clause .
         'ORDER BY
            t.country,
            t.state_province,
            t.city';

        $stmt = $this->conn->prepare($query);

        if (isset($this->city_id)) $stmt->bindParam(':city_id', $this->city_id);
        if (isset($this->city)) $stmt->bindParam(':city', $this->city);
        if (isset($this->state_province)) $stmt->bindParam(':state_province', $this->state_province);
        if (isset($this->country)) $stmt->bindParam(':country', $this->country);

        $stmt->execute();
        return $stmt;
    }
}