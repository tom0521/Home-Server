<?php
class Payment_Method
{
    private $conn;
    private $table = 'payment_method';

    public $payment_method_id;
    public $payment_method;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                payment_method = :payment_method';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':payment_method', $this->payment_method);

        if($stmt->execute()){
            $this->payment_method_id = $this->conn->lastInsertId();
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
            t.payment_method';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}