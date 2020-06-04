<?php
class Transaction
{
    private $conn;
    private $table = 'transactions';

    public $id;
    public $date;
    public $time;
    public $amount;
    public $payment_method;
    public $location_id;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                date = :date,
                time = :time,
                amount = :amount,
                payment_method = :payment_method,
                location_id = :location_id';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':date', $this->date);
        $stmt->bindParam(':time', $this->time);
        $stmt->bindParam(':amount', $this->amount);
        $stmt->bindParam(':payment_method', $this->payment_method);
        $stmt->bindParam(':location_id', $this->location_id);

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
            t.date,
            t.time,
            t.amount,
            t.payment_method,
            t.location_id
          FROM 
            ' . $this->table . ' t
          ORDER BY 
            t.date, t.time';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}