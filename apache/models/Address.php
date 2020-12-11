<?php
class Address
{
    private $conn;
    private $table = 'address';

    public $address_id;
    public $place_id;
    public $address;
    public $address2;
    public $city_id;
    public $postal_code;
    public $phone;
    public $url;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                place_id = :place_id,
                address = :address,
                address2 = :address2,
                city_id = :city_id,
                postal_code = :postal_code,
                phone = :phone,
                url = :url';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':place_id', $this->place_id);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':address2', $this->address2);
        $stmt->bindParam(':city_id', $this->city_id);
        $stmt->bindParam(':postal_code', $this->postal_code);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':url', $this->url);

        if($stmt->execute()){
            $this->address_id = $this->conn->lastInsertId();
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
            t.address,
            t.address2,
            t.address_id';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read_single(){
        $where = array();
        if (isset($this->address_id)) array_push($where, 't.address_id = :address_id');
        if (isset($this->place_id)) array_push($where, 't.place_id = :place_id');
        if (isset($this->address)) array_push($where, 't.address = :address');
        if (isset($this->address2)) array_push($where, 't.address2 = :address2');
        if (isset($this->city_id)) array_push($where, 't.city_id = :city_id');
        if (isset($this->postal_code)) array_push($where, 't.postal_code = :postal_code');
        if (isset($this->phone)) array_push($where, 't.phone = :phone');
        if (isset($this->url)) array_push($where, 't.url = :url');
        $where_clause = empty($where) ? '' : 'WHERE ' . implode(' AND ', $where);

        $query = 'SELECT *
            FROM
                ' . $this->table . ' t ' .
            $where_clause . 
           'ORDER BY
                t.address,
                t.address2,
                t.address_id';

        $stmt = $this->conn->prepare($query);

        if (isset($this->address_id)) $stmt->bindParam(':address_id', $this->address_id);
        if (isset($this->place_id)) $stmt->bindParam(':place_id', $this->place_id);
        if (isset($this->address)) $stmt->bindParam(':address', $this->address);
        if (isset($this->address2)) $stmt->bindParam(':address2', $this->address2);
        if (isset($this->city_id)) $stmt->bindParam(':city_id', $this->city_id);
        if (isset($this->postal_code)) $stmt->bindParam(':postal_code', $this->postal_code);
        if (isset($this->phone)) $stmt->bindParam(':phone', $this->phone);
        if (isset($this->url)) $stmt->bindParam(':url', $this->url);

        $stmt->execute();
        return $stmt;
    }
}