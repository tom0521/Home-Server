<?php
class Location
{
    private $conn;
    private $table = 'locations';

    public $id;
    public $name;
    public $address;
    public $address_type;
    public $phone;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                name = :name,
                address = :address,
                address_type = :address_type,
                phone = :phone';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':address_type', $this->address_type);
        $stmt->bindParam(':phone', $this->phone);

        if($stmt->execute()){
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        printf("Error: %s. \n", $stmt->error);
        return false;
    }

    public function read(){
        $query = 'SELECT
            t.id,
            t.name,
            t.address,
            t.address_type,
            t.phone
          FROM
            ' . $this->table . ' t
          ORDER BY
            t.name, t.address';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read_single(){
        $query = 'SELECT
            t.id,
            t.name,
            t.address,
            t.address_type,
            t.phone
          FROM
            ' .$this->table . ' t
          WHERE
            id = :id
          LIMIT 0,1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->name = $row['name'];
        $this->address = $row['address'];
    }
}