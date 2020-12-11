<?php
class Transaction
{
    private $conn;
    private $table = 'transaction';

    public $transaction_id;
    public $timestamp;
    public $amount;
    public $address_id;
    public $receipt;
    public $payment_method_id;
    public $category_id;
    public $note;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                timestamp = :timestamp,
                amount = :amount,
                address_id = :address_id,
                receipt = :receipt,
                payment_method_id = :payment_method_id,
                category_id = :category_id,
                note = :note';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':timestamp', $this->timestamp);
        $stmt->bindParam(':amount', $this->amount);
        $stmt->bindParam(':address_id', $this->address_id);
        $stmt->bindParam(':receipt', $this->receipt);
        $stmt->bindParam(':payment_method_id', $this->payment_method_id);
        $stmt->bindParam(':category_id', $this->category_id);
        $stmt->bindParam(':note', $this->note);

        if($stmt->execute()){
            $this->transaction_id = $this->conn->lastInsertId();
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
            t.timestamp,
            t.transaction_id';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read_single(){
        $where_clause = (isset($this->transaction_id)) ? 'WHERE t.transaction_id = :transaction_id' : '';
        $query = 'SELECT *
          FROM 
            ' . $this->table . ' t ' .
          $where_clause .
          ' LIMIT 0,1';

        $stmt = $this->conn->prepare($query);

        if (isset($this->transaction_id)) $stmt->bindParam(':transaction_id', $this->transaction_id);

        $stmt->execute();
        return $stmt;
    }
}